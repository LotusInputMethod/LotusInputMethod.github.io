<script setup lang="ts">
import { Aim, Lightning, MagicStick, Check, ChatLineRound } from '@element-plus/icons-vue';
import FeatureCard from './FeatureCard.vue';
</script>

<template>
  <section id="features" class="section section-bg-base">
    <div class="container">
      <div class="section-title">
        <h2>Tính năng nổi bật</h2>
        <p>
          Thiết kế tối ưu cho trải nghiệm người dùng Linux, loại bỏ hoàn toàn
          sự khó chịu khi nhập liệu.
        </p>
      </div>

      <div class="features-grid">
        <FeatureCard iconClass="icon-primary" cardClass="highlight-card" title="Gõ trực tiếp (Non-preedit)">
          <template #icon><el-icon>
              <Aim />
            </el-icon></template>
          <p>
            <strong>Tính năng cốt lõi:</strong> Không còn đường gạch chân khó
            chịu khi đang gõ. Ký tự xuất hiện ngay lập tức, mang lại cảm giác
            gõ native 100%.
          </p>
        </FeatureCard>

        <FeatureCard iconClass="color-green" title="Hiệu năng cực cao">
          <template #icon><el-icon>
              <Lightning />
            </el-icon></template>
          <p>
            Gửi phím thông qua Uinput giúp loại bỏ hoàn toàn độ trễ, tối ưu
            tuyệt đối cho các ứng dụng có tốc độ xử lý nhanh.
          </p>
        </FeatureCard>

        <FeatureCard iconClass="color-mauve" title="Macro & Sửa lỗi thông minh">
          <template #icon><el-icon>
              <MagicStick />
            </el-icon></template>
          <p>
            Hỗ trợ gõ tắt mạnh mẽ, kiểm tra chính tả tự động, và tính năng tự
            động khôi phục từ khi gõ tiếng nước ngoài.
          </p>
        </FeatureCard>

        <FeatureCard iconClass="color-peach" title="Kiểm soát hoàn toàn">
          <template #icon><el-icon>
              <Check />
            </el-icon></template>
          <p>
            Tự định nghĩa Custom Keymap, hỗ trợ đặt dấu oà/uý chuẩn mới, cho
            phép bỏ dấu tự do ở bất kỳ vị trí nào.
          </p>
        </FeatureCard>

        <FeatureCard iconClass="color-pink" title="Emoji & Chế độ linh hoạt">
          <template #icon><el-icon>
              <ChatLineRound />
            </el-icon></template>
          <p>
            Tích hợp Emoji Picker siêu tốc với fuzzy search. Chuyển đổi linh
            hoạt giữa 8 chế độ gõ chỉ bằng một phím tắt.
          </p>
        </FeatureCard>

        <FeatureCard iconClass="color-sky" title="Chuẩn bài Linux">
          <template #icon><v-icon name="si-linux" scale="1.5" /></template>
          <p>
            Hoạt động ổn định trên X11/Wayland, tương thích ngược với Wine và
            hỗ trợ tối đa cho trình duyệt nhân Chromium.
          </p>
        </FeatureCard>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature-card {
  background-color: var(--ctp-surface0);
  padding: 30px;
  border-radius: 16px;
  border: 1px solid var(--ctp-surface1);
  transition:
    transform 0.3s,
    box-shadow 0.3s,
    border-color 0.3s,
    background-color 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--el-box-shadow-light);
  border-color: var(--ctp-green);
}
</style>
