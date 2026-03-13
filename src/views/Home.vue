<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import {
  Link,
  Menu,
  Download,
  View,
  Lightning,
  Edit,
  MagicStick,
  Check,
  ChatLineRound,
  Monitor,
  DocumentCopy,
  Setting,
  Cpu,
  Plus,
  Aim,
  Sunny,
  Moon,
} from '@element-plus/icons-vue';

// --- STATE ---
const mobileMenuOpen = ref<boolean>(false);
const activeOS = ref<string>('arch');
const setupStep = ref<number>(0);
const isScrolled = ref<boolean>(false);
const isDark = ref<boolean>(false);

// --- DARK MODE LOGIC ---
const toggleDark = (): void => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

// --- SCROLL HANDLING ---
const handleScroll = (): void => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  // Lấy theme từ localStorage hoặc thiết lập hệ thống
  const savedTheme = localStorage.getItem('theme');
  if (
    savedTheme === 'dark' ||
    (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Áp dụng màu nền toàn cục cho thẻ body dựa trên biến Element Plus
  document.body.style.backgroundColor = 'var(--el-bg-color-page)';
  document.body.style.color = 'var(--el-text-color-primary)';
  document.body.style.transition = 'background-color 0.3s, color 0.3s';

  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => window.removeEventListener('scroll', handleScroll));

// --- INTERFACES & DATA ---
interface PackageInfo {
  package: string;
  description: string;
}
const archPackages: PackageInfo[] = [
  { package: 'fcitx5-lotus', description: 'Build từ mã nguồn release ổn định' },
  { package: 'fcitx5-lotus-bin', description: 'Dùng binary đã build sẵn' },
  {
    package: 'fcitx5-lotus-git',
    description: 'Build từ danh sách commit mới nhất',
  },
];

interface SettingInfo {
  option: string;
  description: string;
  default: string;
}
const quickSettings: SettingInfo[] = [
  { option: 'Charset', description: 'Chọn bảng mã', default: 'Unicode' },
  {
    option: 'Spell Check',
    description: 'Kiểm tra lỗi chính tả',
    default: 'Bật',
  },
  { option: 'Macro', description: 'Bật/tắt gõ tắt', default: 'Bật' },
  { option: 'Capitalize Macro', description: 'Gõ tắt chữ hoa', default: 'Bật' },
  {
    option: 'Auto non-VN restore',
    description: 'Tự động khôi phục với từ không phải tiếng Việt',
    default: 'Bật',
  },
];

const advancedSettings: SettingInfo[] = [
  {
    option: 'Use oà, uý',
    description: 'Bật/tắt kiểu đặt dấu thanh hiện đại (thay vì òa, úy)',
    default: 'Bật',
  },
  {
    option: 'Allow Freedom Type',
    description: 'Cho phép bỏ dấu tự do ở bất kỳ đâu',
    default: 'Bật',
  },
  {
    option: 'Allow dd to đ',
    description: 'Cho phép "dd" tạo "đ" khi dùng Auto restore',
    default: 'Bật',
  },
  {
    option: 'Fix Uinput with Ack',
    description: 'Khuyên dùng cho ứng dụng Chromium (Chrome, Edge...)',
    default: 'Tắt',
  },
  {
    option: 'Custom Keymap',
    description: 'Tự định nghĩa phím gõ (chọn kiểu gõ Custom để áp dụng)',
    default: 'Trống',
  },
];

interface TypingMode {
  mode: string;
  shortcut: string;
  description: string;
}
const typingModes: TypingMode[] = [
  {
    mode: 'Uinput (Smooth)',
    shortcut: '1',
    description: 'Chế độ mặc định, phản hồi nhanh. Tối ưu ứng dụng tốc độ cao.',
  },
  {
    mode: 'Uinput (Slow)',
    shortcut: '2',
    description: 'Tốc độ gửi phím chậm hơn. Tối ưu Libre Office.',
  },
  {
    mode: 'Uinput (Hardcore)',
    shortcut: '3',
    description: 'Tối ưu cho ứng dụng Windows chạy qua Wine.',
  },
  {
    mode: 'Surrounding Text',
    shortcut: '4',
    description: 'Cho phép sửa dấu trên văn bản đã gõ (Tối ưu Qt/GTK).',
  },
  { mode: 'Preedit', shortcut: 'Q', description: 'Hiển thị gạch chân khi gõ.' },
  {
    mode: 'Emoji Picker',
    shortcut: 'W',
    description: 'Tìm kiếm và nhập Emoji (hỗ trợ fuzzy search).',
  },
  { mode: 'OFF', shortcut: 'E', description: 'Tắt bộ gõ.' },
  {
    mode: 'Default',
    shortcut: 'R',
    description: 'Chế độ gõ mặc định theo cấu hình.',
  },
];

interface Contributor {
  name: string;
  role: string;
  avatar: string;
}
const contributors: Contributor[] = [
  {
    name: 'Nguyen Hoang Ky',
    role: 'Founder',
    avatar: 'https://avatars.githubusercontent.com/u/57983253?v=4',
  },
  {
    name: 'Huỳnh Thiện Lộc',
    role: 'Contributor',
    avatar: 'https://avatars.githubusercontent.com/u/148019203?v=4',
  },
  {
    name: 'Nguyễn Hồng Hiệp',
    role: 'Contributor',
    avatar: 'https://avatars.githubusercontent.com/u/57614330?v=4',
  },
  {
    name: 'Đặng Quang Hiển',
    role: 'Contributor',
    avatar: 'https://avatars.githubusercontent.com/u/83270073?v=4',
  },
  {
    name: 'Zebra2711',
    role: 'Contributor',
    avatar: 'https://avatars.githubusercontent.com/u/89755535?v=4',
  },
];

// --- COMMANDS ---
const commands: Record<string, string> = {
  arch: '# Dùng yay\nyay -S fcitx5-lotus\n\n# Hoặc dùng paru\nparu -S fcitx5-lotus',
  debian: `CODENAME=$(grep '^VERSION_CODENAME=' /etc/os-release | cut -d'=' -f2)\nsudo mkdir -p /etc/apt/keyrings\ncurl -fsSL https://fcitx5-lotus.pages.dev/pubkey.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/fcitx5-lotus.gpg\necho "deb [signed-by=/etc/apt/keyrings/fcitx5-lotus.gpg] https://fcitx5-lotus.pages.dev/apt/$CODENAME $CODENAME main" | sudo tee /etc/apt/sources.list.d/fcitx5-lotus.list\nsudo apt update && sudo apt install fcitx5-lotus`,
  ubuntu: `CODENAME=$(grep '^UBUNTU_CODENAME=' /etc/os-release | cut -d'=' -f2)\nsudo mkdir -p /etc/apt/keyrings\ncurl -fsSL https://fcitx5-lotus.pages.dev/pubkey.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/fcitx5-lotus.gpg\necho "deb [signed-by=/etc/apt/keyrings/fcitx5-lotus.gpg] https://fcitx5-lotus.pages.dev/apt/$CODENAME $CODENAME main" | sudo tee /etc/apt/sources.list.d/fcitx5-lotus.list\nsudo apt update && sudo apt install fcitx5-lotus`,
  fedora: `RELEASEVER=$(grep '^VERSION_ID=' /etc/os-release | cut -d'=' -f2)\nsudo rpm --import https://fcitx5-lotus.pages.dev/pubkey.gpg\nsudo dnf config-manager addrepo --from-repofile=https://fcitx5-lotus.pages.dev/rpm/fedora/fcitx5-lotus-$RELEASEVER.repo\nsudo dnf install fcitx5-lotus`,
  opensuse: `sudo rpm --import https://fcitx5-lotus.pages.dev/pubkey.gpg\nsudo zypper addrepo https://fcitx5-lotus.pages.dev/rpm/opensuse/fcitx5-lotus-tumbleweed.repo\nsudo zypper refresh\nsudo zypper install fcitx5-lotus`,
  nixosInput: `nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";\n\nfcitx5-lotus = {\n  url = "github:LotusInputMethod/fcitx5-lotus";\n  inputs.nixpkgs.follows = "nixpkgs";\n};`,
  nixosService: `services.fcitx5-lotus = {\n  enable = true;\n  user = "your_username";\n};`,
  github: `# Debian/Ubuntu\nsudo dpkg -i fcitx5-lotus_*.deb\n\n# Fedora / openSUSE\nsudo rpm -i fcitx5-lotus-*.rpm`,
  serverBash:
    'sudo systemctl enable --now fcitx5-lotus-server@$(whoami).service || \\\n(sudo systemd-sysusers && sudo systemctl enable --now fcitx5-lotus-server@$(whoami).service)',
  serverFish:
    'sudo systemctl enable --now fcitx5-lotus-server@(whoami).service; or begin\n    sudo systemd-sysusers; and sudo systemctl enable --now fcitx5-lotus-server@(whoami).service\nend',
  envBash: `cat <<EOF >> ~/.bash_profile\nexport GTK_IM_MODULE=fcitx\nexport QT_IM_MODULE=fcitx\nexport XMODIFIERS=@im=fcitx\nexport SDL_IM_MODULE=fcitx\nexport GLFW_IM_MODULE=ibus\nEOF`,
  envFish: `echo 'if status is-login\n    set -Ux GTK_IM_MODULE fcitx\n    set -Ux QT_IM_MODULE fcitx\n    set -Ux XMODIFIERS "@im=fcitx"\n    set -gx SDL_IM_MODULE fcitx\n    set -gx GLFW_IM_MODULE ibus\nend' >> ~/.config/fish/config.fish`,
  envGlobal: `cat <<EOF | sudo tee -a /etc/environment\nGTK_IM_MODULE=fcitx\nQT_IM_MODULE=fcitx\nXMODIFIERS=@im=fcitx\nSDL_IM_MODULE=fcitx\nGLFW_IM_MODULE=ibus\nEOF`,
  killIbus: 'killall ibus-daemon || ibus exit',
  hyprland: 'permission = fcitx5-lotus-server, keyboard, allow',
  chromium:
    '--enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime --wayland-text-input-version=3',
};

// --- METHODS ---
const scrollToInstall = (): void => {
  document
    .getElementById('installation')
    ?.scrollIntoView({ behavior: 'smooth' });
};
const scrollToTop = (): void => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
const goToGitHub = (): void => {
  window.open('https://github.com/LotusInputMethod/fcitx5-lotus', '_blank');
};
const openLink = (url: string): void => {
  window.open(url, '_blank');
};

const copyToClipboard = async (text: string | undefined): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text || '');
    ElMessage.success('Đã sao chép vào clipboard!');
  } catch {
    ElMessage.error('Không thể sao chép');
  }
};
</script>

