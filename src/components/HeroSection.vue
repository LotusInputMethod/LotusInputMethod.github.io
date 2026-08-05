<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Download } from '@element-plus/icons-vue';
import { useGitHubStats } from '@/utils/github';
import { scrollToInstall, goToGitHub } from '@/utils/actions';

const fullText = 'Gõ không gạch chân cực mượt';
const displayText = ref<string>('');
const typingSpeed = 100;
let typingTimer: ReturnType<typeof setInterval>;
let resetTimer: ReturnType<typeof setTimeout>;

const startTyping = () => {
  let i = 0;
  displayText.value = '';
  typingTimer = setInterval(() => {
    if (i === fullText.length) {
      clearInterval(typingTimer);
      resetTimer = setTimeout(startTyping, 3000);
      return;
    }
    displayText.value = fullText.slice(0, ++i);
  }, typingSpeed);
};

const {
  starCount,
  contributorCount,
  latestVersion,
  latestReleaseUrl,
  fetchGithubStars,
  fetchLatestRelease,
} = useGitHubStats();

onMounted(() => {
  startTyping();
  fetchGithubStars();
  fetchLatestRelease();
});

onUnmounted(() => {
  clearInterval(typingTimer);
  clearTimeout(resetTimer);
});
</script>

<template>
  <header class="hero section-bg-mantle">
    <div class="container hero-container">
      <div class="hero-text">
        <div class="badge">
          <span class="badge-dot"></span> Tiên phong gõ không gạch chân
          (Non-preedit)
        </div>
        <h1>
          Gõ tiếng Việt
          <span class="text-gradient">mượt mà, không gạch chân</span> trên
          Linux
        </h1>
        <p class="hero-description">
          Trải nghiệm gõ phím tự nhiên như bộ gõ mặc định. Fcitx5 Lotus mang
          đến hiệu năng tuyệt đối với triết lý
          <strong>gõ trực tiếp (Non-preedit)</strong>, hỗ trợ hoàn hảo Telex,
          VNI và các tùy biến chuyên sâu.
        </p>
        <div class="hero-actions">
          <el-button type="primary" size="large" class="btn-install" @click="scrollToInstall">
            <el-icon class="mr-2">
              <Download />
            </el-icon> Cài đặt ngay
          </el-button>
          <el-button size="large" class="btn-source" @click="goToGitHub">
            <v-icon name="si-github" class="mr-2" scale="1.1" /> Xem trên
            GitHub
          </el-button>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <strong>
              <v-icon name="hi-star" scale="1.8" class="align-bottom mr-1" />
              {{ starCount }}
            </strong>
            <span>Stars</span>
          </div>
          <div class="stat-item">
            <strong>
              <v-icon name="si-linux" scale="1.8" class="align-bottom mr-1" />
              6+
            </strong>
            <span>Distros hỗ trợ</span>
          </div>
          <div class="stat-item">
            <strong>
              <v-icon name="hi-users" scale="1.8" class="align-bottom mr-1" />
              {{ contributorCount }}
            </strong>
            <span>Người đóng góp</span>
          </div>
          <div class="stat-item">
            <strong>
              <v-icon name="hi-tag" scale="1.8" class="align-bottom mr-1" />
              <a v-if="latestVersion" :href="latestReleaseUrl" target="_blank" class="release-link">
                {{ latestVersion }}
              </a>
              <span v-else>...</span>
            </strong>
            <span>Phiên bản</span>
          </div>
        </div>
      </div>

      <div class="hero-visual">
        <div class="terminal-mockup">
          <div class="term-header">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
            <span class="term-title">khoga@detem:~</span>
          </div>
          <div class="term-body">
            <p><span class="prompt">🪷 ❯</span> fcitx5-lotus --status</p>
            <p class="info">[INFO] Lotus Server is running (PID: 1337)</p>
            <p><span class="prompt">🪷 ❯</span> echo "{{ fullText }}"</p>
            <p class="typing">
              {{ displayText }}<span class="cursor"></span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Hero Section */
.hero {
  position: relative;
  padding: 160px 0 100px;
  background-color: var(--ctp-mantle);
  overflow: hidden;
  transition: background 0.3s;
}

.hero::before,
.hero::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

.hero::before {
  width: 480px;
  height: 480px;
  top: -140px;
  left: -140px;
  background: radial-gradient(circle,
      color-mix(in srgb, var(--ctp-green) 26%, transparent),
      transparent 70%);
}

.hero::after {
  width: 560px;
  height: 560px;
  bottom: -180px;
  right: -160px;
  background: radial-gradient(circle,
      color-mix(in srgb, var(--ctp-mauve) 22%, transparent),
      transparent 70%);
}

