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
  initSystems,
  logic,
  fcitx5Config,
  kanataConfig,
  userCreationCmd,
  udevReloadCmd,
  uinputModprobeCmd,
  type StepBlock,
} from '@/data/installer';

const selectedDistro = ref(distros[0]?.name || '');
const selectedMethod = ref<string>(methods[0] || '');
const selectedShell = ref<string>(shells[0] || '');
const selectedDe = ref<string>(deWms[0] || '');
const selectedEnv = ref<string>(environments[0] || '');
const selectedInit = ref<string>(initSystems[0] || 'systemd');

const needsUserCreation = computed(() => {
  return (
    selectedDistro.value !== 'NixOS' && selectedDistro.value !== 'Arch Linux' &&
    (selectedInit.value !== 'systemd' || selectedMethod.value === 'Source')
  );
});

const needsSourceSteps = computed(() => {
  return selectedDistro.value !== 'NixOS' && selectedDistro.value !== 'Arch Linux' && selectedMethod.value === 'Source';
});

const nixosServerBlocks: StepBlock[] = [
  {
    type: 'text',
    content:
      'Thêm vào configuration.nix để bật server daemon (thay your_username bằng tên user của bạn):',
  },
  {
    type: 'code',
    content:
      '{\n  pkgs,\n  ...\n}: {\n  systemd.packages = [ pkgs.fcitx5-lotus ];\n  systemd.services."fcitx5-lotus-server@your_username" = {\n    wantedBy = [ "multi-user.target" ];\n    overrideStrategy = "asDropin";\n  };\n}',
  },
];

const nixosEnvBlocks: StepBlock[] = [
  {
    type: 'text',
    content:
      'Nếu cài qua i18n.inputMethod (Cách 1), NixOS tự set các biến này.\nNếu cần khai báo thủ công, thêm vào configuration.nix:',
  },
  {
    type: 'code',
    content:
      'environment.sessionVariables = {\n  GTK_IM_MODULE = "fcitx";\n  QT_IM_MODULE = "fcitx";\n  XMODIFIERS = "@im=fcitx";\n  SDL_IM_MODULE = "fcitx";\n  GLFW_IM_MODULE = "ibus";\n};',
  },
];

const toBlocks = (value: string | StepBlock[]): StepBlock[] => {
  if (Array.isArray(value)) return value;
  return [{ type: 'code', content: value }];
};

const installStepBlocks = computed<StepBlock[]>(() => {
  const distroInfo =
    logic.steps.install[
    selectedDistro.value as keyof typeof logic.steps.install
    ];
  if (!distroInfo) return [{ type: 'text', content: 'Cấu hình chưa sẵn sàng.' }];
  const methodData = (distroInfo as any)[selectedMethod.value];
  if (!methodData) {
    return [{ type: 'text', content: 'Phương thức chưa sẵn sàng.' }];
  }
  if (Array.isArray(methodData)) {
    return toBlocks(methodData);
  }
  if (methodData && typeof methodData === 'object') {
    return toBlocks(
      methodData[selectedShell.value] ||
      methodData.Bash ||
      'Cấu hình chưa sẵn sàng.',
    );
  }
  return toBlocks(methodData);
});

const activateServerBlocks = computed<StepBlock[]>(() => {
  if (selectedDistro.value === 'NixOS') {
    if (selectedMethod.value === 'Package Manager') return nixosServerBlocks;
    return [
      {
        type: 'text',
        content: 'Bước này đã được cấu hình trong flake.nix ở trên.',
      },
    ];
  }
  return toBlocks(serverCmd.value);
});

const shellConfigBlocks = computed<StepBlock[]>(() => {
  if (selectedDistro.value === 'NixOS') {
    if (selectedMethod.value === 'Package Manager') return nixosEnvBlocks;
    return [
      {
        type: 'text',
        content: 'Bước này đã được cấu hình trong flake.nix ở trên.',
      },
    ];
  }
  return toBlocks(envCmd.value);
});

