<script setup lang="ts">
defineProps<{
  icon: string;
  name: string;
}>();
</script>

<template>
  <details class="uninstall-details">
    <summary>
      <div class="distro-label">
        <v-icon :name="icon" scale="1.4" class="mr-3" />
        <span>{{ name }}</span>
      </div>
    </summary>
    <div class="details-content">
      <slot />
    </div>
  </details>
</template>
