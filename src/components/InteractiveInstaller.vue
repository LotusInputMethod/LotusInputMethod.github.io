<script setup lang="ts">
import { ref, computed } from 'vue';
import { DocumentCopy } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { 
  distros, 
  methods, 
  shells, 
  deWms, 
  environments, 
  logic, 
  fcitx5Config, 
  kanataConfig 
} from '@/data/installer';

const selectedDistro = ref(distros[0].name);
const selectedMethod = ref(methods[0]);
const selectedShell = ref(shells[0]);
const selectedDe = ref(deWms[0]);
const selectedEnv = ref(environments[1]);

const activateServerCode = computed(() => {
  if (selectedDistro.value === 'NixOS') return '# Bước này đã được cấu hình trong flake.nix ở trên.';
  if (isAutoHandled.value) {
    return '# Gói .deb sẽ tự động thực hiện bước này.\n' + serverCmd.value;
  }
  return serverCmd.value;
});

const shellConfigCode = computed(() => {
  if (selectedDistro.value === 'NixOS') return '# Bước này đã được cấu hình trong flake.nix ở trên.';
  if (isAutoHandled.value) {
    return '# Gói .deb sẽ tự động thiết lập biến môi trường.\n' + envCmd.value;
  }
  return envCmd.value;
});

const serverCmd = computed(() => {
  if (selectedShell.value === 'Fish') return "sudo systemctl enable --now fcitx5-lotus-server@(whoami).service; or begin; sudo systemd-sysusers; and sudo systemctl enable --now fcitx5-lotus-server@(whoami).service; end";
  return "sudo systemctl enable --now fcitx5-lotus-server@$(whoami).service || (sudo systemd-sysusers && sudo systemctl enable --now fcitx5-lotus-server@$(whoami).service)";
});

const envCmd = computed(() => {
  // Default for X11 and other Wayland DEs
  const defaultVars = [
    "export GTK_IM_MODULE=fcitx",
    "export QT_IM_MODULE=fcitx",
    "export XMODIFIERS=@im=fcitx",
    "export SDL_IM_MODULE=fcitx",
    "export GLFW_IM_MODULE=ibus"
  ];

  let vars;

  if (selectedEnv.value === 'Wayland') {
    if (selectedDe.value === 'KDE Plasma') {
      vars = [
        "export XMODIFIERS=@im=fcitx",
        "export GLFW_IM_MODULE=ibus"
      ];
    } else if (selectedDe.value === 'GNOME' || selectedDe.value === 'Sway') {
      vars = [
        "export XMODIFIERS=@im=fcitx",
        "export QT_IM_MODULE=fcitx",
        "export QT_IM_MODULES=\"wayland;fcitx\"",
        "export GLFW_IM_MODULE=ibus"
      ];
    } else {
      vars = defaultVars;
    }
  } else {
    vars = defaultVars;
  }

  if (selectedShell.value === 'Bash') {
    return `cat <<EOF >> ~/.bash_profile\n${vars.join('\n')}\nEOF`;
  } else if (selectedShell.value === 'Zsh') {
    return `cat <<EOF >> ~/.zprofile\n${vars.join('\n')}\nEOF`;
  } else {
    // Fish
    const fishVars = vars.map(v => {
      const parts = v.split('=');
      const name = parts[0].replace('export ', '');
      const val = parts[1];
      return `    set -Ux ${name} ${val}`;
    });
    return `echo 'if status is-login\n${fishVars.join('\n')}\nend' >> ~/.config/fish/config.fish`;
  }
});

const isAutoHandled = computed(() => {
  return ['Debian', 'Ubuntu'].includes(selectedDistro.value) && selectedMethod.value === 'Package Manager';
});

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success('Đã sao chép!');
  } catch (err) {
    ElMessage.error('Không thể sao chép');
  }
};

const installStepCode = computed(() => {
  const distroInfo = logic.steps.install[selectedDistro.value as keyof typeof logic.steps.install];
  if (!distroInfo) return 'Cấu hình chưa sẵn sàng.';
  return (distroInfo as any)[selectedMethod.value] || 'Phương thức chưa sẵn sàng.';
});