const serverCmd = computed(() => {
  if (selectedInit.value === 'OpenRC') {
    return 'sudo ln -s /etc/init.d/fcitx5-lotus /etc/init.d/fcitx5-lotus.$(whoami)\nsudo rc-update add fcitx5-lotus.$(whoami) default\nsudo rc-service fcitx5-lotus.$(whoami) restart';
  }
  if (selectedInit.value === 'runit') {
    if (selectedDistro.value === 'Void Linux') {
      return 'sudo ln -s /etc/sv/fcitx5-lotus /var/service/fcitx5-lotus.$(whoami)\nsudo sv start fcitx5-lotus.$(whoami)';
    }
    return 'sudo ln -sf /etc/runit/sv/fcitx5-lotus /etc/runit/sv/fcitx5-lotus.$(whoami)\nsudo sv start /etc/runit/sv/fcitx5-lotus.$(whoami)';
  }
  if (selectedShell.value === 'Fish')
    return 'sudo systemctl enable --now fcitx5-lotus-server@(whoami).service; or begin; sudo systemd-sysusers; and sudo systemctl enable --now fcitx5-lotus-server@(whoami).service; end';
  return 'sudo systemctl enable --now fcitx5-lotus-server@$(whoami).service || (sudo systemd-sysusers && sudo systemctl enable --now fcitx5-lotus-server@$(whoami).service)';
});

const envCmd = computed(() => {
  const defaultVars = [
    'export GTK_IM_MODULE=fcitx',
    'export QT_IM_MODULE=fcitx',
    'export XMODIFIERS=@im=fcitx',
    'export SDL_IM_MODULE=fcitx',
    'export GLFW_IM_MODULE=ibus',
  ];

  let vars;

  if (selectedEnv.value === 'Wayland') {
    if (selectedDe.value === 'KDE Plasma') {
      vars = ['export XMODIFIERS=@im=fcitx', 'export GLFW_IM_MODULE=ibus'];
    } else if (selectedDe.value === 'GNOME' || selectedDe.value === 'Sway') {
      vars = [
        'export XMODIFIERS=@im=fcitx',
        'export QT_IM_MODULE=fcitx',
        'export QT_IM_MODULES="wayland;fcitx"',
        'export GLFW_IM_MODULE=ibus',
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
    const fishVars = vars.map((v) => {
      const idxEq = v.indexOf('=');
      const name = v.slice(0, idxEq).replace('export ', '');
      const val = v.slice(idxEq + 1);
      return `    set -Ux ${name} ${val}`;
    });
    return `echo 'if status is-login\n${fishVars.join('\n')}\nend' >> ~/.config/fish/config.fish`;
  }
});

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success('Đã sao chép!');
  } catch {
    ElMessage.error('Không thể sao chép');
  }
};

const autostartText = computed(
  () =>
    logic.steps.autostart[
    selectedDe.value as keyof typeof logic.steps.autostart
    ],
);

const waylandGeneral = computed(() => {
  if (selectedEnv.value !== 'Wayland') return null;
  return logic.steps.wayland_extras.General;
});

const waylandDeSpecific = computed(() => {
  if (selectedEnv.value !== 'Wayland') return null;
  return (logic.steps.wayland_extras as any)[selectedDe.value] || null;
});

const chromiumWaylandFlags = computed(() =>
  selectedDe.value === 'KDE Plasma'
    ? '--enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime'
    : '--enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime --wayland-text-input-version=3',
);
</script>

