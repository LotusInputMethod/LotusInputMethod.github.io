<script setup lang="ts">
import { ref, computed } from 'vue';
import { DocumentCopy } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const distros = [
  { name: "Arch Linux", icon: "si-archlinux" },
  { name: "Debian", icon: "si-debian" },
  { name: "Ubuntu", icon: "si-ubuntu" },
  { name: "Fedora", icon: "si-fedora" },
  { name: "openSUSE", icon: "si-opensuse" },
  { name: "NixOS", icon: "si-nixos" }
];
const methods = ["Package Manager", "Binary", "Source"];
const shells = ["Bash", "Zsh", "Fish"];
const deWms = ["GNOME", "KDE Plasma", "Xfce", "Cinnamon", "MATE", "Pantheon", "Budgie", "LXQt", "COSMIC", "i3", "Sway", "Hyprland"];
const environments = ["X11", "Wayland"];

const selectedDistro = ref(distros[0].name);
const selectedMethod = ref(methods[0]);
const selectedShell = ref(shells[0]);
const selectedDe = ref(deWms[0]);
const selectedEnv = ref(environments[0]);

const logic = {
  "steps": {
    "install": {
      "Arch Linux": {
        "Package Manager": "yay -S fcitx5-lotus",
        "Binary": "sudo pacman -U fcitx5-lotus-*.pkg.tar.zst",
        "Source": "git clone https://github.com/LotusInputMethod/fcitx5-lotus.git\ncd fcitx5-lotus\ncmake -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_INSTALL_LIBDIR=/usr/lib .\nmake\nsudo make install"
      },
      "Debian": {
        "Package Manager": "CODENAME=$(grep '^VERSION_CODENAME=' /etc/os-release | cut -d'=' -f2)\nsudo mkdir -p /etc/apt/keyrings\ncurl -fsSL https://fcitx5-lotus.pages.dev/pubkey.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/fcitx5-lotus.gpg\necho \"deb [signed-by=/etc/apt/keyrings/fcitx5-lotus.gpg] https://fcitx5-lotus.pages.dev/apt/$CODENAME $CODENAME main\" | sudo tee /etc/apt/sources.list.d/fcitx5-lotus.list\nsudo apt update && sudo apt install fcitx5-lotus",
        "Binary": "sudo dpkg -i fcitx5-lotus_*.deb",
        "Source": "sudo apt-get install cmake extra-cmake-modules libfcitx5core-dev libfcitx5config-dev libfcitx5utils-dev libinput-dev libudev-dev g++ golang hicolor-icon-theme pkg-config libx11-dev libfcitx5-qt6-dev qt6-base-dev fcitx5-modules-dev\ngit clone https://github.com/LotusInputMethod/fcitx5-lotus.git\ncd fcitx5-lotus\ncmake -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_INSTALL_LIBDIR=/usr/lib .\nmake\nsudo make install"
      },
      "Ubuntu": {
        "Package Manager": "CODENAME=$(grep '^UBUNTU_CODENAME=' /etc/os-release | cut -d'=' -f2)\nsudo mkdir -p /etc/apt/keyrings\ncurl -fsSL https://fcitx5-lotus.pages.dev/pubkey.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/fcitx5-lotus.gpg\necho \"deb [signed-by=/etc/apt/keyrings/fcitx5-lotus.gpg] https://fcitx5-lotus.pages.dev/apt/$CODENAME $CODENAME main\" | sudo tee /etc/apt/sources.list.d/fcitx5-lotus.list\nsudo apt update && sudo apt install fcitx5-lotus",
        "Binary": "sudo dpkg -i fcitx5-lotus_*.deb",
        "Source": "sudo apt-get install cmake extra-cmake-modules libfcitx5core-dev libfcitx5config-dev libfcitx5utils-dev libinput-dev libudev-dev g++ golang hicolor-icon-theme pkg-config libx11-dev libfcitx5-qt6-dev qt6-base-dev fcitx5-modules-dev\ngit clone https://github.com/LotusInputMethod/fcitx5-lotus.git\ncd fcitx5-lotus\ncmake -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_INSTALL_LIBDIR=/usr/lib .\nmake\nsudo make install"
      },
      "Fedora": {
        "Package Manager": "RELEASEVER=$(grep '^VERSION_ID=' /etc/os-release | cut -d'=' -f2)\nsudo rpm --import https://fcitx5-lotus.pages.dev/pubkey.gpg\nsudo dnf config-manager addrepo --from-repofile=https://fcitx5-lotus.pages.dev/rpm/fedora/fcitx5-lotus-$RELEASEVER.repo\nsudo dnf install fcitx5-lotus",
        "Binary": "sudo rpm -i fcitx5-lotus-*.rpm",
        "Source": "sudo dnf install cmake extra-cmake-modules fcitx5-devel libinput-devel libudev-devel gcc-c++ golang hicolor-icon-theme systemd-devel libX11-devel fcitx5-qt-devel\ngit clone https://github.com/LotusInputMethod/fcitx5-lotus.git\ncd fcitx5-lotus\ncmake -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_INSTALL_LIBDIR=/usr/lib .\nmake\nsudo make install"
      },
      "openSUSE": {
        "Package Manager": "sudo rpm --import https://fcitx5-lotus.pages.dev/pubkey.gpg\nsudo zypper addrepo https://fcitx5-lotus.pages.dev/rpm/opensuse/fcitx5-lotus-tumbleweed.repo\nsudo zypper refresh\nsudo zypper install fcitx5-lotus",
        "Binary": "sudo rpm -i fcitx5-lotus-*.rpm",
        "Source": "sudo zypper install cmake extra-cmake-modules fcitx5-devel libinput-devel systemd-devel gcc-c++ go hicolor-icon-theme systemd-devel libX11-devel udev fcitx5-qt-devel\ngit clone https://github.com/LotusInputMethod/fcitx5-lotus.git\ncd fcitx5-lotus\ncmake -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_INSTALL_LIBDIR=/usr/lib .\nmake\nsudo make install"
      },
      "NixOS": {
        "Package Manager": "inputs.fcitx5-lotus = {\n  url = \"github:LotusInputMethod/fcitx5-lotus\";\n  inputs.nixpkgs.follows = \"nixpkgs\";\n};\n\n# In configuration.nix:\nservices.fcitx5-lotus = {\n  enable = true;\n  user = \"your_username\";\n};",
        "Binary": "NixOS prefers flake/module configuration.",
        "Source": "NixOS prefers nix-shell or custom derivations."
      }
    },
    "server": {
      "Other": {
        "Bash": "sudo systemctl enable --now fcitx5-lotus-server@$(whoami).service || (sudo systemd-sysusers && sudo systemctl enable --now fcitx5-lotus-server@$(whoami).service)",
        "Zsh": "sudo systemctl enable --now fcitx5-lotus-server@$(whoami).service || (sudo systemd-sysusers && sudo systemctl enable --now fcitx5-lotus-server@$(whoami).service)",
        "Fish": "sudo systemctl enable --now fcitx5-lotus-server@(whoami).service; or begin; sudo systemd-sysusers; and sudo systemctl enable --now fcitx5-lotus-server@(whoami).service; end"
      }
    },
    "environment": {
      "Bash": "cat <<EOF >> ~/.bash_profile\nexport GTK_IM_MODULE=fcitx\nexport QT_IM_MODULE=fcitx\nexport XMODIFIERS=@im=fcitx\nexport SDL_IM_MODULE=fcitx\nexport GLFW_IM_MODULE=ibus\nEOF",
      "Zsh": "cat <<EOF >> ~/.zprofile\nexport GTK_IM_MODULE=fcitx\nexport QT_IM_MODULE=fcitx\nexport XMODIFIERS=@im=fcitx\nexport SDL_IM_MODULE=fcitx\nexport GLFW_IM_MODULE=ibus\nEOF",
      "Fish": "echo 'if status is-login\n    set -Ux GTK_IM_MODULE fcitx\n    set -Ux QT_IM_MODULE fcitx\n    set -Ux XMODIFIERS \"@im=fcitx\"\n    set -gx SDL_IM_MODULE fcitx\n    set -gx GLFW_IM_MODULE ibus\nend' >> ~/.config/fish/config.fish"
    },
    "autostart": {
      "GNOME": "GNOME Tweaks → Startup Applications → Add → Fcitx 5",
      "KDE Plasma": "System Settings → Autostart → Add... → Add Application... → Fcitx 5",
      "Xfce": "Settings → Session and Startup → Application Autostart → Add → Fcitx 5",
      "Cinnamon": "System Settings → Startup Applications → + → Choose application → Fcitx 5",
      "MATE": "Control Center → Startup Applications → Add (Name: Fcitx 5, Command: fcitx5)",
      "Pantheon": "System Settings → Applications → Startup → Add Startup App... → Fcitx 5",
      "Budgie": "Budgie Desktop Settings → Autostart → + → Add application → Fcitx 5",
      "LXQt": "LXQt Configuration Center → Session Settings → Autostart → LXQt Autostart → Add (Name: Fcitx 5, Command: fcitx5)",
      "COSMIC": "COSMIC Settings → Applications → Startup Applications → Add app → Fcitx 5",
      "i3": "Add `exec --no-startup-id fcitx5 -d` to ~/.config/i3/config",
      "Sway": "Add `exec --no-startup-id fcitx5 -d` to ~/.config/sway/config",
      "Hyprland": "Add `exec-once = fcitx5 -d` to ~/.config/hypr/hyprland.conf"
    },
    "wayland_extras": {
      "General": {
        "title": "Khuyến nghị Xwayland",
        "description": "Ngay cả khi bạn chỉ dùng ứng dụng Wayland native, bật Xwayland vẫn được khuyến nghị. Nếu bảng gõ client-side không hoạt động, Fcitx sẽ chuyển sang cửa sổ X11 để đảm bảo vị trí hiển thị chính xác thay vì một cửa sổ Wayland ngẫu nhiên."
      },
      "KDE Plasma": {
        "best_setup": [
          "Sử dụng KDE Plasma 5.27 trở lên.",
          "Biến môi trường: `XMODIFIERS=@im=fcitx` cho ứng dụng XWayland.",
          "Vào **System Settings** -> **Virtual Keyboard** -> Chọn **Fcitx 5**.",
          "Không đặt `GTK_IM_MODULE` & `QT_IM_MODULE` toàn cục.",
          "Tham số trình duyệt: `--enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime`"
        ],
        "support_info": "Hỗ trợ text-input-v1/v2/v3 và zwp_input_method_v1.",
        "caveats": "Một số ứng dụng Gtk/Qt cũ chỉ chạy X11 vẫn có thể cần đặt module riêng lẻ. Tránh đặt toàn cục để tránh lỗi nhấp nháy cửa sổ ứng viên."
      },
      "GNOME": {
        "best_setup": [
          "Biến môi trường: `XMODIFIERS=@im=fcitx` cho XWayland.",
          "Qt5: `QT_IM_MODULE=fcitx`.",
          "Qt >= 6.8.2: `QT_IM_MODULES=\"wayland;fcitx\"`.",
          "Chrome: Chạy qua XWayland với `GTK_IM_MODULE=fcitx`."
        ],
        "support_info": "Sử dụng text-input-v3 và giao thức ibus dbus.",
        "caveats": "Gnome-shell UI không hiển thị được popup ứng viên. Giải pháp duy nhất là sử dụng extension Kimpanel."
      },
      "Sway": {
        "best_setup": [
          "Yêu cầu Sway 1.10 trở lên.",
          "Biến môi trường: `XMODIFIERS=@im=fcitx` (XWayland).",
          "Qt5: `QT_IM_MODULE=fcitx`.",
          "Qt >= 6.8.2: `QT_IM_MODULES=\"wayland;fcitx\"`."
        ],
        "support_info": "Hỗ trợ text-input-v3 và zwp_input_method_v2 (từ bản 1.10+).",
        "caveats": "Qt < 6.8.2 cần `QT_IM_MODULE=fcitx` do Sway chưa hỗ trợ text-input-v2."
      },
      "Weston": {
        "best_setup": [
          "Đặt `GTK_IM_MODULE=fcitx` và `QT_IM_MODULE=fcitx`.",
          "Cấu hình `~/.config/weston.ini`:",
          "[core]\nxwayland=true\n\n[input-method]\npath=/usr/bin/fcitx5"
        ],
        "support_info": "Sử dụng text-input-v1 và zwp_input_method_v1.",
        "caveats": "Do thiếu text-input-v3, IM module là giải pháp duy nhất cho Gtk/Qt."
      }
    }
  }
};

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
  let vars = [];

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
      // Weston & others default
      vars = [
        "export GTK_IM_MODULE=fcitx",
        "export QT_IM_MODULE=fcitx",
        "export XMODIFIERS=@im=fcitx",
        "export SDL_IM_MODULE=fcitx",
        "export GLFW_IM_MODULE=ibus"
      ];
    }
  } else {
    // X11
    vars = [
      "export GTK_IM_MODULE=fcitx",
      "export QT_IM_MODULE=fcitx",
      "export XMODIFIERS=@im=fcitx",
      "export SDL_IM_MODULE=fcitx",
      "export GLFW_IM_MODULE=ibus"
    ];
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
  return logic.steps.install[selectedDistro.value][selectedMethod.value];
});

