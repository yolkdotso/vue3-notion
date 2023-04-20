import { defaultMapImageUrl, defaultMapPageUrl } from "@/lib/utils"
import { computed, ComputedRef, PropType } from "vue"
import { NotionBlockProps, BlockMap, Block } from "./types"
import { EmojiObject } from "./types"
import { FileObject } from "./types"

export const defineNotionProps = {
  blockMap: { type: Object as PropType<BlockMap>, required: true },
  contentId: { type: String, required: false },
  contentIndex: { type: Number, default: 0 },
  embedAllow: { type: String, default: "fullscreen" },
  fullPage: { type: Boolean, default: false },
  hideList: { type: Array, default: () => [] },
  level: { type: Number, default: 0 },
  mapImageUrl: { type: Function, default: defaultMapImageUrl },
  mapPageUrl: { type: Function, default: defaultMapPageUrl },
  pageLinkOptions: Object,
  pageLinkTarget: { type: String, default: "_self" },
  prism: { type: Boolean, default: false },
  katex: { type: Boolean, default: false },
  textLinkTarget: { type: String, default: "_blank" },
  _block: { type: Object as PropType<ComputedRef<Block>>, required: false },
}

export const useNotionBlock = <T extends Block>(props: Readonly<NotionBlockProps>) => {
  const block = computed<T>(() => {
    const id = props.contentId || Object.keys(props.blockMap)[0]
    return props.blockMap[id] as T
  })

  const pass = computed(() => {
    return {
      _block: block,
      blockMap: props.blockMap,
      contentId: props.contentId,
      contentIndex: props.contentIndex,
      embedAllow: props.embedAllow,
      fullPage: props.fullPage,
      hideList: props.hideList,
      level: props.level,
      mapImageUrl: props.mapImageUrl,
      mapPageUrl: props.mapPageUrl,
      pageLinkOptions: props.pageLinkOptions,
      prism: props.prism,
      katex: props.katex,
    }
  })

  const f = computed(() => {
    return {}


    return {
      block_aspect_ratio: block.value?.value?.format?.block_aspect_ratio,
      block_height: block.value?.value?.format?.block_height || 1,
      block_width: block.value?.value?.format?.block_width || 1,
      block_color: block.value?.value?.format?.block_color,
      bookmark_icon: block.value?.value?.format?.bookmark_icon,
      bookmark_cover: block.value?.value?.format?.bookmark_cover,
      display_source: block.value?.value?.format?.display_source,
    }
  })

  const format = computed(() => {}) // block.value?.value.format)
  const properties = computed(() => {}) // block.value?.value.properties)

  const icon = computed<EmojiObject | FileObject | null>(() => blockContent.value?.icon)
  const width = computed(() => format.value?.block_width)

  const title = computed(() => {
    const blk = block.value
    if (!blk) {
      return null
    }

    if (blk.type === 'child_page') {
      return blk[blk.type].title
    }

    const text = blk[blk.type]?.text
    return text ? { text } : text
  })

  const caption = computed(() => properties.value?.caption)
  const description = computed(() => properties.value?.description)

  const type = computed(() => {
    return block.value?.type
  })

  const visible = computed(() => {
    return type.value ? !props.hideList?.includes(type.value) : false
  })

  const hasPageLinkOptions = computed(() => {
    return props.pageLinkOptions?.component && props.pageLinkOptions?.href
  })
  const parent = computed(() => {
    if (!block.value?.parent || block.value.parent.type === 'workspace') {
      return null
    }

    const parent = block.value.parent
    return props.blockMap[
      // @ts-ignore
      parent[parent.type]
    ]
  })

  const children = computed(() => {
    return Object.values(props.blockMap)
    .filter(
      (blk) => blk.parent?.type === 'workspace' ? false : blk.parent?.[blk.parent?.type] === block.value?.id
    ).map(c => c.id)
  })

  const isType = (t: string | string[]) => {
    if (Array.isArray(t)) {
      return visible.value && t.includes(type.value)
    }
    return visible.value && type.value === t
  }

  const blockContent = computed(() => {
    const content = block.value[block.value.type]
    return content
  })

  const blockColorClass = (suffix = "") => {
    if (!block.value) return null

    const blockColor = blockContent.value.color
    return blockColor ? `notion-${blockColor}${suffix}` : undefined
  }

  const pageLinkProps = (id: string) => {
    return props.pageLinkOptions
      ? {
          [props.pageLinkOptions.href]: props.mapPageUrl(id),
        }
      : {}
  }

  return {
    props,
    block,
    pass,
    f,
    format,
    properties,
    icon,
    width,
    title,
    caption,
    description,
    type,
    visible,
    hasPageLinkOptions,
    parent,
    children,
    blockContent,

    isType,
    blockColorClass,
    pageLinkProps,
  }
}