<template>
  <div class="installer-component">
    <div class="installer-grid">
      <div class="controls-card">
        <div class="control-item">
          <label>Distro</label>
          <div class="distro-grid">
            <div v-for="d in distros" :key="d.name" class="distro-card" :class="{ active: selectedDistro === d.name }"
              role="button" tabindex="0" :aria-pressed="selectedDistro === d.name" @click="selectedDistro = d.name"
              @keydown.enter="selectedDistro = d.name">
              <v-icon :name="d.icon" scale="1.5" />
              <span>{{ d.name }}</span>
            </div>
          </div>
        </div>

        <div class="control-item">
          <label>Desktop Environment / WM</label>
          <div class="de-grid">
            <div v-for="de in deWms" :key="de" class="de-card" :class="{ active: selectedDe === de }" role="button"
              tabindex="0" :aria-pressed="selectedDe === de" @click="selectedDe = de" @keydown.enter="selectedDe = de">
              <span>{{ de }}</span>
            </div>
          </div>
        </div>

        <div class="control-item">
          <label>Môi trường</label>
          <div class="option-grid">
            <div v-for="e in environments" :key="e" class="option-card" :class="{ active: selectedEnv === e }"
              role="button" tabindex="0" :aria-pressed="selectedEnv === e" @click="selectedEnv = e"
              @keydown.enter="selectedEnv = e">
              <span>{{ e }}</span>
            </div>
          </div>
        </div>

        <div class="control-item">
          <label>Init System</label>
          <div class="option-grid">
            <div v-for="i in initSystems" :key="i" class="option-card" :class="{ active: selectedInit === i }"
              role="button" tabindex="0" :aria-pressed="selectedInit === i" @click="selectedInit = i"
              @keydown.enter="selectedInit = i">
              <span>{{ i }}</span>
            </div>
          </div>
        </div>

        <div class="control-item">
          <label>Phương thức cài đặt</label>
          <div class="option-grid">
            <div v-for="m in methods" :key="m" class="option-card" :class="{ active: selectedMethod === m }"
              role="button" tabindex="0" :aria-pressed="selectedMethod === m" @click="selectedMethod = m"
              @keydown.enter="selectedMethod = m">
              <span>{{ m }}</span>
            </div>
          </div>
        </div>

        <div class="control-item">
          <label>Shell đang dùng</label>
          <div class="option-grid">
            <div v-for="s in shells" :key="s" class="option-card" :class="{ active: selectedShell === s }" role="button"
              tabindex="0" :aria-pressed="selectedShell === s" @click="selectedShell = s"
              @keydown.enter="selectedShell = s">
              <span>{{ s }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="output-area">
        <div class="step-card">
          <div class="step-badge">1</div>
          <div class="step-content">
            <h4>Cài đặt gói</h4>
            <div class="step-blocks">
              <template v-for="(block, idx) in installStepBlocks" :key="idx">
                <p v-if="block.type === 'text'" class="instruction">
                  {{ block.content }}
                </p>
                <div v-else class="code-container">
                  <pre><code>{{ block.content }}</code></pre>
                  <el-button class="copy-float" circle :icon="DocumentCopy" @click="copyToClipboard(block.content)" />
                </div>
              </template>
            </div>
          </div>
        </div>

        <div v-if="needsUserCreation" class="step-card">
          <div class="step-badge">1.5</div>
          <div class="step-content">
            <h4>Tạo User và Group (thay thế systemd-sysusers)</h4>
            <p class="instruction">
              Non-systemd và build from source cần tạo user
              <code>uinput_proxy</code> và group <code>input</code> thủ công.
            </p>
            <div class="code-container">
              <pre><code>{{ userCreationCmd }}</code></pre>
              <el-button class="copy-float" circle :icon="DocumentCopy" @click="copyToClipboard(userCreationCmd)" />
            </div>
          </div>
        </div>

        <div v-if="needsSourceSteps" class="step-card">
          <div class="step-badge">1.6</div>
          <div class="step-content">
            <h4>Reload Udev Rules</h4>
            <p class="instruction">
              Áp dụng các udev rules mới (99-lotus.rules) để thiết bị uinput có
              quyền đúng.
            </p>
            <div class="code-container">
              <pre><code>{{ udevReloadCmd }}</code></pre>
              <el-button class="copy-float" circle :icon="DocumentCopy" @click="copyToClipboard(udevReloadCmd)" />
            </div>
          </div>
        </div>

        <div class="step-card">
          <div class="step-badge">2</div>
          <div class="step-content">
            <h4>Kích hoạt Server</h4>
            <div class="step-blocks">
              <template v-for="(block, idx) in activateServerBlocks" :key="idx">
                <p v-if="block.type === 'text'" class="instruction">
                  {{ block.content }}
                </p>
                <div v-else class="code-container">
                  <pre><code>{{ block.content }}</code></pre>
                  <el-button class="copy-float" circle :icon="DocumentCopy" @click="copyToClipboard(block.content)" />
                </div>
              </template>
            </div>
          </div>
        </div>

        <div class="step-card">
          <div class="step-badge">2.5</div>
          <div class="step-content">
            <h4>Nạp Kernel Module uinput</h4>
            <p class="instruction">
              Module uinput cần được nạp lần để fcitx5-lotus-server có thể tạo
              thiết bị input ảo, lần sau khởi động sẽ tự động nạp.
            </p>
            <div class="code-container">
              <pre><code>{{ uinputModprobeCmd }}</code></pre>
              <el-button class="copy-float" circle :icon="DocumentCopy" @click="copyToClipboard(uinputModprobeCmd)" />
            </div>
          </div>
        </div>

        <div class="step-card">
          <div class="step-badge">3</div>
          <div class="step-content">
            <h4>Tắt bộ gõ cũ (IBus)</h4>
            <p class="instruction">
              Nếu máy bạn đang dùng IBus, hãy tắt nó đi trước khi chuyển sang
              Fcitx5 để tránh xung đột.
            </p>
            <div class="code-container mini">
              <pre><code>killall ibus-daemon || ibus exit</code></pre>
              <el-button class="copy-float" circle :icon="DocumentCopy" size="small"
                @click="copyToClipboard('killall ibus-daemon || ibus exit')" />
            </div>
            <p class="instruction mt-2" style="font-size: 0.85rem">
              * Lưu ý: Hãy tắt autostart của IBus (thường là ibus-daemon hoặc
              ibus). Tốt nhất là gỡ cài đặt IBus nếu không sử dụng.
            </p>
          </div>
        </div>

        <div class="step-card">
          <div class="step-badge">4</div>
          <div class="step-content">
            <h4>Thiết lập biến môi trường (Shell)</h4>
            <div class="step-blocks">
              <template v-for="(block, idx) in shellConfigBlocks" :key="idx">
                <p v-if="block.type === 'text'" class="instruction">
                  {{ block.content }}
                </p>
                <div v-else class="code-container">
                  <pre><code>{{ block.content }}</code></pre>
                  <el-button class="copy-float" circle :icon="DocumentCopy" @click="copyToClipboard(block.content)" />
                </div>
              </template>
            </div>
            <el-alert title="Lưu ý: Bạn cần Đăng xuất và Đăng nhập lại sau bước này để cấu hình Shell có hiệu lực."
              type="info" :closable="false" />
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

            <div v-if="selectedEnv === 'Wayland'">
              <div v-if="waylandGeneral" class="extra-item mb-4">
                <el-alert :title="waylandGeneral.title" type="info" :closable="false" show-icon>
                  <p style="margin: 0; line-height: 1.5">
                    {{ waylandGeneral.description }}
                  </p>
                </el-alert>
              </div>

              <div v-if="waylandDeSpecific" class="wayland-setup-section mb-6">
                <h5 v-if="selectedDe !== 'KDE Plasma'" class="mb-2">
                  {{ selectedDe }} Wayland Configuration
                </h5>

                <div class="wayland-details p-4">
                  <p v-if="waylandDeSpecific.support_info" class="instruction mb-2">
                    <b>Thành phần hỗ trợ:</b>
                    {{ waylandDeSpecific.support_info }}
                  </p>

                  <div v-if="
                    waylandDeSpecific.best_setup &&
                    waylandDeSpecific.best_setup.length > 0
                  ">
                    <p v-if="selectedDe !== 'KDE Plasma'" class="instruction">
                      <b>Hướng dẫn cài đặt tốt nhất:</b>
                    </p>
                    <ul class="setup-list-mini">
                      <li v-for="(point, idx) in waylandDeSpecific.best_setup" :key="idx" v-html="point"></li>
                    </ul>
                  </div>

                  <el-alert v-if="waylandDeSpecific.caveats" title="Lưu ý" type="warning" :closable="false"
                    class="mt-2">
                    <p style="margin: 0; line-height: 1.4; font-size: 0.85rem">
                      {{ waylandDeSpecific.caveats }}
                    </p>
                  </el-alert>
                </div>
              </div>

              <div v-if="selectedInit === 'OpenRC' || selectedInit === 'runit'" class="extra-item mb-4">
                <p class="instruction">
                  <b>Lưu ý cho {{ selectedInit }}:</b> Thêm biến sau vào cấu
                  hình môi trường (ví dụ <code>/etc/environment</code> hoặc
                  config của DE/WM) để fix lỗi không gõ được trên các ứng dụng
                  X11/XCB:
                </p>
                <div class="code-container mini">
                  <pre><code>DBUS_SESSION_BUS_ADDRESS=unix:path=$XDG_RUNTIME_DIR/bus</code></pre>
                  <el-button class="copy-float" circle :icon="DocumentCopy" size="small" @click="
                    copyToClipboard(
                      'DBUS_SESSION_BUS_ADDRESS=unix:path=$XDG_RUNTIME_DIR/bus',
                    )
                    " />
                </div>
              </div>

              <div class="extra-item mb-4">
                <p class="instruction">
                  <b>Chromium / Electron:</b> Bật hỗ trợ bộ gõ Wayland:
                </p>
                <div class="code-container mini">
                  <pre><code>{{ chromiumWaylandFlags }}</code></pre>
                  <el-button class="copy-float" circle :icon="DocumentCopy" size="small"
                    @click="copyToClipboard(chromiumWaylandFlags)" />
                </div>
              </div>
            </div>

            <div class="extra-item">
              <p class="instruction">
                <b>{{ kanataConfig.title }}:</b> {{ kanataConfig.desc }}
              </p>
              <div class="code-container mini">
                <pre><code>{{ kanataConfig.code }}</code></pre>
                <el-button class="copy-float" circle :icon="DocumentCopy" size="small"
                  @click="copyToClipboard(kanataConfig.code)" />
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
  width: 100%;
}

