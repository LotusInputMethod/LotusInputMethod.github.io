<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ code: string }>();

const lines = computed(() => {
  const arr = props.code.split('\n');
  if (arr.length > 1 && arr[arr.length - 1] === '') arr.pop();
  return arr;
});

const gutter = computed(() => `${String(lines.value.length).length}ch`);
</script>

<template>
  <pre class="code-lines" :class="{ 'has-numbers': lines.length > 1 }" :style="{ '--ln-gutter': gutter }"><span
      v-for="(l, i) in lines" :key="i" class="code-lines-row">{{ l }}</span></pre>
</template>

<style scoped>
.code-lines {
  margin: 0;
  font-family: 'Maple Mono', monospace;
  font-size: 0.9rem;
  color: var(--ctp-text);
  line-height: 1.6;
  white-space: normal;
}

.code-lines.has-numbers {
  counter-reset: clnum;
}

.code-lines.has-numbers .code-lines-row {
  display: grid;
  grid-template-columns: var(--ln-gutter, 2ch) 1fr;
  column-gap: 0.9ch;
  align-items: start;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: normal;
}

.code-lines.has-numbers .code-lines-row::before {
  content: counter(clnum);
  counter-increment: clnum;
  justify-self: end;
  white-space: nowrap;
  color: var(--ctp-overlay1);
  opacity: 0.75;
  font-variant-numeric: tabular-nums;
  user-select: none;
}

.code-lines:not(.has-numbers) .code-lines-row {
  display: block;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: normal;
}
</style>
