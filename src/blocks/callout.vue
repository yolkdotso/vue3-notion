<script setup lang="ts">
import { useNotionBlock, defineNotionProps } from "@/lib/blockable"
import NotionPageIcon from "@/blocks/helpers/page-icon.vue"
import NotionTextRenderer from "@/blocks/helpers/text-renderer.vue"
import NotionRenderer from "@/components/notion-renderer.vue"
import { CalloutBlock } from "@/lib/types";

const props = defineProps({ ...defineNotionProps })
//@ts-ignore
const { pass, title, blockColorClass, block, children } = useNotionBlock<CalloutBlock>(props)
</script>

<script lang="ts">
export default {
  name: "NotionCallout",
}
</script>

<template>
  <div :class="['notion-callout', blockColorClass()]">
    <div style="font-size: 12px">
      <NotionPageIcon v-bind="pass" />
    </div>
    <div class="notion-callout-text">
      <NotionTextRenderer :text="title" v-bind="pass" />
      <slot />
    </div>
  </div>
</template>
