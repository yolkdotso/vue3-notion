<script setup lang="ts">
import { useNotionBlock, defineNotionProps } from "@/lib/blockable"
import { RichTextObject } from "@/lib/types"
import NotionDecorator from "@/blocks/decorator.vue"
import { PropType, computed } from "vue"

type TextType = RichTextObject[] | String | {text: RichTextObject[]}
const props = defineProps({ text: Object as PropType<TextType>, ...defineNotionProps })
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

const _text = computed(() => {
  let text = props.text
  if (typeof text === 'undefined') {
    return
  }

  if (typeof text === 'string') {
    return
  }

  text = text as Exclude<TextType, String>

  const _t = (Array.isArray(text) ? text : text.text) as RichTextObject[]
  const res = _t.map(t => {
    if (t.type == 'text') {
      return { text: t.text.content, orig: t}
    }
    if (t.type == 'equation') {
      return { text: t.equation.expression, orig: t}
    }
    return null
  }).filter(x => x !== null)

  return res as { text: string, orig: RichTextObject }[]
})
</script>

<script lang="ts">
export default {
  name: "NotionTextRenderer",
}
</script>

<template>
  <span>
    <!-- <NotionDecorator v-for="(t, i) in text" :key="i" :content="t" v-bind="pass" v-if="false" /> -->

    <template v-if="typeof text === 'string'">
      {{ text }}
    </template>
    <NotionDecorator
      v-else-if="_text"
      v-for="(t, i) in _text"
      :key="i"
      :content="[t.text]"
      :decorators="decorators(t.orig)"
      v-bind="pass"
    />
  </span>
</template>
