<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Menu, Brush } from '@element-plus/icons-vue';
import { useTheme } from '@/utils/theme';
import { goToGitHub, scrollToTop } from '@/utils/actions';

const mobileMenuOpen = ref<boolean>(false);
const isScrolled = ref<boolean>(false);

const { currentTheme, cycleTheme, formatThemeName } = useTheme();

const handleScroll = (): void => {
  isScrolled.value = window.scrollY > 20;
};

const handleResize = (): void => {
  if (window.innerWidth > 900) {
    mobileMenuOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }" aria-label="Điều hướng chính">
    <div class="container nav-content">
      <div class="nav-brand" role="link" tabindex="0" aria-label="Về đầu trang" @click="scrollToTop"
        @keydown.enter="scrollToTop">
        <img src="/fcitx-lotus.svg" alt="Lotus Logo" class="logo" />
        <span class="brand-name">Fcitx5 Lotus</span>
      </div>

      <div class="nav-links desktop-only">
        <a href="#features">Tính năng</a>
        <a href="#installation">Cài đặt & Thiết lập</a>
        <a href="#usage">Hướng dẫn</a>
        <a href="#uninstall">Gỡ cài đặt</a>
        <a href="#contributors">Đóng góp</a>

        <el-button round class="btn-theme" @click="cycleTheme">
          <el-icon class="mr-2">
            <Brush />
          </el-icon>
          {{ formatThemeName(currentTheme) }}
        </el-button>

        <el-button type="primary" round class="btn-github" @click="goToGitHub">
          <v-icon name="si-github" class="mr-2" /> GitHub
        </el-button>
      </div>

      <div class="mobile-controls">
        <el-button circle class="btn-theme" aria-label="Đổi theme" @click="cycleTheme">
          <el-icon>
            <Brush />
          </el-icon>
        </el-button>
        <el-button class="mobile-menu-btn" text aria-label="Mở menu" :aria-expanded="mobileMenuOpen"
          @click="mobileMenuOpen = !mobileMenuOpen">
          <el-icon size="24">
            <Menu />
          </el-icon>
        </el-button>
      </div>
    </div>

    <Transition name="mobile-menu">
      <div v-if="mobileMenuOpen" class="mobile-menu">
        <a href="#features" @click="mobileMenuOpen = false">Tính năng</a>
        <a href="#installation" @click="mobileMenuOpen = false">Cài đặt & Thiết lập</a>
        <a href="#usage" @click="mobileMenuOpen = false">Hướng dẫn</a>
        <a href="#uninstall" @click="mobileMenuOpen = false">Gỡ cài đặt</a>
        <a href="#contributors" @click="mobileMenuOpen = false">Đóng góp</a>
        <el-button type="primary" @click="goToGitHub">
          <v-icon name="si-github" class="mr-2" /> GitHub
        </el-button>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
/* Navbar */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: color-mix(in srgb, var(--ctp-base) 85%, transparent);
  backdrop-filter: blur(10px);
  z-index: 1000;
  transition:
    background-color 0.3s,
    border-color 0.3s;
  border-bottom: 1px solid transparent;
}

.navbar.scrolled {
  border-bottom: 1px solid var(--ctp-surface1);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.nav-brand .logo {
  width: 36px;
  height: 36px;
  transition: transform 0.3s ease;
}

.nav-brand .logo:hover {
  transform: scale(1.1);
}

.nav-brand .brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--ctp-text);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-links a {
  color: var(--ctp-subtext1);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: var(--ctp-green);
}

.mobile-menu {
  background-color: var(--ctp-surface0);
  border-top: 1px solid var(--ctp-surface1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: center;
  position: absolute;
  width: 100%;
  box-shadow: var(--el-box-shadow-light);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.mobile-menu a {
  color: var(--ctp-text);
  text-decoration: none;
  font-weight: 500;
}

.mobile-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

@media (max-width: 900px) {
  .desktop-only {
    display: none;
  }
}

@media (min-width: 901px) {
  .mobile-controls {
    display: none;
  }

  .mobile-menu {
    display: none !important;
  }
}
</style>
