<script setup lang="ts">
import { useNotionBlock, defineNotionProps } from "@/lib/blockable"
import NotionTextRenderer from "@/blocks/helpers/text-renderer.vue"

const props = defineProps({ ...defineNotionProps })
//@ts-ignore
const { properties, title, text, pass, blockColorClass } = useNotionBlock(props)
</script>

<script lang="ts">
export default {
  name: "NotionText",
}
</script>
<template>
  <p v-if="text?.text?.length > 0 || title?.text?.length > 0" :class="['notion-text', blockColorClass()]">
    <NotionTextRenderer :text="text || title" v-bind="pass" />
  </p>
  <div v-else class="notion-blank">&nbsp;</div>
</template>
