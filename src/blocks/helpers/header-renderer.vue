<script setup lang="ts">
import { useNotionBlock, defineNotionProps } from "@/lib/blockable";
import NotionTextRenderer from "@/blocks/helpers/text-renderer.vue";

const props = defineProps({ ...defineNotionProps });
//@ts-ignore
const { type, title, pass, block } = useNotionBlock(props);
</script>

<script lang="ts">
export default {
  name: "NotionHeaderRenderer",
};
</script>

<template>
  <h1 class="notion-h1" :id="block.id" v-if="type === 'heading_1'">
    <NotionTextRenderer :text="title" v-bind="pass" />
  </h1>
  <h2 class="notion-h2" :id="block.id" v-else-if="type === 'heading_2'">
    <NotionTextRenderer :text="title" v-bind="pass" />
  </h2>
  <h3 class="notion-h3" :id="block.id" v-else-if="type === 'heading_3'">
    <NotionTextRenderer :text="title" v-bind="pass" />
  </h3>
</template>
