<script setup lang="ts">
import { useNotionBlock, defineNotionProps } from "@/lib/blockable";
import { getTextContent } from "@/lib/utils";
import DefaultPageIcon from "./default-page-icon.vue";

const props = defineProps({ big: Boolean, ...defineNotionProps });
//@ts-ignore
const { icon, format, block, title } = useNotionBlock(props);
</script>

<script lang="ts">
export default {
  name: "NotionPageIcon",
};
</script>

<template>
  <div :class="[format?.page_cover && 'notion-page-icon-offset', big ? 'notion-page-icon-cover' : 'notion-page-icon']">
    <img
      v-if="icon?.type == 'file' && icon.file.url.includes('http') || icon?.type == 'external' && icon.external.url.includes('http')"
      :src="props.mapImageUrl(icon, block)"
      :alt="title ? getTextContent(title) : 'Icon'"
      class="notion-page-icon"
    />
    <span v-else-if="icon?.type == 'emoji'" role="img" :aria-label="icon.emoji" class="notion-page-icon">
      {{ icon.emoji }}
    </span>
    <DefaultPageIcon class="notion-page-icon" v-else-if="!big"></DefaultPageIcon>
  </div>
</template>
