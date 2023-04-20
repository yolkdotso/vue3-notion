<script setup lang="ts">
import { Block } from "@/lib/types"
import { useNotionBlock, defineNotionProps } from "@/lib/blockable"
import NotionTableOfContentsItem from "@/blocks/helpers/table-of-contents-item.vue"
import { computed } from "vue"

type BlockLevel = Block & {
  level: number
}

const props = defineProps({ ...defineNotionProps })
//@ts-ignore
const { block, parent, hasPageLinkOptions, pageLinkProps } = useNotionBlock(props)
const headers = ["heading_1", "heading_2", "heading_3"]
const headerObjects = computed(() => {
  if (!props.blockMap) return
  let temp: BlockLevel[] = []

  const haveAdded = new Set()

  Object.entries(props.blockMap).forEach(([key, value]) => {

    const correctPage = true // value.parent[value.parent.type] == parent.value.id
    if (headers.includes(value.type) && correctPage) {
      let level = 0
      if (temp.length) {
        let prevBlock = temp[temp.length - 1]
        if (value.type == "heading_1") {
        } else if (value.type == "heading_2") {
          level = 1
        } else if (value.type == prevBlock.type) {
          level = prevBlock.level
        } else if (value.type != prevBlock.type) {
          level = prevBlock.level + 1
        }
      }

      if (!haveAdded.has(value)) {
        temp.push({ ...value, level })
        haveAdded.add(value)
      }
    }
  })

  return temp
})
console.log("headers", headerObjects)
</script>

<script lang="ts">
export default {
  name: "NotionTableOfContent",
}
// 25b18655-20ee-436f-a3c2-0ec35716d7f2
</script>

<template>
  <div class="notion-table-of-contents">
    <template v-for="header in headerObjects">
      <a class="notion-page-link" :target="props.pageLinkTarget" :href="`#${header.id}`">
        <NotionTableOfContentsItem :block="header" :level="header.level" />
      </a>
    </template>
  </div>
</template>
