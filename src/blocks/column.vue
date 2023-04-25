<script setup lang="ts">
import { computed } from "vue";
import { useNotionBlock, defineNotionProps } from "@/lib/blockable"

const baseWidth = 46; // todo: add magic numbers to a config json

const props = defineProps({ ...defineNotionProps })
// @ts-ignore
const { parent } = useNotionBlock(props)

const siblings = computed(() => {
  if (!props.blockMap || !parent.value) return 0

  return Object.values(props.blockMap)
    .filter(
      // @ts-ignore
      (blk) => blk.parent?.type === 'workspace' ? false : blk.parent?.[blk.parent?.type] === parent.value?.id
    ).length
})

const columnStyle = computed(() => {
    // const columns = Number((1 / this.format.column_ratio).toFixed(0));
    const ratio = 0.5; // this.format.column_ratio
    const totalWidth = (siblings.value - 1) * baseWidth;
    return {
      width: `calc((100% - ${totalWidth}px) * ${ratio})`,
    };
});

const spacerStyle = computed(() => ({ width: `${baseWidth}px` }));
</script>

<script lang="ts">
export default {
  name: "NotionColumn",
};
</script>

<template>
  <div class="notion-column" :style="columnStyle">
    <slot />
  </div>
  <div class="notion-spacer" :style="spacerStyle" />
</template>