const autostartText = computed(() => logic.steps.autostart[selectedDe.value as keyof typeof logic.steps.autostart]);

// Wayland Logic
const waylandGeneral = computed(() => {
  if (selectedEnv.value !== 'Wayland') return null;
  return logic.steps.wayland_extras.General;
});

const waylandDeSpecific = computed(() => {
  if (selectedEnv.value !== 'Wayland') return null;
  return (logic.steps.wayland_extras as any)[selectedDe.value] || null;
});

const chromiumWaylandFlags = "--enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime --wayland-text-input-version=3";

</script>

<template>
  <div class="installer-component">
    <div class="installer-grid">
      <!-- Controls -->
      <div class="controls-card">
        <div class="control-item">
          <label>Distro</label>
          <div class="distro-grid">
            <div 
              v-for="d in distros" 
              :key="d.name" 
              class="distro-card"
              :class="{ active: selectedDistro === d.name }"
              @click="selectedDistro = d.name"
            >
              <v-icon :name="d.icon" scale="1.5" />
              <span>{{ d.name }}</span>
            </div>
          </div>
        </div>

        <div class="control-item">
          <label>Desktop Environment / WM</label>
          <div class="de-grid">
            <div 
              v-for="de in deWms" 
              :key="de" 
              class="de-card"
              :class="{ active: selectedDe === de }"
              @click="selectedDe = de"
            >
              <span>{{ de }}</span>
            </div>
          </div>
        </div>

        <div class="control-item">
          <label>Môi trường</label>
          <div class="option-grid">
            <div 
              v-for="e in environments" 
              :key="e" 
              class="option-card"
              :class="{ active: selectedEnv === e }"
              @click="selectedEnv = e"
            >
              <span>{{ e }}</span>
            </div>
          </div>
        </div>

        <div class="control-item">
          <label>Phương thức cài đặt</label>
          <div class="option-grid">
            <div 
              v-for="m in methods" 
              :key="m" 
              class="option-card"
              :class="{ active: selectedMethod === m }"
              @click="selectedMethod = m"
            >
              <span>{{ m }}</span>
            </div>
          </div>
        </div>

        <div class="control-item">
          <label>Shell đang dùng</label>
          <div class="option-grid">
            <div 
              v-for="s in shells" 
              :key="s" 
              class="option-card"
              :class="{ active: selectedShell === s }"
              @click="selectedShell = s"
            >
              <span>{{ s }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Output -->
      <div class="output-area">
        <div class="step-card">
          <div class="step-badge">1</div>
          <div class="step-content">
            <h4>Cài đặt gói</h4>
            <div class="code-container">
              <pre><code>{{ installStepCode }}</code></pre>
              <el-button class="copy-float" circle :icon="DocumentCopy" @click="copyToClipboard(installStepCode)" />
            </div>
          </div>
        </div>

        <div class="step-card">
          <div class="step-badge">2</div>
          <div class="step-content">
            <h4>Kích hoạt Server</h4>
            <div v-if="isAutoHandled" class="mb-3">
              <el-alert title="Gói .deb sẽ tự động kích hoạt server qua post-install script. Bạn có thể bỏ qua bước này." type="success" :closable="false" />
            </div>
            <div class="code-container">
              <pre><code>{{ activateServerCode }}</code></pre>
              <el-button class="copy-float" circle :icon="DocumentCopy" @click="copyToClipboard(activateServerCode)" />
            </div>
          </div>
        </div>

        <div class="step-card">
          <div class="step-badge">3</div>
          <div class="step-content">
            <h4>Thiết lập biến môi trường (Shell)</h4>
            <div v-if="isAutoHandled" class="mb-3">
              <el-alert title="Gói .deb sẽ tự động thiết lập biến môi trường. Bạn có thể bỏ qua bước này." type="success" :closable="false" />
            </div>
            <div class="code-container">
              <pre><code>{{ shellConfigCode }}</code></pre>
              <el-button class="copy-float" circle :icon="DocumentCopy" @click="copyToClipboard(shellConfigCode)" />
            </div>
          </div>
        </div>

        <div class="step-card">
          <div class="step-badge">4</div>
          <div class="step-content">
            <h4>Tắt bộ gõ cũ (IBus)</h4>
            <div v-if="isAutoHandled" class="mb-3">
              <el-alert title="Gói .deb sẽ tự động tắt IBus. Bước này chỉ dùng để kiểm tra lại." type="success" :closable="false" />
            </div>
            <p class="instruction">Nếu máy bạn đang dùng IBus, hãy tắt nó đi trước khi chuyển sang Fcitx5 để tránh xung đột.</p>
            <div class="code-container mini">
              <pre><code>killall ibus-daemon || ibus exit</code></pre>
              <el-button class="copy-float" circle :icon="DocumentCopy" size="small" @click="copyToClipboard('killall ibus-daemon || ibus exit')" />
            </div>
            <p class="instruction mt-2" style="font-size: 0.85rem">
              * Lưu ý: Hãy tắt autostart của IBus (thường là ibus-daemon hoặc ibus). Tốt nhất là gỡ cài đặt IBus nếu không sử dụng.
            </p>
            <el-alert title="Lưu ý: Bạn cần Đăng xuất và Đăng nhập lại sau bước này để cấu hình Shell có hiệu lực." type="info" :closable="false" class="mt-4" />
          </div>
        </div>

        <div class="step-card">
          <div class="step-badge">5</div>
          <div class="step-content">
            <h4>Tự động khởi chạy (Autostart)</h4>
            <div class="ui-nav-container">
              {{ autostartText }}
            </div>
          </div>
        </div>

        <div class="step-card">
          <div class="step-badge">6</div>
          <div class="step-content">
            <h4>Cấu hình bộ gõ Fcitx5</h4>
            <p class="instruction">Sau khi đã Log out và Log in lại:</p>
            <ul class="setup-list-mini">
              <li v-for="(step, idx) in fcitx5Config.steps" :key="idx" v-html="step"></li>
            </ul>
          </div>
        </div>

        <div class="step-card additional-card">
          <div class="step-badge">7</div>
          <div class="step-content">
            <h4>Cấu hình bổ sung</h4>

            <!-- GNOME Note (Alert) -->
            <div v-if="selectedDe === 'GNOME'" class="mb-4">
              <el-alert 
                title="Lưu ý quan trọng cho GNOME" 
                type="warning" 
                show-icon 
                :closable="false"
              >
                <p style="margin: 0; line-height: 1.5;">
                  Ưu tiên sử dụng extension <b>AppIndicator and KStatusNotifierItem Support</b> để hiển thị đúng biểu tượng Lotus trên systray. <b>Tránh sử dụng Kimpanel</b> vì có thể gây lỗi hiển thị.
                </p>
              </el-alert>
            </div>
            
            <!-- Wayland Extras -->
            <div v-if="selectedEnv === 'Wayland'">
              <!-- General Recommendation -->
              <div v-if="waylandGeneral" class="extra-item mb-4">
                <el-alert 
                  :title="waylandGeneral.title" 
                  type="info" 
                  :closable="false"
                  show-icon
                >
                  <p style="margin: 0; line-height: 1.5;">{{ waylandGeneral.description }}</p>
                </el-alert>
              </div>

              <!-- DE Specific Setup -->
              <div v-if="waylandDeSpecific" class="wayland-setup-section mb-6">
                <h5 class="mb-2">{{ selectedDe }} Wayland Configuration</h5>
                
                <div class="wayland-details p-4">
                  <p class="instruction mb-2"><b>Thành phần hỗ trợ:</b> {{ waylandDeSpecific.support_info }}</p>
                  
                  <div v-if="waylandDeSpecific.best_setup && waylandDeSpecific.best_setup.length > 0">
                    <p class="instruction"><b>Hướng dẫn cài đặt tốt nhất:</b></p>
                    <ul class="setup-list-mini">
                      <li v-for="(point, idx) in waylandDeSpecific.best_setup" :key="idx">{{ point }}</li>
                    </ul>
                  </div>

                  <el-alert 
                    v-if="waylandDeSpecific.caveats" 
                    title="Lưu ý" 
                    type="warning" 
                    :closable="false"
                    class="mt-2"
                  >
                    <p style="margin: 0; line-height: 1.4; font-size: 0.85rem;">{{ waylandDeSpecific.caveats }}</p>
                  </el-alert>
                </div>
              </div>

              <!-- Chromium Flags (Common) -->
              <div class="extra-item mb-4">
                <p class="instruction"><b>Chromium / Electron:</b> Bật hỗ trợ bộ gõ Wayland:</p>
                <div class="code-container mini">
                  <pre><code>{{ chromiumWaylandFlags }}</code></pre>
                  <el-button class="copy-float" circle :icon="DocumentCopy" size="small" @click="copyToClipboard(chromiumWaylandFlags)" />
                </div>
              </div>
            </div>

            <!-- Kanata -->
            <div class="extra-item">
              <p class="instruction"><b>{{ kanataConfig.title }}:</b> {{ kanataConfig.desc }}</p>
              <div class="code-container mini">
                <pre><code>{{ kanataConfig.code }}</code></pre>
                <el-button class="copy-float" circle :icon="DocumentCopy" size="small" @click="copyToClipboard(kanataConfig.code)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.installer-component {
  padding: 0;
}

