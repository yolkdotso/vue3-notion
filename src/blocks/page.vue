<script setup lang="ts">
import { useNotionBlock, defineNotionProps } from "@/lib/blockable"
// import NotionPageHeader from "@/blocks/helpers/page-header.vue"
import NotionPageIcon from "@/blocks/helpers/page-icon.vue"
import NotionTextRenderer from "@/blocks/helpers/text-renderer.vue"
import { computed, StyleValue } from "vue"
import { getTextContent } from "@/lib/utils"

const props = defineProps({ ...defineNotionProps })
//@ts-ignore
const { format, title, block, pass, hasPageLinkOptions, pageLinkProps } = useNotionBlock(props)

const coverStyle = computed(() => {
  const coverPosition = (1 - (format.value.page_cover_position || 0.5)) * 100
  return { objectPosition: `center ${coverPosition}%` }
})
const computedFont = computed<StyleValue>(() => {

  return { fontFamily: "Lyon-Text, Georgia, ui-serif, serif" }

  // todo: can we get this?
  // let font = (block.value.value.format?.page_font as string) || ""
  // if (font == "serif") {
  //   return { fontFamily: "Lyon-Text, Georgia, ui-serif, serif" }
  // } else if (font == "mono") {
  //   return { fontFamily: "iawriter-mono, Nitti, Menlo, Courier, monospace" }
  // }
})
</script>

<script lang="ts">
export default {
  name: "NotionPage",
}
</script>

<template>
  <div v-if="props.level === 0 && props.fullPage" class="notion" :style="computedFont">
    <!-- todo: add header -->
    <!-- <NotionPageHeader v-if="!hideHeader" v-bind="pass" /> -->
    <!-- todo: hide image if no .format is available -->
    <img
      v-if="format && format.page_cover"
      class="notion-page-cover"
      :style="coverStyle"
      :alt="getTextContent(title)"
      :src="props.mapImageUrl(format.page_cover, block)"
    />
    <main
      :class="[
        'notion-page',
        format && !format.page_cover && 'notion-page-offset',
        format && format.page_full_width && 'notion-full-width',
        format && format.page_small_text && 'notion-small-text',
      ]"
    >
      <NotionPageIcon v-bind="pass" big />
      <div class="notion-title">
        <NotionTextRenderer :text="title" v-bind="pass" />
      </div>
      <slot />
    </main>
  </div>
  <main v-else-if="props.level === 0" class="notion"><slot /></main>
  <component
    v-else-if="hasPageLinkOptions"
    class="notion-page-link"
    v-bind="pageLinkProps(block.id)"
    :is="props.pageLinkOptions?.component"
  >
    <div class="notion-page-icon">
      <NotionPageIcon v-bind="pass" />
    </div>
    <div class="notion-page-text">
      <NotionTextRenderer :text="title" v-bind="pass" />
    </div>
  </component>
  <a v-else class="notion-page-link" :target="props.pageLinkTarget" :href="props.mapPageUrl(block.id)">
    <div class="notion-page-icon">
      <NotionPageIcon v-bind="pass" />
    </div>
    <div class="notion-page-text">
      <NotionTextRenderer :text="title" v-bind="pass" />
    </div>
  </a>
</template>
