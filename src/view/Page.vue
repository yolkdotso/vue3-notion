<script setup lang="ts">
import { NotionRenderer } from "../components"
import { getPageBlocks } from "../lib/api"
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import PQueue from 'p-queue'
import { mapPageUrl, pageLinkOptions } from "../lib/props"
import { Block, BlockMap, Page, PageMap } from "@/lib/types"

const getPage = async (
  pageId: string,
  apiUrl = "http://yolk-app.test/api/notion"
) => await fetch(`${apiUrl}?page=${pageId}`).then((res) => res.json()) as Page;
const getBlock = async (
  blockId: string,
  apiUrl = "http://yolk-app.test/api/notion"
) => await fetch(`${apiUrl}?block=${blockId}`).then((res) => res.json()) as Block;
const getChildren = async (
  pageId: string,
  apiUrl = "http://yolk-app.test/api/notion"
) => await fetch(`${apiUrl}?children=${pageId}`).then((res) => res.json()) as BlockMap;


async function getAllBlockChildren(pageId: string): Promise<Block[]>
{
  return Object.values(await getChildren(pageId)) as Block[]
}

async function resolvePage(
    rootBlockId: string,
    blockMap: BlockMap = {},
    pageMap: PageMap = {},
    {
      concurrency = 4
    } = {}
  ) {
    // const blockMap = {}
    // const pageMap = {}
    const parentMap: Record<string, string> = {}
    const blockChildrenMap: Record<string, string[]> = {}
    const pendingBlockIds = new Set<string>()
    const queue = new PQueue({ concurrency })

    const processBlock = async (
      blockId: string,
      { shallow = false } = {}
    ) => {
      if (!blockId || pendingBlockIds.has(blockId)) {
        return
      }

      pendingBlockIds.add(blockId)
      queue.add(async () => {
        try {
          let partialBlock = blockMap[blockId]
          if (!partialBlock) {
            partialBlock = await getBlock(blockId)
            blockMap[blockId] = partialBlock
          }

          const block = partialBlock
          if (block.type === 'child_page') {
            if (!pageMap[blockId]) {
              const partialPage = await getPage(blockId)

              pageMap[blockId] = partialPage

              const page = partialPage
              switch (page.parent?.type) {
                case 'page_id':
                  processBlock(page.parent.page_id, {
                    shallow: true
                  })
                  if (!parentMap[blockId]) {
                    parentMap[blockId] = page.parent.page_id
                  }
                  break

                case 'database_id':
                  processBlock(page.parent.database_id, {
                    shallow: true
                  })
                  if (!parentMap[blockId]) {
                    parentMap[blockId] = page.parent.database_id
                  }
                  break
              }
            }

            if (blockId !== rootBlockId) {
              // don't fetch children or recurse on subpages
              return
            }
          }

          if (shallow) {
            return
          }

          const children = await getAllBlockChildren(blockId) as Block[]
          blockChildrenMap[blockId] = children.map((child) => child.id)

          for (const child of children) {
            const childBlock = child
            const mappedChildBlock = blockMap[child.id]
            if (
              !mappedChildBlock ||
              (!mappedChildBlock.type && childBlock.type)
            ) {
              blockMap[child.id] = childBlock
              parentMap[child.id] = blockId

              const details = childBlock[childBlock.type]
              if (details?.text) {
                const richTextMentions = details.text.filter(
                  (richTextItem) => richTextItem.type === 'mention'
                )

                for (const richTextMention of richTextMentions) {
                  switch (richTextMention.mention?.type) {
                    case 'page': {
                      const pageId = richTextMention.mention.page.id
                      processBlock(pageId, { shallow: true })
                      break
                    }

                    case 'database': {
                      const databaseId = richTextMention.mention.database.id
                      processBlock(databaseId, { shallow: true })
                      break
                    }
                  }
                }
              }

              if (childBlock.type === 'link_to_page') {
                switch (childBlock.link_to_page?.type) {
                  case 'page_id':
                    processBlock(childBlock.link_to_page.page_id, {
                      shallow: true
                    })
                    break

                  case 'database_id':
                    processBlock(childBlock.link_to_page.database_id, {
                      shallow: true
                    })
                    break
                }
              }

              if (
                childBlock.has_children &&
                childBlock.type !== 'child_database'
              ) {
                processBlock(childBlock.id)
              }
            }
          }
        } catch (err) {
          console.warn('failed resolving block', blockId, err.message)
        } finally {
          pendingBlockIds.delete(blockId)
        }
      })
    }

    await processBlock(rootBlockId)
    await queue.onIdle()

    return {
      blockMap,
      blockChildrenMap,
      pageMap,
      parentMap
    }
  }

const route = useRoute()
const blockMap = ref<BlockMap>()
onMounted(async () => {

// const pageId = "c5135060-9518-4b5d-811d-7a947e3e8dab" // accounting
// const pageId = "7b7a75e6-6d53-4cf0-80bb-dfec9850c492" // key metrics
// const pageId = "cc30abfb-4384-4eda-a3ee-ac7019f05ee8" // process
// const pageId = "25b18655-20ee-436f-a3c2-0ec35716d7f2" // data room

  const pageId = route.params.id as string

  const { blockMap: result, blockChildrenMap, pageMap, parentMap } =
  await resolvePage(pageId) // , { [pageId]: block, ...children}, {[pageId]: page})

  window.blockMap = result
  blockMap.value = result

})
</script>

<template>
  <div v-if="blockMap && Object.keys(blockMap)">
    <NotionRenderer
      :blockMap="blockMap"
      fullPage
      prism
      katex
      :mapPageUrl="mapPageUrl"
      :pageLinkOptions="pageLinkOptions"
    />
  </div>
  <span v-else>no blocks</span>
</template>