.installer-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2.5rem;
}

@media (max-width: 1024px) {
  .installer-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

/* Sidebar Styling */
.controls-card {
  background-color: var(--ctp-surface0);
  border: 1px solid var(--ctp-surface1);
  padding: 2rem 1.5rem 2rem 1.25rem;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 100px;
  box-shadow: var(--el-box-shadow-light);
  transition: background-color 0.3s, border-color 0.3s;
}

.control-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.control-item label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--ctp-subtext1);
  letter-spacing: 0.02em;
}

/* Specific Select/Radio adjustments */
:deep(.el-select .el-input__wrapper),
:deep(.el-input__wrapper) {
  background-color: var(--ctp-mantle) !important;
  box-shadow: 0 0 0 1px var(--ctp-surface2) inset !important;
  border: none !important;
}

:deep(.el-input__inner) {
  color: var(--ctp-text) !important;
}

/* Fix for Select Box white background (not used anymore but keeping just in case) */
:deep(.el-input__wrapper) {
  background-color: var(--ctp-mantle) !important;
  box-shadow: 0 0 0 1px var(--ctp-surface1) inset !important;
  border-radius: 12px !important;
  padding: 8px 16px !important;
}

:deep(.el-input__inner) {
  color: var(--ctp-text) !important;
  font-weight: 500;
}

