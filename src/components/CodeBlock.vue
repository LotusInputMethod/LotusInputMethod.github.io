<script setup lang="ts">
import { DocumentCopy } from '@element-plus/icons-vue';
import { copyToClipboard } from '@/utils/actions';

withDefaults(
  defineProps<{
    code: string;
    size?: 'small' | 'default';
  }>(),
  {
    size: 'default',
  },
);
</script>

<template>
  <div class="code-container">
    <pre><code>{{ code }}</code></pre>
    <el-button class="copy-float" circle :size="size" :icon="DocumentCopy" @click="copyToClipboard(code)" />
  </div>
</template>
