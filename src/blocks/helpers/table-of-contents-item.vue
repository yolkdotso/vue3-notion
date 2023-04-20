<script setup lang="ts">
import { useNotionBlock, defineNotionProps } from "@/lib/blockable"
import { Block, Heading1Block, Heading2Block, Heading3Block } from "@/lib/types";
import { PropType, computed, StyleValue } from "vue"

const props = defineProps({ block: Object as PropType<Heading1Block | Heading2Block | Heading3Block>, level: { type: Number, default: 0 } })

const content = computed(() => {
  if (!props.block) {
    return null
  }

  if (props.block.type == "heading_1") {
    return props.block.heading_1.text
  } else if (props.block.type == "heading_2") {
    return props.block.heading_2.text
  } else if (props.block.type == "heading_3") {
    return props.block.heading_3.text
  }
})
const computedText = computed(() => (content.value ? content.value.map((i) => i.plain_text).join("") : ""))
const computedStyle = computed(() => ({
  paddingLeft: 1.5 * props.level + "rem",
})) as StyleValue
</script>

<script lang="ts">
export default {
  name: "NotionTableOfContentItem",
}
</script>

<template>
  <span class="notion-table-of-contents-item" :style="computedStyle">{{ computedText }}</span>
</template>
