<script setup lang="ts">
import { onMounted } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { useGitHubStats } from '@/utils/github';
import { openLink } from '@/utils/actions';

const { contributors, fetchContributors } = useGitHubStats();

onMounted(() => {
  fetchContributors();
});
</script>

<template>
  <section id="contributors" class="section section-bg-base">
    <div class="container">
      <div class="section-title">
        <h2>Cộng đồng mã nguồn mở</h2>
        <p>Cảm ơn những người đã đóng góp xây dựng bộ gõ</p>
      </div>

      <div class="contributors-flex">
        <a v-for="c in contributors" :key="c.name" :href="c.githubUrl" target="_blank" rel="noopener"
          class="contributor-item">
          <el-avatar :size="80" :src="c.avatar" class="contributor-avatar" />
          <div class="c-name">{{ c.name }}</div>
          <div class="c-role">{{ c.role }}</div>
        </a>
      </div>

      <div class="custom-card contribute-action">
        <p class="instruction">
          Dự án mã nguồn mở luôn cần sự chung tay của bạn. Mọi đóng góp đều
          được trân trọng!
        </p>
        <el-button type="primary" size="large" @click="
          openLink(
            'https://github.com/LotusInputMethod/fcitx5-lotus/blob/main/CONTRIBUTING.md',
          )
          ">
          <el-icon class="mr-2">
            <Plus />
          </el-icon> Tham gia đóng góp ngay
        </el-button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Contributors */
.contributors-flex {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 24px;
  margin-bottom: 50px;
  justify-items: center;
}

@media (max-width: 1200px) {
  .contributors-flex {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
}

@media (max-width: 800px) {
  .contributors-flex {
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }
}

@media (max-width: 500px) {
  .contributors-flex {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

.contributor-item {
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.contributor-avatar {
  border: 3px solid var(--ctp-surface0);
  box-shadow: var(--el-box-shadow-light);
  margin-bottom: 12px;
  transition: border-color 0.3s;
}

.c-name {
  font-weight: 600;
  color: var(--ctp-text);
  margin-bottom: 4px;
  transition: color 0.3s;
}

.c-role {
  font-size: 0.875rem;
  color: var(--ctp-subtext1);
  transition: color 0.3s;
}

.contribute-action {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.contribute-action p {
  font-size: 1.1rem;
}
</style>
