<script setup lang="ts">
import { Setting, Edit, Cpu, MagicStick, DocumentCopy, Aim } from '@element-plus/icons-vue';
import { quickSettings, advancedSettings, typingModes } from '@/data/usage';
import UsageTable from './UsageTable.vue';
import FeatureCard from './FeatureCard.vue';

const quickColumns = [
  { prop: 'option', label: 'Tùy chọn', width: 160 },
  { prop: 'description', label: 'Chức năng' },
  { prop: 'default', label: 'Mặc định', width: 120 },
];

const advancedColumns = [
  { prop: 'page', label: 'Trang', width: 160 },
  { prop: 'option', label: 'Tuỳ chọn', width: 200 },
  { prop: 'feature', label: 'Tính năng' },
];

const modeColumns = [
  { prop: 'mode', label: 'Chế độ', width: 200 },
  {
    prop: 'shortcut',
    label: 'Phím tắt',
    width: 100,
    align: 'center' as const,
    type: 'kbd' as const,
  },
  { prop: 'description', label: 'Mô tả' },
];
</script>

<template>
  <section id="usage" class="section section-bg-mantle">
    <div class="container">
      <div class="section-title">
        <h2>Hướng dẫn sử dụng & Tùy chỉnh</h2>
        <p>Làm chủ bộ gõ của bạn với các menu cài đặt đa dạng</p>
      </div>

      <div class="usage-tabs-wrapper">
        <el-tabs type="border-card" class="custom-tabs">
          <el-tab-pane>
            <template #label>
              <span class="tab-label">
                <el-icon>
                  <Setting />
                </el-icon>
                <span>Thiết lập nhanh</span>
              </span>
            </template>

            <div class="tab-content-inner">
              <div class="usage-header">
                <el-icon class="icon-title color-green">
                  <Setting />
                </el-icon>
                <h3>Cài đặt nhanh</h3>
              </div>
              <p class="text-sm instruction mb-3">
                Nhấp chuột phải vào biểu tượng Lotus trên khay hệ thống (System
                Tray):
              </p>
              <UsageTable :data="quickSettings" :columns="quickColumns" />
            </div>
          </el-tab-pane>

          <el-tab-pane>
            <template #label>
              <span class="tab-label">
                <el-icon>
                  <Edit />
                </el-icon>
                <span>Thiết lập nâng cao</span>
              </span>
            </template>

            <div class="tab-content-inner">
              <div class="usage-header">
                <el-icon class="icon-title color-mauve">
                  <Edit />
                </el-icon>
                <h3>Cài đặt nâng cao</h3>
              </div>
              <p class="text-sm instruction mb-3">
                Nhấp chuột phải vào biểu tượng Lotus trên khay hệ thống (System
                Tray) -> Settings
              </p>
              <UsageTable :data="advancedSettings" :columns="advancedColumns" />
            </div>
          </el-tab-pane>

          <el-tab-pane>
            <template #label>
              <span class="tab-label">
                <el-icon>
                  <Cpu />
                </el-icon>
                <span>Chế độ gõ</span>
              </span>
            </template>

            <div class="tab-content-inner">
              <div class="usage-header">
                <el-icon class="icon-title color-blue">
                  <Cpu />
                </el-icon>
                <h3>Menu chuyển chế độ gõ</h3>
              </div>
              <p class="text-sm instruction mb-3">
                Nhấn phím <code class="inline-code">`</code> (backtick) trong khi
                đang ở ô nhập liệu để mở nhanh menu chế độ gõ:
              </p>
              <UsageTable :data="typingModes" :columns="modeColumns" wrapperClass="mb-6" />

              <div class="alerts-grid mt-6">
                <el-alert title="Reset trạng thái đang gõ" type="info"
                  description="Chỉ cần nhấp chuột hoặc chạm touchpad trong khi đang gõ, bộ gõ sẽ tự động ngắt từ, ngăn chặn hiện tượng dính chữ."
                  :closable="false" class="custom-alert-info" />

                <el-alert title="Tuỳ chỉnh phím tắt" type="info"
                  description="Phím tắt menu chế độ gõ có thể thay đổi được trong phần cài đặt của Lotus để phù hợp với thói quen của bạn."
                  :closable="false" class="custom-alert-info" />
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane>
            <template #label>
              <span class="tab-label">
                <el-icon>
                  <MagicStick />
                </el-icon>
                <span>Mẹo hay</span>
              </span>
            </template>

            <div class="tab-content-inner">
              <div class="usage-header">
                <el-icon class="icon-title color-peach">
                  <MagicStick />
                </el-icon>
                <h3>QuickPhrase (Gõ nhanh)</h3>
              </div>
              <p class="text-sm instruction mb-4">
                Tính năng mạnh mẽ của Fcitx5 giúp bạn nhập nhanh Emoji, ký tự đặc biệt hoặc các đoạn văn bản mẫu thông
                qua từ khóa
                gợi ý.
              </p>

              <div class="quickphrase-demo mb-6">
                <div class="demo-label text-xs mb-2">Ví dụ cấu hình:</div>
                <div class="code-block m-0">
                  <pre><code>shrug ¯\_(ツ)_/¯
            \alpha α</code></pre>
                </div>
              </div>

              <div class="text-sm instruction bg-mantle p-4 rounded-lg border mb-6">
                <p class="mb-2">
                  <strong>Cách dùng:</strong> Nhấn phím <kbd class="kbd-key">;</kbd> hoặc <kbd
                    class="kbd-key">Super</kbd> + <kbd class="kbd-key">`</kbd> và nhập từ khóa (ví dụ:
                  <code>shrug</code>).
                </p>
                <p class="m-0">
                  <strong>Tùy chỉnh:</strong> Thêm dòng mới vào file
                  <code>~/.local/share/fcitx5/data/QuickPhrase.mb</code> theo
                  định dạng: <code>từ_khóa nội_dung</code>.
                </p>
              </div>

              <a href="https://fcitx-im.org/wiki/QuickPhrase" target="_blank"
                class="text-link text-sm inline-flex items-center">
                Xem chi tiết tại Fcitx5 Wiki <v-icon name="hi-external-link" class="ml-1" scale="0.8" />
              </a>
            </div>
          </el-tab-pane>

          <el-tab-pane>
            <template #label>
              <span class="tab-label">
                <el-icon>
                  <Setting />
                </el-icon>
                <span>Tính năng đặc biệt</span>
              </span>
            </template>

            <div class="tab-content-inner">
              <div class="usage-header">
                <el-icon class="icon-title color-sky">
                  <Setting />
                </el-icon>
                <h3>Những tính năng nổi bật</h3>
              </div>
              <p class="text-sm instruction mb-4">
                Khám phá các tính năng mạnh mẽ của Fcitx5 Lotus, quản lý trong
                <code class="inline-code">fcitx5-lotus-settings</code>.
              </p>

              <div class="special-features-grid">
                <FeatureCard iconClass="color-green" title="Chế độ theo ứng dụng (App Rules)">
                  <template #icon><el-icon>
                      <Cpu />
                    </el-icon></template>
                  <p>
                    Gán chế độ gõ riêng cho từng ứng dụng hoặc từng cửa sổ. Mở
                    menu chế độ gõ (phím <code class="inline-code">`</code>) rồi
                    chọn chế độ cho ứng dụng hiện tại, hoặc dùng
                    <code class="inline-code">fcitx5-lotus-settings</code> →
                    Applications.
                  </p>
                </FeatureCard>

                <FeatureCard iconClass="color-blue" title="Sao lưu & Phục hồi">
                  <template #icon><el-icon>
                      <DocumentCopy />
                    </el-icon></template>
                  <p>
                    Xuất/nhập toàn bộ cấu hình dạng file JSON, chọn lọc từng
                    thành phần: Main Settings, Macros, Custom Keymaps, App
                    Rules, Custom Dictionary.
                  </p>
                </FeatureCard>

                <FeatureCard iconClass="color-mauve" title="Gõ tắt $TIME / $DATE">
                  <template #icon><el-icon>
                      <MagicStick />
                    </el-icon></template>
                  <p>
                    Macro hỗ trợ placeholder động: <code>$TIME</code> và
                    <code>$DATE</code>. Ví dụ: <code>kg</code> →
                    <code>khô gà $TIME</code> sẽ tự chèn giờ hiện tại. Định
                    dạng tùy chỉnh qua Time Format và Date Format.
                  </p>
                </FeatureCard>

                <FeatureCard iconClass="color-peach" title="Preset bàn phím">
                  <template #icon><el-icon>
                      <Edit />
                    </el-icon></template>
                  <p>
                    Custom Keymap hỗ trợ sẵn các preset quen thuộc: Telex, VNI,
                    VIQR và Microsoft layout — dễ dàng chuyển đổi hoặc tùy biến
                    theo ý thích.
                  </p>
                </FeatureCard>

                <FeatureCard iconClass="color-sky" title="Emoji Picker thông minh">
                  <template #icon><el-icon>
                      <Aim />
                    </el-icon></template>
                  <p>
                    Tìm kiếm emoji với fuzzy matching và lịch sử 9 emoji gần
                    đây để chèn nhanh ký tự mong muốn.
                  </p>
                </FeatureCard>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Usage Tabs Overhaul */
.usage-tabs-wrapper {
  max-width: 1000px;
  margin: 0 auto;
}

.custom-tabs {
  background-color: var(--ctp-surface0);
  border: 1px solid var(--ctp-surface1);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--el-box-shadow-light);
}

.custom-tabs :deep(.el-tabs__header) {
  background-color: var(--ctp-mantle);
  border-bottom: 1px solid var(--ctp-surface1);
  margin: 0;
}

.custom-tabs :deep(.el-tabs__nav) {
  border: none;
}

.custom-tabs :deep(.el-tabs__item) {
  border: none;
  border-right: 1px solid var(--ctp-surface1);
  color: var(--ctp-subtext1);
  padding: 0 30px;
  height: 60px;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
}

.custom-tabs :deep(.el-tabs__item.is-active) {
  background-color: var(--ctp-surface0);
  color: var(--ctp-green);
  font-weight: bold;
}

.custom-tabs :deep(.el-tabs__content) {
  padding: 40px;
  background-color: var(--ctp-surface0);
}

.tab-content-inner {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alerts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.usage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.icon-title {
  font-size: 24px;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
