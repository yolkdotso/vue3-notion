<script setup lang="ts">
import { useNotionBlock, defineNotionProps } from "@/lib/blockable"
import { RichTextObject } from "@/lib/types"
import NotionDecorator from "@/blocks/decorator.vue"
import { PropType } from "vue"

const props = defineProps({ text: Object as PropType<RichTextObject | String>, ...defineNotionProps })
//@ts-ignore
const { pass, format } = useNotionBlock(props)

const decorators = (text: RichTextObject) => {
  const {annotations, href} = text
  let decorators: Array<string | string[]> = [];

  if (!annotations) {
    return decorators
  }

  if (annotations.bold) {
    decorators.push("b");
  }
  if (annotations.italic) {
    decorators.push("i");
  }
  if (annotations.strikethrough) {
    decorators.push("s");
  }
  if (annotations.underline) {
    decorators.push("u");
  }
  if (annotations.code) {
    decorators.push("c");
  }
  if (href) {
    decorators.push(['a', href])
  }

  return decorators
}
</script>

<script lang="ts">
export default {
  name: "NotionTextRenderer",
}
</script>

<template>
  <span>
    <NotionDecorator v-for="(t, i) in text" :key="i" :content="t" v-bind="pass" v-if="false" />

    <template v-if="typeof text === 'string'">
      {{ text }}
    </template>
    <NotionDecorator
    v-else
      v-for="(t, i) in text.text"
      :key="i"
      :content="[t.text?.content ?? t.text]"
      :decorators="decorators(t)"
      v-bind="pass"
    />
  </span>
</template>