.hero-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
}

.hero-text {
  flex: 1;
  text-align: center;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: color-mix(in srgb, var(--ctp-green) 15%, transparent);
  color: var(--ctp-green);
  padding: 6px 16px;
  border-radius: 99px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 24px;
  border: 1px solid color-mix(in srgb, var(--ctp-green) 30%, transparent);
  transition: all 0.3s;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background-color: var(--ctp-green);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--ctp-green) 70%, transparent);
  }

  70% {
    box-shadow: 0 0 0 10px color-mix(in srgb, var(--ctp-green) 0%, transparent);
  }

  100% {
    box-shadow: 0 0 0 0 transparent;
  }
}

.hero h1 {
  font-size: 2.5rem;
  line-height: 1.2;
  margin-bottom: 20px;
  color: var(--ctp-text);
  font-weight: 800;
  transition: color 0.3s;
}

.text-gradient {
  background: linear-gradient(120deg,
      var(--ctp-green),
      var(--ctp-sky) 50%,
      var(--ctp-mauve));
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: text-shift 8s ease-in-out infinite;
}

@keyframes text-shift {

  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

.hero-description {
  font-size: 1.125rem;
  color: var(--ctp-subtext1);
  max-width: 600px;
  margin: 0 auto 30px;
  line-height: 1.6;
  transition: color 0.3s;
}

.hero-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 50px;
  flex-wrap: wrap;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  border-top: 1px solid var(--ctp-surface1);
  padding-top: 30px;
  flex-wrap: wrap;
  transition: border-color 0.3s;
}

.stat-item {
  text-align: center;
}

.stat-item strong {
  display: block;
  font-size: 2rem;
  color: var(--ctp-green);
  line-height: 1;
}

.stat-item span {
  font-size: 0.875rem;
  color: var(--ctp-subtext0);
  transition: color 0.3s;
}

/* Terminal */
.hero-visual {
  flex: 1;
  width: 100%;
  max-width: 600px;
  perspective: 1000px;
}

.terminal-mockup {
  background-color: var(--ctp-crust);
  border-radius: 12px;
  border: 1px solid var(--ctp-surface1);
  box-shadow:
    var(--el-box-shadow-light),
    0 0 40px color-mix(in srgb, var(--ctp-green) 18%, transparent);
  transform: rotateY(-5deg) rotateX(5deg);
  transition:
    transform 0.3s,
    background-color 0.3s,
    box-shadow 0.3s;
  overflow: hidden;
}

.terminal-mockup:hover {
  transform: rotateY(0) rotateX(0);
  box-shadow:
    var(--el-box-shadow-light),
    0 0 60px color-mix(in srgb, var(--ctp-green) 30%, transparent);
}

.term-header {
  background-color: var(--ctp-mantle);
  padding: 12px 16px;
  display: flex;
  gap: 8px;
  align-items: center;
  border-bottom: 1px solid var(--ctp-surface0);
  transition: background-color 0.3s;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot-red {
  background-color: var(--ctp-red);
}

.dot-yellow {
  background-color: var(--ctp-yellow);
}

.dot-green {
  background-color: var(--ctp-green);
}

.term-title {
  flex: 1;
  text-align: center;
  color: var(--ctp-subtext0);
  font-family: 'Maple Mono', monospace;
  font-size: 0.75rem;
}

.term-body {
  padding: 24px;
  font-family: 'Maple Mono', monospace;
  font-size: 0.875rem;
  color: var(--ctp-text);
  line-height: 1.6;
}

.prompt {
  color: var(--ctp-green);
}

.info {
  color: var(--ctp-subtext0);
  margin-bottom: 16px;
}

.typing {
  display: flex;
  align-items: center;
  min-height: 1.2em;
  color: var(--ctp-text);
  font-family: 'Maple Mono', monospace;
}

@keyframes blink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

.cursor {
  display: inline-block;
  width: 10px;
  height: 1.2em;
  background-color: var(--ctp-green);
  margin-left: 4px;
  animation: blink 1s step-end infinite;
}

@media (min-width: 992px) {
  .hero-container {
    flex-direction: row;
    text-align: left;
  }

  .hero-text {
    text-align: left;
  }

  .hero-description {
    margin: 0 0 30px 0;
  }

  .hero-actions {
    justify-content: flex-start;
  }

  .hero-stats {
    justify-content: flex-start;
  }

  .hero h1 {
    font-size: 3.5rem;
  }
}

.release-link {
  color: var(--ctp-green);
  text-decoration: none;
  transition: opacity 0.2s;
}

.release-link:hover {
  text-decoration: underline;
  opacity: 0.8;
}
</style>