<template>
  <div class="home-page">
    <nav class="navbar" :class="{ scrolled: isScrolled }">
      <div class="container nav-content">
        <div class="nav-brand" @click="scrollToTop">
          <img src="/fcitx-lotus.svg" alt="Lotus Logo" class="logo" />
          <span class="brand-name">Fcitx5 Lotus</span>
        </div>

        <div class="nav-links desktop-only">
          <a href="#features">Tính năng</a>
          <a href="#installation">Cài đặt</a>
          <a href="#setup">Thiết lập</a>
          <a href="#usage">Hướng dẫn</a>
          <a href="#contributors">Đóng góp</a>
          <el-button
            type="primary"
            round
            class="btn-github"
            @click="goToGitHub"
          >
            <el-icon><Link /></el-icon> GitHub
          </el-button>
          <el-button circle @click="toggleDark" class="theme-toggle">
            <el-icon><Sunny v-if="!isDark" /><Moon v-else /></el-icon>
          </el-button>
        </div>

        <div class="mobile-controls">
          <el-button circle @click="toggleDark" class="theme-toggle">
            <el-icon><Sunny v-if="!isDark" /><Moon v-else /></el-icon>
          </el-button>
          <el-button
            class="mobile-menu-btn"
            text
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <el-icon size="24"><Menu /></el-icon>
          </el-button>
        </div>
      </div>

      <div class="mobile-menu" v-show="mobileMenuOpen">
        <a href="#features" @click="mobileMenuOpen = false">Tính năng</a>
        <a href="#installation" @click="mobileMenuOpen = false">Cài đặt</a>
        <a href="#setup" @click="mobileMenuOpen = false">Thiết lập</a>
        <a href="#usage" @click="mobileMenuOpen = false">Hướng dẫn</a>
        <a href="#contributors" @click="mobileMenuOpen = false">Đóng góp</a>
        <el-button type="primary" @click="goToGitHub">GitHub</el-button>
      </div>
    </nav>

    <header class="hero section-bg-alt">
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
            <el-button
              type="primary"
              size="large"
              class="btn-install"
              @click="scrollToInstall"
            >
              <el-icon><Download /></el-icon> Cài đặt ngay
            </el-button>
            <el-button size="large" class="btn-source" @click="goToGitHub">
              <el-icon><View /></el-icon> Xem trên GitHub
            </el-button>
          </div>
          <div class="hero-stats">
            <div class="stat-item"><strong>160+</strong><span>Stars</span></div>
            <div class="stat-item">
              <strong>6+</strong><span>Distros hỗ trợ</span>
            </div>
            <div class="stat-item">
              <strong>5</strong><span>Người đóng góp</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="terminal-mockup">
            <div class="term-header">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
              <span class="term-title">user@linux:~</span>
            </div>
            <div class="term-body">
              <p><span class="prompt">❯</span> fcitx5-lotus --status</p>
              <p class="info">[INFO] Lotus Server is running (PID: 1337)</p>
              <p>
                <span class="prompt">❯</span> echo "Gõ không gạch chân cực mượt"
              </p>
              <p class="typing">
                Gõ không gạch chân cực mượt<span class="cursor"></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <section id="features" class="section section-bg-main">
      <div class="container">
        <div class="section-title">
          <h2>Tính năng nổi bật</h2>
          <p>
            Thiết kế tối ưu cho trải nghiệm người dùng Linux, loại bỏ hoàn toàn
            sự khó chịu khi nhập liệu.
          </p>
        </div>

        <div class="features-grid">
          <div class="custom-card highlight-card">
            <div class="icon-wrapper icon-primary">
              <el-icon><Aim /></el-icon>
            </div>
            <h3>Gõ trực tiếp (Non-preedit)</h3>
            <p>
              <strong>Tính năng cốt lõi:</strong> Không còn đường gạch chân khó
              chịu khi đang gõ. Ký tự xuất hiện ngay lập tức, mang lại cảm giác
              gõ native 100%.
            </p>
          </div>
          <div class="custom-card">
            <div class="icon-wrapper icon-green">
              <el-icon><Lightning /></el-icon>
            </div>
            <h3>Hiệu năng cực cao</h3>
            <p>
              Gửi phím thông qua Uinput giúp loại bỏ hoàn toàn độ trễ, tối ưu
              tuyệt đối cho các ứng dụng có tốc độ xử lý nhanh.
            </p>
          </div>
          <div class="custom-card">
            <div class="icon-wrapper icon-purple">
              <el-icon><MagicStick /></el-icon>
            </div>
            <h3>Macro & Sửa lỗi thông minh</h3>
            <p>
              Hỗ trợ gõ tắt mạnh mẽ, kiểm tra chính tả tự động, và tính năng tự
              động khôi phục từ khi gõ tiếng nước ngoài.
            </p>
          </div>
          <div class="custom-card">
            <div class="icon-wrapper icon-orange">
              <el-icon><Check /></el-icon>
            </div>
            <h3>Kiểm soát hoàn toàn</h3>
            <p>
              Tự định nghĩa Custom Keymap, hỗ trợ đặt dấu oà/uý chuẩn mới, cho
              phép bỏ dấu tự do ở bất kỳ vị trí nào.
            </p>
          </div>
          <div class="custom-card">
            <div class="icon-wrapper icon-pink">
              <el-icon><ChatLineRound /></el-icon>
            </div>
            <h3>Emoji & Chế độ linh hoạt</h3>
            <p>
              Tích hợp Emoji Picker siêu tốc với fuzzy search. Chuyển đổi linh
              hoạt giữa 8 chế độ gõ chỉ bằng một phím tắt.
            </p>
          </div>
          <div class="custom-card">
            <div class="icon-wrapper icon-cyan">
              <el-icon><Monitor /></el-icon>
            </div>
            <h3>Wayland & Ứng dụng khó nhằn</h3>
            <p>
              Hoạt động ổn định trên X11/Wayland, tương thích ngược với Wine và
              hỗ trợ tối đa cho trình duyệt nhân Chromium.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section id="installation" class="section section-bg-alt">
      <div class="container">
        <div class="section-title">
          <h2>Cài đặt dễ dàng</h2>
          <p>
            Kho lưu trữ Cloudflare Pages đảm bảo tốc độ tải và cập nhật tự động.
          </p>
        </div>

        <div class="custom-card setup-wrapper">
          <el-tabs v-model="activeOS">
            <el-tab-pane label="Arch Linux" name="arch">
              <div class="tab-content">
                <p class="instruction">AUR cung cấp 3 gói cài đặt:</p>
                <el-table :data="archPackages" stripe class="pkg-table mb-4">
                  <el-table-column prop="package" label="Gói">
                    <template #default="{ row }"
                      ><code class="inline-code">{{
                        row.package
                      }}</code></template
                    >
                  </el-table-column>
                  <el-table-column prop="description" label="Mô tả" />
                </el-table>
                <div class="code-block">
                  <pre><code>{{ commands.arch }}</code></pre>
                  <button
                    class="btn-copy"
                    @click="copyToClipboard(commands.arch)"
                  >
                    <el-icon><DocumentCopy /></el-icon>
                  </button>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="Debian" name="debian">
              <div class="tab-content">
                <el-alert
                  title="Mẹo nhỏ"
                  type="success"
                  description="Sau khi cài đặt bằng script này, post-install sẽ tự động hỏi bạn để thiết lập môi trường. Bạn chỉ cần nhấn Y để đồng ý!"
                  :closable="false"
                  class="mb-4"
                />
                <div class="code-block">
                  <pre><code>{{ commands.debian }}</code></pre>
                  <button
                    class="btn-copy"
                    @click="copyToClipboard(commands.debian)"
                  >
                    <el-icon><DocumentCopy /></el-icon>
                  </button>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="Ubuntu" name="ubuntu">
              <div class="tab-content">
                <el-alert
                  title="Mẹo nhỏ"
                  type="success"
                  description="Quá trình cài đặt deb package sẽ tự động hỗ trợ thiết lập Autostart và biến môi trường."
                  :closable="false"
                  class="mb-4"
                />
                <div class="code-block">
                  <pre><code>{{ commands.ubuntu }}</code></pre>
                  <button
                    class="btn-copy"
                    @click="copyToClipboard(commands.ubuntu)"
                  >
                    <el-icon><DocumentCopy /></el-icon>
                  </button>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="Fedora" name="fedora">
              <div class="tab-content">
                <div class="code-block">
                  <pre><code>{{ commands.fedora }}</code></pre>
                  <button
                    class="btn-copy"
                    @click="copyToClipboard(commands.fedora)"
                  >
                    <el-icon><DocumentCopy /></el-icon>
                  </button>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="openSUSE" name="opensuse">
              <div class="tab-content">
                <div class="code-block">
                  <pre><code>{{ commands.opensuse }}</code></pre>
                  <button
                    class="btn-copy"
                    @click="copyToClipboard(commands.opensuse)"
                  >
                    <el-icon><DocumentCopy /></el-icon>
                  </button>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="NixOS" name="nixos">
              <div class="tab-content">
                <p class="instruction">
                  Thêm input vào <code>flake.nix</code>:
                </p>
                <div class="code-block mb-4">
                  <pre><code>{{ commands.nixosInput }}</code></pre>
                </div>
                <p class="instruction">
                  Bật service trong <code>configuration.nix</code>:
                </p>
                <div class="code-block">
                  <pre><code>{{ commands.nixosService }}</code></pre>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="GitHub Releases" name="github">
              <div class="tab-content">
                <el-alert
                  title="Khuyến cáo"
                  type="warning"
                  description="Chỉ dùng cách này khi distro của bạn gặp lỗi với repository ở trên."
                  :closable="false"
                  class="mb-4"
                />
                <p class="instruction">
                  Tải file .deb hoặc .rpm từ
                  <a
                    href="https://github.com/LotusInputMethod/fcitx5-lotus/releases/latest"
                    target="_blank"
                    class="text-link"
                    >GitHub Releases</a
                  >
                </p>
                <div class="code-block">
                  <pre><code>{{ commands.github }}</code></pre>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </section>

    <section id="setup" class="section section-bg-main">
      <div class="container">
        <div class="section-title">
          <h2>Thiết lập hệ thống</h2>
          <p>Làm theo từng bước sau để đảm bảo bộ gõ tương tác hoàn hảo</p>
        </div>

        <div class="steps-wrapper">
          <el-steps
            :active="setupStep"
            finish-status="success"
            align-center
            class="custom-steps"
          >
            <el-step
              title="Bật Lotus Server"
              description="Kích hoạt service"
              @click="setupStep = 0"
              class="clickable-step"
            />
            <el-step
              title="Biến môi trường"
              description="Cấu hình IM module"
              @click="setupStep = 1"
              class="clickable-step"
            />
            <el-step
              title="Autostart & IBus"
              description="Tránh xung đột"
              @click="setupStep = 2"
              class="clickable-step"
            />
            <el-step
              title="Hoàn thiện Fcitx5"
              description="Thêm Lotus"
              @click="setupStep = 3"
              class="clickable-step"
            />
          </el-steps>
        </div>

        <div class="setup-cards">
          <transition name="fade-slide" mode="out-in">
            <div :key="setupStep">
              <div class="custom-card" v-if="setupStep === 0">
                <div class="step-header">
                  <span class="step-num">1</span>
                  <h3>Bật Lotus Server</h3>
                </div>
                <p class="instruction">
                  Server giúp bộ gõ gửi phím xóa và sửa lỗi mượt mà hơn. Chọn
                  lệnh tương ứng với shell của bạn:
                </p>
                <details class="advanced-details mb-3" open>
                  <summary>Dành cho Bash / Zsh</summary>
                  <div class="code-block mt-2">
                    <pre><code>{{ commands.serverBash }}</code></pre>
                    <button
                      class="btn-copy"
                      @click="copyToClipboard(commands.serverBash)"
                    >
                      <el-icon><DocumentCopy /></el-icon>
                    </button>
                  </div>
                </details>
                <details class="advanced-details">
                  <summary>Dành cho Fish shell</summary>
                  <div class="code-block mt-2">
                    <pre><code>{{ commands.serverFish }}</code></pre>
                    <button
                      class="btn-copy"
                      @click="copyToClipboard(commands.serverFish)"
                    >
                      <el-icon><DocumentCopy /></el-icon>
                    </button>
                  </div>
                </details>
              </div>

              <div class="custom-card" v-else-if="setupStep === 1">
                <div class="step-header">
                  <span class="step-num">2</span>
                  <h3>Thiết lập biến môi trường</h3>
                </div>
                <p class="instruction">
                  Bộ gõ sẽ không thể hoạt động nếu thiếu bước này.
                  <strong>Cần Log out và Log in lại sau khi chạy lệnh</strong>.
                </p>
                <details class="advanced-details mb-3" open>
                  <summary>Cấu hình cho Bash / Zsh</summary>
                  <div class="code-block mt-2">
                    <pre><code>{{ commands.envBash }}</code></pre>
                    <button
                      class="btn-copy"
                      @click="copyToClipboard(commands.envBash)"
                    >
                      <el-icon><DocumentCopy /></el-icon>
                    </button>
                  </div>
                </details>
                <details class="advanced-details mb-3">
                  <summary>Cấu hình cho Fish shell</summary>
                  <div class="code-block mt-2">
                    <pre><code>{{ commands.envFish }}</code></pre>
                    <button
                      class="btn-copy"
                      @click="copyToClipboard(commands.envFish)"
                    >
                      <el-icon><DocumentCopy /></el-icon>
                    </button>
                  </div>
                </details>
              </div>

              <div class="custom-card" v-else-if="setupStep === 2">
                <div class="step-header">
                  <span class="step-num">3</span>
                  <h3>Tắt IBus và cấu hình Autostart</h3>
                </div>
                <p class="instruction">
                  Xung đột IBus là nguyên nhân số 1 gây lỗi không gõ được. Chạy
                  lệnh sau để tắt IBus:
                </p>
                <div class="code-block mb-4">
                  <pre><code>{{ commands.killIbus }}</code></pre>
                  <button
                    class="btn-copy"
                    @click="copyToClipboard(commands.killIbus)"
                  >
                    <el-icon><DocumentCopy /></el-icon>
                  </button>
                </div>
                <el-alert
                  title="Quan trọng"
                  type="warning"
                  description="Bạn phải thêm fcitx5 (hoặc fcitx5 -d) vào Autostart của Desktop Environment đang dùng."
                  :closable="false"
                />
              </div>

              <div class="custom-card" v-else-if="setupStep === 3">
                <div class="step-header">
                  <span class="step-num">4</span>
                  <h3>Cấu hình Fcitx5 & Wayland</h3>
                </div>
                <p class="instruction">
                  Bước cuối cùng, thêm Lotus vào Fcitx5:
                </p>
                <ol class="step-list mb-4 instruction">
                  <li>
                    Mở <strong>Fcitx5 Configuration</strong> từ menu ứng dụng.
                  </li>
                  <li>Tìm <strong>Lotus</strong> ở cột bên phải.</li>
                  <li>
                    Nhấn nút mũi tên trái để thêm sang cột bên trái và nhấn
                    Apply.
                  </li>
                </ol>

                <details class="advanced-details mt-4">
                  <summary>Cấu hình bổ sung cho Wayland</summary>
                  <div class="p-3 border rounded-lg mt-2 text-sm sub-card">
                    <p class="mb-2 instruction">
                      <strong>Hyprland:</strong> Thêm dòng sau vào file config
                    </p>
                    <div class="code-block my-2">
                      <pre><code>{{ commands.hyprland }}</code></pre>
                    </div>
                    <p class="mt-4 mb-2 instruction">
                      <strong>Chromium/Brave:</strong> Chạy ứng dụng kèm các cờ
                      sau
                    </p>
                    <div class="code-block my-2">
                      <pre><code>{{ commands.chromium }}</code></pre>
                    </div>
                  </div>
                </details>
              </div>

              <div class="custom-card success-card" v-else-if="setupStep === 4">
                <div class="success-content">
                  <div class="icon-circle">
                    <el-icon><Check /></el-icon>
                  </div>
                  <h3>Tuyệt vời! Bạn đã sẵn sàng.</h3>
                  <p class="instruction">
                    Bộ gõ Fcitx5 Lotus đã được thiết lập thành công. Hãy tận
                    hưởng sự mượt mà của chế độ Non-preedit!
                  </p>
                </div>
              </div>
            </div>
          </transition>

          <div class="step-actions">
            <el-button
              @click="setupStep--"
              :disabled="setupStep === 0"
              v-show="setupStep < 4"
              >Quay lại</el-button
            >
            <div style="flex-grow: 1"></div>
            <el-button
              type="primary"
              @click="setupStep++"
              v-show="setupStep < 3"
              >Bước tiếp theo</el-button
            >
            <el-button
              type="success"
              @click="setupStep++"
              v-show="setupStep === 3"
              >Hoàn tất thiết lập</el-button
            >
            <el-button @click="setupStep = 0" v-show="setupStep === 4"
              >Xem lại hướng dẫn</el-button
            >
          </div>
        </div>
      </div>
    </section>

    <section id="usage" class="section section-bg-alt">
      <div class="container">
        <div class="section-title">
          <h2>Hướng dẫn sử dụng & Tùy chỉnh</h2>
          <p>Làm chủ bộ gõ của bạn với các menu cài đặt đa dạng</p>
        </div>

        <div class="usage-grid">
          <div class="custom-card">
            <div class="usage-header">
              <el-icon class="icon-green"><Setting /></el-icon>
              <h3>Cài đặt nhanh (Quick Settings)</h3>
            </div>
            <p class="text-sm instruction mb-3">
              Nhấp chuột phải vào biểu tượng Lotus trên khay hệ thống (System
              Tray):
            </p>
            <el-table
              :data="quickSettings"
              size="small"
              class="mb-5 table-bordered"
            >
              <el-table-column prop="option" label="Tùy chọn" width="140" />
              <el-table-column prop="description" label="Chức năng" />
            </el-table>

            <div class="usage-header mt-6">
              <el-icon class="icon-purple"><Edit /></el-icon>
              <h3>Cài đặt nâng cao (Advanced)</h3>
            </div>
            <p class="text-sm instruction mb-3">
              Mở Fcitx5 Configuration -> Chọn Lotus -> Nhấn biểu tượng Bánh răng
              (Configure):
            </p>
            <el-table
              :data="advancedSettings"
              size="small"
              class="table-bordered"
            >
              <el-table-column prop="option" label="Tùy chọn" width="140" />
              <el-table-column prop="description" label="Chức năng" />
            </el-table>
          </div>

          <div class="custom-card">
            <div class="usage-header">
              <el-icon class="icon-blue"><Cpu /></el-icon>
              <h3>Menu chuyển chế độ gõ</h3>
            </div>
            <p class="text-sm instruction mb-3">
              Nhấn phím <code class="inline-code">`</code> (backtick) trong khi
              đang ở ô nhập liệu để mở nhanh menu chế độ gõ:
            </p>
            <el-table
              :data="typingModes"
              size="small"
              class="mb-6 table-bordered"
            >
              <el-table-column prop="mode" label="Chế độ" width="160" />
              <el-table-column
                prop="shortcut"
                label="Phím tắt"
                width="80"
                align="center"
              >
                <template #default="{ row }"
                  ><kbd class="kbd-key">{{ row.shortcut }}</kbd></template
                >
              </el-table-column>
              <el-table-column prop="description" label="Mô tả" />
            </el-table>

            <el-alert
              title="Reset trạng thái đang gõ"
              type="info"
              description="Chỉ cần nhấp chuột hoặc chạm touchpad trong khi đang gõ, bộ gõ sẽ tự động ngắt từ, ngăn chặn hiện tượng dính chữ."
              :closable="false"
            />
          </div>
        </div>
      </div>
    </section>

    <section id="contributors" class="section section-bg-main">
      <div class="container">
        <div class="section-title">
          <h2>Cộng đồng mã nguồn mở</h2>
          <p>Cảm ơn những người đã đóng góp xây dựng bộ gõ</p>
        </div>

        <div class="contributors-flex">
          <div v-for="c in contributors" :key="c.name" class="contributor-item">
            <el-avatar :size="80" :src="c.avatar" class="contributor-avatar" />
            <div class="c-name">{{ c.name }}</div>
            <div class="c-role">{{ c.role }}</div>
          </div>
        </div>

        <div class="custom-card contribute-action">
          <p class="instruction">
            Dự án mã nguồn mở luôn cần sự chung tay của bạn. Mọi đóng góp đều
            được trân trọng!
          </p>
          <el-button
            type="primary"
            size="large"
            @click="
              openLink(
                'https://github.com/LotusInputMethod/fcitx5-lotus/blob/main/CONTRIBUTING.md',
              )
            "
          >
            <el-icon><Plus /></el-icon> Tham gia đóng góp ngay
          </el-button>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">
            <img src="/fcitx-lotus.svg" alt="Lotus" />
            <span>Fcitx5 Lotus</span>
          </div>
          <p>
            Bộ gõ tiếng Việt đơn giản, hiệu năng cao, tối ưu non-preedit cho
            Linux.
          </p>
        </div>
        <div class="footer-links">
          <h4>Liên kết</h4>
          <a href="https://github.com/LotusInputMethod/fcitx5-lotus">GitHub</a>
          <a href="https://github.com/LotusInputMethod/fcitx5-lotus/releases"
            >Releases</a
          >
          <a href="https://github.com/LotusInputMethod/fcitx5-lotus/issues"
            >Báo lỗi (Issues)</a
          >
        </div>
        <div class="footer-links">
          <h4>Tài liệu</h4>
          <a href="#installation">Cài đặt</a>
          <a href="#usage">Hướng dẫn</a>
          <a
            href="https://github.com/LotusInputMethod/fcitx5-lotus/blob/main/CONTRIBUTING.md"
            >Đóng góp</a
          >
        </div>
        <div class="footer-license">
          <h4>Giấy phép</h4>
          <p>
            Dự án được phân phối dưới giấy phép GNU General Public License v3.
          </p>
        </div>
      </div>
      <div class="footer-bottom">
        © {{ new Date().getFullYear() }} Fcitx5 Lotus Team. Dựa trên mã nguồn
        của VMK.
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* MÁY MÓC TỪ CHỐI COLOR HARDCODING. DÙNG 100% ELEMENT PLUS CSS VARIABLES */

/* Tiện ích không gian */
.section {
  padding: 80px 0;
}
.mb-2 {
  margin-bottom: 8px;
}
.mb-3 {
  margin-bottom: 12px;
}
.mb-4 {
  margin-bottom: 16px;
}
.mb-5 {
  margin-bottom: 24px;
}
.mb-6 {
  margin-bottom: 32px;
}
.mt-2 {
  margin-top: 8px;
}
.mt-4 {
  margin-top: 16px;
}
.mt-6 {
  margin-top: 24px;
}
.my-2 {
  margin-top: 8px;
  margin-bottom: 8px;
}
.p-3 {
  padding: 12px;
}
.text-sm {
  font-size: 0.875rem;
}

/* Tiện ích nền (Sử dụng biến ngữ nghĩa Element Plus) */
.section-bg-main {
  background-color: var(--el-bg-color-page);
  transition: background-color 0.3s ease;
}
.section-bg-alt {
  background-color: var(--el-fill-color-lighter);
  transition: background-color 0.3s ease;
}

/* Tiện ích Text & Border */
.instruction {
  color: var(--el-text-color-regular);
  transition: color 0.3s ease;
}
.text-link {
  color: var(--el-color-primary);
  text-decoration: none;
  font-weight: 500;
}
.text-link:hover {
  text-decoration: underline;
}
.border {
  border: 1px solid var(--el-border-color-lighter);
  transition: border-color 0.3s ease;
}
.rounded {
  border-radius: 4px;
}
.rounded-lg {
  border-radius: 8px;
}

/* Inline Code & Code Block */
.inline-code {
  background-color: var(--el-fill-color);
  color: var(--el-text-color-primary);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
  transition:
    background-color 0.3s,
    color 0.3s;
}
.code-block {
  position: relative;
  background-color: var(--el-fill-color-darker);
  border: 1px solid var(--el-border-color-dark);
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  margin-top: 10px;
  transition:
    background-color 0.3s,
    border-color 0.3s;
}
.code-block pre {
  margin: 0;
  color: var(--el-text-color-primary);
  font-family: monospace;
  font-size: 0.875rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.btn-copy {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--el-fill-color);
  border: 1px solid var(--el-border-color);
  color: var(--el-text-color-regular);
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.btn-copy:hover {
  background: var(--el-color-primary);
  color: #fff;
  border-color: var(--el-color-primary);
}

/* Card chuẩn dùng màu biến chung */
.custom-card {
  background-color: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
  color: var(--el-text-color-primary);
  border-radius: 12px;
  padding: 30px;
  box-shadow: var(--el-box-shadow-light);
  transition:
    background-color 0.3s,
    border-color 0.3s,
    box-shadow 0.3s,
    color 0.3s,
    transform 0.3s;
}

/* Navbar */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: rgba(var(--el-bg-color-overlay-rgb), 0.85);
  backdrop-filter: blur(10px);
  z-index: 1000;
  transition:
    background-color 0.3s,
    border-color 0.3s;
  border-bottom: 1px solid transparent;
}
.navbar.scrolled {
  border-bottom: 1px solid var(--el-border-color-light);
  box-shadow: var(--el-box-shadow-lighter);
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
}
.nav-brand .brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--el-text-color-primary);
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 30px;
}
.nav-links a {
  color: var(--el-text-color-regular);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}
.nav-links a:hover {
  color: var(--el-color-primary);
}
.mobile-menu {
  background-color: var(--el-bg-color-overlay);
  border-top: 1px solid var(--el-border-color-light);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: center;
  position: absolute;
  width: 100%;
  box-shadow: var(--el-box-shadow-light);
}
.mobile-menu a {
  color: var(--el-text-color-regular);
  text-decoration: none;
  font-weight: 500;
}
.mobile-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
.desktop-only {
  display: none;
}
.mobile-menu-btn {
  display: block;
}
@media (min-width: 768px) {
  .desktop-only {
    display: flex;
  }
  .mobile-menu-btn {
    display: none;
  }
  .mobile-menu {
    display: none !important;
  }
  .mobile-controls {
    display: none;
  }
}

/* Titles */
.section-title {
  text-align: center;
  margin-bottom: 40px;
}
.section-title h2 {
  font-size: 2.2rem;
  color: var(--el-text-color-primary);
  margin-bottom: 10px;
  transition: color 0.3s;
}
.section-title p {
  font-size: 1.1rem;
  color: var(--el-text-color-regular);
  max-width: 600px;
  margin: 0 auto;
  transition: color 0.3s;
}

/* Hero */
.hero {
  padding: 160px 0 100px;
  overflow: hidden;
}
.hero-container {
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
  background-color: var(--el-color-success-light-9);
  color: var(--el-color-success);
  padding: 6px 16px;
  border-radius: 99px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 24px;
  border: 1px solid var(--el-color-success-light-5);
  box-shadow: var(--el-box-shadow-lighter);
  transition:
    background-color 0.3s,
    color 0.3s,
    border-color 0.3s;
}
.badge-dot {
  width: 8px;
  height: 8px;
  background-color: var(--el-color-success);
  border-radius: 50%;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}
.hero h1 {
  font-size: 2.5rem;
  line-height: 1.2;
  margin-bottom: 20px;
  color: var(--el-text-color-primary);
  font-weight: 800;
  transition: color 0.3s;
}
.text-gradient {
  background: linear-gradient(
    135deg,
    var(--el-color-primary),
    var(--el-color-primary-light-3)
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-description {
  font-size: 1.125rem;
  color: var(--el-text-color-regular);
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
  border-top: 1px solid var(--el-border-color-lighter);
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
  color: var(--el-color-primary);
  line-height: 1;
}
.stat-item span {
  font-size: 0.875rem;
  color: var(--el-text-color-secondary);
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
  background-color: var(--el-fill-color-darker);
  border-radius: 12px;
  border: 1px solid var(--el-border-color-darker);
  box-shadow: var(--el-box-shadow-dark);
  transform: rotateY(-5deg) rotateX(5deg);
  transition:
    transform 0.3s,
    background-color 0.3s;
  overflow: hidden;
}
.terminal-mockup:hover {
  transform: rotateY(0) rotateX(0);
}
.term-header {
  background-color: var(--el-fill-color-dark);
  padding: 12px 16px;
  display: flex;
  gap: 8px;
  align-items: center;
  border-bottom: 1px solid var(--el-border-color-darker);
  transition: background-color 0.3s;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.dot-red {
  background: var(--el-color-error);
}
.dot-yellow {
  background: var(--el-color-warning);
}
.dot-green {
  background: var(--el-color-success);
}
.term-title {
  flex: 1;
  text-align: center;
  color: var(--el-text-color-secondary);
  font-family: monospace;
  font-size: 0.75rem;
}
.term-body {
  padding: 24px;
  font-family: monospace;
  font-size: 0.875rem;
  color: var(--el-text-color-primary);
  line-height: 1.6;
}
.prompt {
  color: var(--el-color-success);
}
.info {
  color: var(--el-text-color-secondary);
  margin-bottom: 16px;
}
.typing {
  display: flex;
  align-items: center;
}
.cursor {
  display: inline-block;
  width: 8px;
  height: 16px;
  background-color: var(--el-color-success);
  margin-left: 4px;
  animation: blink 1s step-end infinite;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
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

/* Tính năng */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}
.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--el-box-shadow);
  border-color: var(--el-color-primary);
}
.highlight-card {
  border: 2px solid var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}
.icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 20px;
}
.icon-primary {
  background-color: var(--el-color-primary);
  color: white;
  box-shadow: var(--el-box-shadow-light);
}
.icon-green {
  background-color: var(--el-color-success-light-9);
  color: var(--el-color-success);
}
.icon-blue {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
.icon-purple {
  background-color: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}
.icon-orange {
  background-color: var(--el-color-warning-light-9);
  color: var(--el-color-warning);
}
.icon-pink {
  background-color: var(--el-color-info-light-9);
  color: var(--el-color-info);
}
.icon-cyan {
  background-color: var(--el-color-primary-light-8);
  color: var(--el-color-primary);
}
.custom-card h3 {
  font-size: 1.25rem;
  margin-bottom: 10px;
  transition: color 0.3s;
}
.custom-card p {
  line-height: 1.5;
  margin: 0;
}

/* Setup & Layout components */
.setup-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}
.steps-wrapper {
  max-width: 800px;
  margin: 0 auto 40px;
  display: none;
}
@media (min-width: 768px) {
  .steps-wrapper {
    display: block;
  }
}
.clickable-step :deep(.el-step__head),
.clickable-step :deep(.el-step__main) {
  cursor: pointer;
  transition: opacity 0.2s;
}
.clickable-step:hover :deep(.el-step__main) {
  opacity: 0.7;
}
.setup-cards {
  max-width: 700px;
  margin: 0 auto;
  min-height: 250px;
  position: relative;
}
.step-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}
.step-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  border-radius: 50%;
  font-weight: bold;
  font-size: 1.1rem;
}
.step-list {
  margin: 0;
  padding-left: 20px;
  line-height: 1.6;
}

/* Advanced Details (Accordions) */
.advanced-details summary {
  cursor: pointer;
  font-weight: 600;
  color: var(--el-text-color-primary);
  background-color: var(--el-fill-color-light);
  padding: 10px 15px;
  border-radius: 6px;
  border: 1px solid var(--el-border-color-lighter);
  transition:
    background-color 0.3s,
    color 0.3s,
    border-color 0.3s;
}
.advanced-details summary:hover {
  background-color: var(--el-fill-color);
}

.step-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding: 0 10px;
}

.success-card {
  text-align: center;
  border: 2px dashed var(--el-color-primary);
  background-color: var(--el-color-success-light-9);
}
.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.success-content h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}
.success-content p {
  font-size: 1rem;
  line-height: 1.6;
}
.icon-circle {
  width: 64px;
  height: 64px;
  background-color: var(--el-color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 20px;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(15px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-15px);
}

/* Usage & Tables */
.usage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}
.usage-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}
.usage-header h3 {
  font-size: 1.35rem;
  margin: 0;
}
.kbd-key {
  display: inline-block;
  padding: 3px 8px;
  background-color: var(--el-fill-color);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  border-bottom-width: 2px;
  font-family: monospace;
  font-size: 0.85rem;
  color: var(--el-text-color-primary);
  transition: all 0.3s;
}
.table-bordered {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
}

/* Contributors */
.contributors-flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  margin-bottom: 50px;
}
.contributor-item {
  text-align: center;
}
.contributor-avatar {
  border: 3px solid var(--el-bg-color-overlay);
  box-shadow: var(--el-box-shadow-light);
  margin-bottom: 12px;
  transition: border-color 0.3s;
}
.c-name {
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
  transition: color 0.3s;
}
.c-role {
  font-size: 0.875rem;
  color: var(--el-text-color-regular);
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

/* Footer */
.footer {
  background-color: var(--el-fill-color-darker);
  padding: 60px 0 30px;
  border-top: 1px solid var(--el-border-color-dark);
  transition: background-color 0.3s;
}
.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}
.footer-brand .footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}
.footer-logo img {
  width: 40px;
  height: 40px;
  filter: grayscale(1) brightness(1.5);
}
.footer-logo span {
  color: var(--el-text-color-primary);
  font-size: 1.25rem;
  font-weight: bold;
}
.footer-brand p {
  color: var(--el-text-color-regular);
}
.footer-links h4,
.footer-license h4 {
  color: var(--el-text-color-primary);
  margin-bottom: 20px;
  font-size: 1rem;
}
.footer-links a {
  display: block;
  color: var(--el-text-color-regular);
  text-decoration: none;
  margin-bottom: 10px;
  transition: color 0.2s;
}
.footer-links a:hover {
  color: var(--el-color-primary);
}
.footer-license p {
  line-height: 1.6;
  font-size: 0.875rem;
  color: var(--el-text-color-regular);
}
.footer-bottom {
  border-top: 1px solid var(--el-border-color-dark);
  padding-top: 20px;
  text-align: center;
  font-size: 0.875rem;
  color: var(--el-text-color-secondary);
}

/* Ghi đè Element Plus Table Header/Row Backgrounds để đồng nhất màu lật */
:deep(.el-table),
:deep(.el-table__expanded-cell) {
  background-color: transparent !important;
}
:deep(.el-table th.el-table__cell) {
  background-color: var(--el-fill-color-light) !important;
  color: var(--el-text-color-primary);
}
:deep(.el-table tr) {
  background-color: var(--el-bg-color-overlay) !important;
}
:deep(
  .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell
) {
  background-color: var(--el-fill-color-lighter) !important;
}
</style>