.installer-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2.5rem;
  align-items: start;
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
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  transition:
    background-color 0.3s,
    border-color 0.3s;
  z-index: 10;
}

.control-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.control-item label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--ctp-text);
  letter-spacing: 0.02em;
}

/* Specific Select/Input adjustments */
:deep(.el-select .el-input__wrapper),
:deep(.el-input__wrapper) {
  background-color: var(--ctp-surface1) !important;
  box-shadow: 0 0 0 1px var(--ctp-surface2) inset !important;
  border: none !important;
}

:deep(.el-input__inner) {
  color: var(--ctp-text) !important;
}

/* Grids styling */
.distro-grid,
.de-grid,
.option-grid {
  display: grid;
  gap: 12px;
}

.distro-grid {
  grid-template-columns: repeat(2, 1fr);
}

.de-grid {
  grid-template-columns: repeat(3, 1fr);
}

.option-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* Cards */
.distro-card,
.de-card,
.option-card {
  background-color: var(--ctp-mantle);
  border: 1px solid var(--ctp-surface1);
  border-radius: 8px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--ctp-subtext0);
  text-align: center;
}

.option-card {
  padding: 6px 12px;
}

.distro-card {
  justify-content: flex-start;
  gap: 10px;
}

.distro-card:hover,
.de-card:hover,
.option-card:hover {
  background-color: var(--ctp-surface0);
  border-color: var(--ctp-surface2);
  color: var(--ctp-text);
}

