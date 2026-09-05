<script setup lang="ts">
import { DocumentCopy } from '@element-plus/icons-vue';
import { copyToClipboard } from '@/utils/actions';
import CodeLines from './CodeLines.vue';

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
    <CodeLines :code="code" />
    <el-button class="copy-float" circle :size="size" :icon="DocumentCopy" @click="copyToClipboard(code)" />
  </div>
</template>