/* Grids styling */
.distro-grid, .de-grid, .option-grid {
  display: grid;
  gap: 12px;
}

.distro-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.de-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.option-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 480px) {
  .distro-grid, .de-grid {
    grid-template-columns: 1fr;
  }
}

.distro-card, .de-card, .option-card {
  background: var(--ctp-mantle);
  border: 1px solid var(--ctp-surface1);
  border-radius: 8px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--ctp-subtext1);
  text-align: center;
}

.option-card {
  padding: 6px 12px;
  border-radius: 8px;
}

.distro-card {
  justify-content: flex-start;
  gap: 10px;
}

.distro-card:hover, .de-card:hover, .option-card:hover {
  border-color: var(--ctp-green);
  transform: translateY(-1px);
}

.distro-card.active, .de-card.active, .option-card.active {
  background: color-mix(in srgb, var(--ctp-green) 15%, var(--ctp-surface1));
  border-color: var(--ctp-green);
  color: var(--ctp-green);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--ctp-green) 30%, transparent);
  font-weight: 700;
}

.distro-card svg {
  flex-shrink: 0;
}

.distro-card span, .option-card span {
  font-size: 0.85rem;
}

.de-card span {
  font-size: 0.75rem;
  font-weight: 500;
}

/* Output Area */
.output-area {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.step-card {
  background-color: var(--ctp-surface0);
  border: 1px solid var(--ctp-surface1);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  gap: 1.5rem;
  position: relative;
  box-shadow: var(--el-box-shadow-light);
  transition: transform 0.3s, border-color 0.3s;
}

.step-card:hover {
  border-color: var(--ctp-green);
}

.step-badge {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background-color: color-mix(in srgb, var(--ctp-green) 15%, transparent);
  color: var(--ctp-green);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
  border: 1px solid color-mix(in srgb, var(--ctp-green) 30%, transparent);
}

.step-content {
  flex: 1;
}

.step-content h4 {
  margin: 0 0 1.25rem 0;
  font-size: 1.25rem;
  color: var(--ctp-text);
  font-weight: 700;
}

.code-container {
  background-color: var(--ctp-crust);
  padding: 1.25rem;
  border-radius: 12px;
  position: relative;
  border: 1px solid var(--ctp-surface1);
  margin-bottom: 1rem;
}

.code-container.mini {
  padding: 0.75rem 1rem;
  margin-top: 0.5rem;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--ctp-text);
}