.distro-card:focus-visible,
.de-card:focus-visible,
.option-card:focus-visible {
  outline: 2px solid var(--ctp-green);
  outline-offset: 2px;
}

/* Trạng thái Active - Chỉ đổi viền và chữ để không bị lóa mảng màu lớn */
.distro-card.active,
.de-card.active,
.option-card.active {
  background-color: var(--ctp-surface1);
  border-color: var(--ctp-green);
  color: var(--ctp-green);
  font-weight: 700;
}

.distro-card svg {
  flex-shrink: 0;
}

.distro-card span,
.option-card span {
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
  width: 100%;
}

.step-card {
  background-color: var(--ctp-surface0);
  border: 1px solid var(--ctp-surface1);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  gap: 1.5rem;
  position: relative;
  transition: border-color 0.3s;
  overflow: hidden;
}

.step-card:hover {
  border-color: var(--ctp-surface2);
}

.step-badge {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background-color: var(--ctp-surface1);
  color: var(--ctp-text);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
  border: 1px solid var(--ctp-surface2);
}

.step-content {
  flex: 1;
  min-width: 0;
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
  width: 100%;
  overflow-x: auto;
}

.step-blocks {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.step-blocks .code-container {
  margin-bottom: 0;
}

.step-blocks .instruction {
  margin: 0;
  line-height: 1.6;
}

.code-container.mini {
  padding: 0.75rem 1rem;
  margin-top: 0.5rem;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'Maple Mono', monospace;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--ctp-text);
}

