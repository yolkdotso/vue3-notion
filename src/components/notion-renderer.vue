<script setup lang="ts">
import { defineNotionProps, useNotionBlock } from "@/lib/blockable"
import NotionBlock from "@/components/block.vue"

// import "prismjs/themes/prism.css"
// import "katex/dist/katex.min.css"
import { computed } from "vue"

const props = defineProps({ ...defineNotionProps })
//@ts-ignore
const { pass, block, children } = useNotionBlock(props)
</script>

<script lang="ts">
export default {
  name: "NotionRenderer",
}
</script>

<template>
  <NotionBlock v-bind="pass" v-if="block">
    <NotionRenderer
      v-for="(contentId, contentIndex) in children"
      v-bind="pass"
      :key="contentId"
      :level="pass.level + 1"
      :content-id="contentId"
      :content-index="contentIndex"
    />
  </NotionBlock>
</template>