code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
}

.copy-float {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background-color: var(--ctp-surface1) !important;
  border: 1px solid var(--ctp-surface2) !important;
  color: var(--ctp-text) !important;
  transition: all 0.2s;
  opacity: 0.6;
}

.copy-float:hover {
  opacity: 1;
  background-color: var(--ctp-green) !important;
  color: var(--ctp-base) !important;
  border-color: var(--ctp-green) !important;
}

.instruction {
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  color: var(--ctp-subtext1);
}

.extra-item {
  margin-bottom: 1.5rem;
}

.extra-item h5 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: var(--ctp-subtext1);
  font-weight: 600;
}

.wayland-card {
  border: 2px solid var(--ctp-peach);
  background-color: color-mix(in srgb, var(--ctp-peach) 5%, var(--ctp-surface0));
}

.wayland-card .step-badge {
  background-color: color-mix(in srgb, var(--ctp-peach) 15%, transparent);
  color: var(--ctp-peach);
  border-color: color-mix(in srgb, var(--ctp-peach) 30%, transparent);
}

.wayland-card h4 {
  color: var(--ctp-peach);
}

:deep(.el-alert) {
  background-color: color-mix(in srgb, var(--ctp-blue) 10%, var(--ctp-surface0)) !important;
  border: 1px solid var(--ctp-blue) !important;
  border-radius: 8px;
}

:deep(.el-alert__title) {
  color: var(--ctp-blue) !important;
  font-weight: 600;
}

:deep(.el-alert__description) {
  color: var(--ctp-text) !important;
}

/* Utility Classes */
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mt-2 { margin-top: 0.5rem; }

.wayland-setup-section {
  margin-bottom: 1.5rem;
}

.setup-list-mini {
  padding-left: 1.25rem;
  margin: 0.75rem 0;
  color: var(--ctp-subtext0);
  font-size: 0.95rem;
  line-height: 1.6;
}

.setup-list-mini li {
  margin-bottom: 0.5rem;
}

.wayland-details {
  background-color: var(--ctp-mantle);
  border-radius: 8px;
  border: 1px solid var(--ctp-surface1);
  overflow: hidden;
}

.wayland-details summary {
  padding: 0.75rem 1rem;
  font-weight: 700;
  color: var(--ctp-peach);
  cursor: pointer;
  transition: background-color 0.2s;
  user-select: none;
}

.wayland-details summary:hover {
  background-color: var(--ctp-surface1);
}

.details-content {
  padding: 1rem;
  border-top: 1px solid var(--ctp-surface1);
  font-size: 0.9rem;
  color: var(--ctp-subtext1);
  line-height: 1.5;
}

.info-item strong {
  color: var(--ctp-text);
}

.ui-nav-container {
  background-color: var(--ctp-mantle);
  border: 1px dashed var(--ctp-surface2);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: var(--ctp-text);
  font-weight: 600;
  font-family: inherit;
  margin-top: 0.5rem;
}

.code-container.mini {
  margin-top: 0.5rem;
}

.code-container.mini pre {
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
}
</style>