code {
  font-family: 'Maple Mono', monospace;
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
  z-index: 2;
}

.copy-float:hover {
  background-color: var(--ctp-surface2) !important;
  color: var(--ctp-green) !important;
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
  color: var(--ctp-text);
  font-weight: 600;
}

/* Reset lại El-Alert cho chuẩn màu Theme */
:deep(.el-alert) {
  background-color: var(--ctp-surface1) !important;
  border: 1px solid var(--ctp-surface2) !important;
  border-radius: 8px;
}

:deep(.el-alert__title) {
  color: var(--ctp-text) !important;
  font-weight: 600;
}

:deep(.el-alert__description) {
  color: var(--ctp-subtext0) !important;
}

/* Utilities */
.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-3 {
  margin-bottom: 0.75rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

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
  color: var(--ctp-text);
  cursor: pointer;
  transition: background-color 0.2s;
  user-select: none;
}

.wayland-details summary:hover {
  background-color: var(--ctp-surface0);
}

.details-content {
  padding: 1rem;
  border-top: 1px solid var(--ctp-surface1);
  font-size: 0.9rem;
  color: var(--ctp-subtext1);
  line-height: 1.5;
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

/* === RESPONSIVE MEDIA QUERIES === */

/* Tablet & Smaller Desktop */
@media (max-width: 1024px) {
  .installer-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .controls-card {
    position: relative;
    top: 0;
    padding: 1.5rem;
    max-height: none;
    overflow-y: visible;
  }
}

/* Mobile & Small Tablet */
@media (max-width: 768px) {
  .de-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .step-card {
    padding: 1.25rem;
    gap: 1rem;
  }

  .step-badge {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }

  .step-content h4 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  .output-area {
    gap: 1.5rem;
  }
}

/* Extra Small Mobile */
@media (max-width: 480px) {

  .distro-grid,
  .de-grid {
    grid-template-columns: 1fr;
  }

  .step-card {
    flex-direction: column;
    gap: 0.75rem;
  }

  .controls-card {
    padding: 1.25rem 1rem;
  }

  .code-container {
    padding: 1rem 0.75rem;
  }

  .code-container pre {
    font-size: 0.85rem;
  }
}
</style>
