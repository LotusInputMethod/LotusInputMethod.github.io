<script setup lang="ts">
import { onMounted } from 'vue';
import { initTheme } from '@/utils/theme';
import NavBar from '../components/NavBar.vue';
import HeroSection from '../components/HeroSection.vue';
import FeaturesSection from '../components/FeaturesSection.vue';
import InstallSection from '../components/InstallSection.vue';
import UsageSection from '../components/UsageSection.vue';
import UninstallSection from '../components/UninstallSection.vue';
import ContributorsSection from '../components/ContributorsSection.vue';
import FooterSection from '../components/FooterSection.vue';

onMounted(() => {
  initTheme();
});
</script>

<template>
  <div class="home-page">
    <NavBar />
    <HeroSection />
    <FeaturesSection />
    <InstallSection />
    <UsageSection />
    <UninstallSection />
    <ContributorsSection />
    <FooterSection />
  </div>
</template>
