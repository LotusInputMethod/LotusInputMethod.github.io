<script setup lang="ts">
withDefaults(
  defineProps<{
    iconClass: string;
    title: string;
    cardClass?: string;
  }>(),
  {
    cardClass: '',
  },
);
</script>

<template>
  <div class="custom-card" :class="cardClass">
    <div class="icon-wrapper" :class="iconClass">
      <slot name="icon" />
    </div>
    <h3>{{ title }}</h3>
    <slot />
  </div>
</template>
