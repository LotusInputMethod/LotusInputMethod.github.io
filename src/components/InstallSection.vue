<script setup lang="ts">
import InteractiveInstaller from './InteractiveInstaller.vue';
</script>

<template>
  <section id="installation" class="section section-bg-mantle">
    <div class="container">
      <div class="section-title">
        <h2>Cài đặt & Thiết lập</h2>
        <p>
          Chọn cấu hình hệ thống của bạn để nhận hướng dẫn cài đặt tối ưu
          nhất.
        </p>
      </div>
      <div class="installer-wrapper">
        <InteractiveInstaller />
      </div>
    </div>
  </section>
</template>