const autostartText = computed(() => logic.steps.autostart[selectedDe.value]);

const waylandExtras = computed(() => {
  if (selectedEnv.value !== 'Wayland') return [];
  const compositor = selectedDe.value;
  const extras: any[] = [];

  if (compositor === 'KDE Plasma') {
    extras.push({
      title: "KDE Plasma (Virtual Keyboard)",
      desc: "Kích hoạt giao thức text-input:",
      instruction: "System Settings → Keyboard → Virtual Keyboard → Chọn Fcitx 5"
    });
  } else if (compositor === 'Hyprland') {
    extras.push({
      title: "Hyprland Support",
      desc: "Thêm quyền hạn cho bộ gõ:",
      code: "permission = fcitx5-lotus-server, keyboard, allow"
    });
  }

  // Common for Chrome/Electron on Wayland
  extras.push({
    title: "Chromium / Electron",
    desc: "Bật hỗ trợ bộ gõ Wayland:",
    code: "--enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime --wayland-text-input-version=3"
  });

  return extras;
});

const fcitx5Config = {
  steps: [
    'Mở <b>Fcitx5 Configuration</b> (tìm trong menu hoặc chạy <code>fcitx5-configtool</code>).',
    'Tìm <b>Lotus</b> ở cột bên phải.',
    'Nhấn mũi tên <b>&lt;</b> để thêm nó sang cột bên trái.',
    'Bấm <b>Apply</b> để lưu thay đổi.'
  ]
};

const kanataConfig = {
  title: "Cấu hình Kanata",
  desc: "Nếu dùng Kanata, hãy loại bỏ Uinput Server khỏi danh sách quét:",
  code: "(defcfg\n  ...\n  linux-dev-names-exclude (\"Lotus-Uinput-Server\")\n  ...\n)"
};
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
            <el-alert title="Lưu ý: Bạn cần Đăng xuất và Đăng nhập lại sau bước này để cấu hình Shell có hiệu lực." type="info" :closable="false" />
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
              <div v-for="(item, idx) in waylandExtras" :key="idx" class="extra-item mb-4">
                <p class="instruction"><b>{{ item.title }}:</b> {{ item.desc }}</p>
                <div v-if="item.code" class="code-container mini">
                  <pre><code>{{ item.code }}</code></pre>
                  <el-button class="copy-float" circle :icon="DocumentCopy" size="small" @click="copyToClipboard(item.code)" />
                </div>
                <div v-else class="ui-nav-container">
                  {{ item.instruction }}
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

.distro-card v-icon {
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

.mb-4 { margin-bottom: 1.5rem; }
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
.mb-4 { margin-bottom: 1rem; }

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
