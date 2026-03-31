<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import {
  Menu,
  Download,
  Lightning,
  Edit,
  MagicStick,
  Check,
  ChatLineRound,
  DocumentCopy,
  Setting,
  Cpu,
  Plus,
  Aim,
  Brush,
} from '@element-plus/icons-vue';
import InteractiveInstaller from '../components/InteractiveInstaller.vue';

// --- STATE ---
const mobileMenuOpen = ref<boolean>(false);
const activeOS = ref<string>('arch');
const setupStep = ref<number>(0);
const isScrolled = ref<boolean>(false);
const starCount = ref<string>('160+');
const contributorCount = ref<number>(5);
const REPO = 'LotusInputMethod/fcitx5-lotus';

// --- CATPPUCCIN THEME LOGIC ---
const catppuccinThemes = ['latte', 'frappe', 'macchiato', 'mocha'] as const;
type CatppuccinTheme = (typeof catppuccinThemes)[number];

const currentTheme = ref<CatppuccinTheme>('mocha');

const cycleTheme = (): void => {
  const currentIndex = catppuccinThemes.indexOf(currentTheme.value);
  const nextIndex = (currentIndex + 1) % catppuccinThemes.length;
  const nextTheme = catppuccinThemes[nextIndex] as CatppuccinTheme;

  currentTheme.value = nextTheme;
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem('catppuccin-theme', nextTheme);
};

// Hàm định dạng tên theme
const formatThemeName = (name: string) =>
  name.charAt(0).toUpperCase() + name.slice(1);

// --- SCROLL HANDLING ---
const handleScroll = (): void => {
  isScrolled.value = window.scrollY > 20;
};

const fullText = 'Gõ không gạch chân cực mượt';
const displayText = ref<string>('');
const typingSpeed = 100;
let typingTimer: ReturnType<typeof setInterval>;
let resetTimer: ReturnType<typeof setTimeout>;

const startTyping = () => {
  let i = 0;
  displayText.value = '';
  typingTimer = setInterval(() => {
    if (i < fullText.length) {
      displayText.value += fullText.charAt(i);
      i++;
    } else {
      clearInterval(typingTimer);
      resetTimer = setTimeout(startTyping, 3000);
    }
  }, typingSpeed);
};

const fetchGithubStars = async () => {
  const CACHE_KEY = 'lotus_stars_cache';
  const CACHE_TIME_KEY = 'lotus_stars_timestamp';
  const TWO_HOURS = 2 * 60 * 60 * 1000;

  try {
    const cachedStars = localStorage.getItem(CACHE_KEY);
    const lastFetch = localStorage.getItem(CACHE_TIME_KEY);
    const now = Date.now();

    if (cachedStars && lastFetch && now - parseInt(lastFetch) < TWO_HOURS) {
      starCount.value = cachedStars;
      return;
    }

    const response = await fetch(`https://api.github.com/repos/${REPO}`);
    if (!response.ok) throw new Error('GitHub API rate limit or error');

    const data = await response.json();
    const count = data.stargazers_count.toLocaleString();

    starCount.value = count;
    localStorage.setItem(CACHE_KEY, count);
    localStorage.setItem(CACHE_TIME_KEY, now.toString());
  } catch (error) {
    console.error('Lỗi khi lấy star từ GitHub:', error);
    const oldCache = localStorage.getItem(CACHE_KEY);
    if (oldCache) starCount.value = oldCache;
  }
};

const fetchContributors = async () => {
  const CACHE_KEY = 'lotus_contributors_cache_v2';
  const CACHE_TIME_KEY = 'lotus_contributors_timestamp_v2';
  const TWO_HOURS = 2 * 60 * 60 * 1000;

  const specialRoles: Record<string, string> = {
    nhktmdzhg: 'Founder',
  };

  const blacklist = ['thanhpy2009', 'loccun'];

  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const lastFetch = localStorage.getItem(CACHE_TIME_KEY);
    const now = Date.now();

    if (cachedData && lastFetch && now - parseInt(lastFetch) < TWO_HOURS) {
      const parsed = JSON.parse(cachedData);
      // Filter again in case the blacklist was updated and we have stale cache
      const filtered = parsed.filter(
        (c: any) => !blacklist.includes(c.name) && !c.name.includes('[bot]'),
      );
      contributors.value = filtered;
      contributorCount.value = filtered.length;
      return;
    }

    const response = await fetch(`https://api.github.com/repos/${REPO}/contributors`);
    if (!response.ok) throw new Error('GitHub API error');

    const data = await response.json();
    const fetchedContributors: Contributor[] = data
      .filter((item: any) => !blacklist.includes(item.login) && item.type !== 'Bot')
      .map((item: any) => ({
        name: item.login,
        role: specialRoles[item.login] || 'Contributor',
        avatar: item.avatar_url,
        githubUrl: item.html_url,
      }));

    contributors.value = fetchedContributors;
    contributorCount.value = fetchedContributors.length;
    localStorage.setItem(CACHE_KEY, JSON.stringify(fetchedContributors));
    localStorage.setItem(CACHE_TIME_KEY, now.toString());
  } catch (error) {
    console.error('Lỗi khi lấy contributor từ GitHub:', error);
    const oldCache = localStorage.getItem(CACHE_KEY);
    if (oldCache) {
      contributors.value = JSON.parse(oldCache);
      contributorCount.value = contributors.value.length;
    }
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem('catppuccin-theme');
  if (savedTheme && catppuccinThemes.includes(savedTheme as CatppuccinTheme)) {
    currentTheme.value = savedTheme as CatppuccinTheme;
  } else if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: light)').matches
  ) {
    currentTheme.value = 'latte';
  } else {
    currentTheme.value = 'mocha';
  }

  document.documentElement.setAttribute('data-theme', currentTheme.value);
  window.addEventListener('scroll', handleScroll);
  startTyping();
  fetchGithubStars();
  fetchContributors();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  clearInterval(typingTimer);
  clearTimeout(resetTimer);
});

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
  {
    option: 'Custom Dictionary',
    description: 'Từ điển tuỳ chỉnh',
    default: 'Tắt',
  },
];

interface AdvancedSettingInfo {
  page: string;
  option: string;
  feature: string;
}

const advancedSettings: AdvancedSettingInfo[] = [
  {
    page: 'General',
    option: 'Mode Menu Hotkey',
    feature: 'Phím tắt menu chế độ gõ',
  },
  {
    page: 'General',
    option: 'Input Method',
    feature: 'Kiểu gõ. Mặc định Telex.',
  },
  {
    page: 'Typing',
    option: 'Allow dd to produce đ',
    feature: 'Cho phép dd->đ là tiếng việt, hay dùng cho gõ tắt',
  },
  {
    page: 'Typing',
    option: 'Use oà, uý instead of òa, úy',
    feature: 'Bỏ dấu vị trí chuẩn tiếng việt thay vì bỏ theo thẩm mỹ',
  },
  {
    page: 'Typing',
    option: 'Type w to produce ư',
    feature:
      'Gõ w ra ư, dùng ở kiểu gõ telex nếu có nhu cầu này vì Telex mặc định không có.',
  },
  {
    page: 'Typing',
    option: 'Fix uinput with ack',
    feature: 'Sửa lỗi khi dùng chromium-based trên X11',
  },
  {
    page: 'Typing',
    option: 'Double space to period',
    feature: 'Gõ dấu cách 2 lần để chấm câu, thử nghiệm',
  },
  {
    page: 'Typing',
    option: 'Auto capitalize',
    feature: 'Tự viết hoa sau dấu câu, thử nghiệm',
  },
  {
    page: 'Applications',
    option: '',
    feature: 'Quản lý chế độ mặc định của các ứng dụng',
  },
  {
    page: 'Macros',
    option: '',
    feature: 'Quản lý các từ gõ tắt',
  },
  {
    page: 'Dictionary',
    option: '',
    feature: 'Quản lý từ điển tuỳ chỉnh',
  },
  {
    page: 'Keymap',
    option: '',
    feature: 'Quản lý keymap tuỳ chỉnh',
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
    description:
      'Chế độ mặc định, phản hồi nhanh. Tối ưu ứng dụng tốc độ cao và máy cấu hình tốt.',
  },
  {
    mode: 'Uinput (Slow)',
    shortcut: '2',
    description:
      'Tốc độ gửi phím chậm hơn. Tối ưu các ứng dụng xử lý phím chậm, hoặc máy có cấu hình yếu.',
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
  githubUrl: string;
}
const contributors = ref<Contributor[]>([
  {
    name: 'Nguyen Hoang Ky',
    role: 'Founder',
    avatar: 'https://avatars.githubusercontent.com/u/57983253?v=4',
    githubUrl: 'https://github.com/khog9',
  },
  {
    name: 'Huỳnh Thiện Lộc',
    role: 'Contributor',
    avatar: 'https://avatars.githubusercontent.com/u/148019203?v=4',
    githubUrl: 'https://github.com/hthienloc',
  },
  {
    name: 'Nguyễn Hồng Hiệp',
    role: 'Contributor',
    avatar: 'https://avatars.githubusercontent.com/u/57614330?v=4',
    githubUrl: 'https://github.com/Hiep-N',
  },
  {
    name: 'Đặng Quang Hiển',
    role: 'Contributor',
    avatar: 'https://avatars.githubusercontent.com/u/83270073?v=4',
    githubUrl: 'https://github.com/dqhien',
  },
  {
    name: 'Zebra2711',
    role: 'Contributor',
    avatar: 'https://avatars.githubusercontent.com/u/89755535?v=4',
    githubUrl: 'https://github.com/Zebra2711',
  },
]);

// --- COMMANDS ---
const commands: Record<string, string> = {
  arch: '# Dùng yay\nyay -S fcitx5-lotus-bin\n\n# Hoặc dùng paru\nparu -S fcitx5-lotus-bin',
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
  envZsh: `cat <<EOF >> ~/.zprofile\nexport GTK_IM_MODULE=fcitx\nexport QT_IM_MODULE=fcitx\nexport XMODIFIERS=@im=fcitx\nexport SDL_IM_MODULE=fcitx\nexport GLFW_IM_MODULE=ibus\nEOF`,
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
          <a href="#installation">Cài đặt & Thiết lập</a>
          <a href="#usage">Hướng dẫn</a>
          <a href="#contributors">Đóng góp</a>

          <el-button round class="btn-theme" @click="cycleTheme">
            <el-icon class="mr-2"><Brush /></el-icon>
            {{ formatThemeName(currentTheme) }}
          </el-button>

          <el-button
            type="primary"
            round
            class="btn-github"
            @click="goToGitHub"
          >
            <v-icon name="si-github" class="mr-2" /> GitHub
          </el-button>
        </div>

        <div class="mobile-controls">
          <el-button circle class="btn-theme" @click="cycleTheme">
            <el-icon><Brush /></el-icon>
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
        <a href="#installation" @click="mobileMenuOpen = false"
          >Cài đặt & Thiết lập</a
        >
        <a href="#usage" @click="mobileMenuOpen = false">Hướng dẫn</a>
        <a href="#contributors" @click="mobileMenuOpen = false">Đóng góp</a>
        <el-button type="primary" @click="goToGitHub">
          <v-icon name="si-github" class="mr-2" /> GitHub
        </el-button>
      </div>
    </nav>

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
            <el-button
              type="primary"
              size="large"
              class="btn-install"
              @click="scrollToInstall"
            >
              <el-icon class="mr-2"><Download /></el-icon> Cài đặt ngay
            </el-button>
            <el-button size="large" class="btn-source" @click="goToGitHub">
              <v-icon name="si-github" class="mr-2" scale="1.1" /> Xem trên
              GitHub
            </el-button>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <strong>{{ starCount }}</strong>
              <span>Stars</span>
            </div>
            <div class="stat-item">
              <strong>
                <v-icon name="si-linux" scale="1.8" class="align-bottom" /> 6+
              </strong>
              <span>Distros hỗ trợ</span>
            </div>
            <div class="stat-item">
              <strong>{{ contributorCount }}</strong>
              <span>Người đóng góp</span>
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
            <div class="icon-wrapper color-green">
              <el-icon><Lightning /></el-icon>
            </div>
            <h3>Hiệu năng cực cao</h3>
            <p>
              Gửi phím thông qua Uinput giúp loại bỏ hoàn toàn độ trễ, tối ưu
              tuyệt đối cho các ứng dụng có tốc độ xử lý nhanh.
            </p>
          </div>
          <div class="custom-card">
            <div class="icon-wrapper color-mauve">
              <el-icon><MagicStick /></el-icon>
            </div>
            <h3>Macro & Sửa lỗi thông minh</h3>
            <p>
              Hỗ trợ gõ tắt mạnh mẽ, kiểm tra chính tả tự động, và tính năng tự
              động khôi phục từ khi gõ tiếng nước ngoài.
            </p>
          </div>
          <div class="custom-card">
            <div class="icon-wrapper color-peach">
              <el-icon><Check /></el-icon>
            </div>
            <h3>Kiểm soát hoàn toàn</h3>
            <p>
              Tự định nghĩa Custom Keymap, hỗ trợ đặt dấu oà/uý chuẩn mới, cho
              phép bỏ dấu tự do ở bất kỳ vị trí nào.
            </p>
          </div>
          <div class="custom-card">
            <div class="icon-wrapper color-pink">
              <el-icon><ChatLineRound /></el-icon>
            </div>
            <h3>Emoji & Chế độ linh hoạt</h3>
            <p>
              Tích hợp Emoji Picker siêu tốc với fuzzy search. Chuyển đổi linh
              hoạt giữa 8 chế độ gõ chỉ bằng một phím tắt.
            </p>
          </div>
          <div class="custom-card">
            <div class="icon-wrapper color-sky">
              <v-icon name="si-linux" scale="1.5" />
            </div>
            <h3>Chuẩn bài Linux</h3>
            <p>
              Hoạt động ổn định trên X11/Wayland, tương thích ngược với Wine và
              hỗ trợ tối đa cho trình duyệt nhân Chromium.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section id="installation" class="section section-bg-mantle">
      <div class="container">
        <div class="section-title">
          <h2>Cài đặt & Thiết lập</h2>
          <p>
            Chọn cấu hình hệ thống của bạn để nhận hướng dẫn cài đặt tối ưu
            nhất.
          </p>
        </div>
        <div class="installer-wrapper">
          <InteractiveInstaller />
        </div>
      </div>
    </section>

    <section id="usage" class="section section-bg-mantle">
      <div class="container">
        <div class="section-title">
          <h2>Hướng dẫn sử dụng & Tùy chỉnh</h2>
          <p>Làm chủ bộ gõ của bạn với các menu cài đặt đa dạng</p>
        </div>

        <div class="usage-grid">
          <div class="custom-card">
            <div class="usage-header">
              <el-icon class="icon-title color-green"><Setting /></el-icon>
              <h3>Cài đặt nhanh</h3>
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
              <el-table-column prop="default" label="Mặc định" />
            </el-table>

            <div class="usage-header mt-6">
              <el-icon class="icon-title color-mauve"><Edit /></el-icon>
              <h3>Cài đặt nâng cao</h3>
            </div>
            <p class="text-sm instruction mb-3">
              Nhấp chuột phải vào biểu tượng Lotus trên khay hệ thống (System
              Tray) -> Settings
            </p>
            <el-table
              :data="advancedSettings"
              size="small"
              class="table-bordered"
            >
              <el-table-column prop="page" label="Trang" width="140" />
              <el-table-column prop="option" label="Tuỳ chọn" />
              <el-table-column prop="feature" label="Tính năng" />
            </el-table>
          </div>

          <div class="custom-card">
            <div class="usage-header">
              <el-icon class="icon-title color-blue"><Cpu /></el-icon>
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
              class="custom-alert-info mb-4"
            />

            <el-alert
              title="Về phím tắt của menu chế độ gõ"
              type="info"
              description="Phím tắt của menu chế độ gõ có thể tuỳ chỉnh được trong cài đặt của lotus, bạn nên chỉnh nếu bạn có nhu cầu gõ phím này nhiều."
              :closable="false"
              class="custom-alert-info"
            />
          </div>
        </div>
      </div>
    </section>

    <section id="contributors" class="section section-bg-base">
      <div class="container">
        <div class="section-title">
          <h2>Cộng đồng mã nguồn mở</h2>
          <p>Cảm ơn những người đã đóng góp xây dựng bộ gõ</p>
        </div>

        <div class="contributors-flex">
          <div
            v-for="c in contributors"
            :key="c.name"
            class="contributor-item"
            @click="openLink(c.githubUrl)"
          >
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
            <el-icon class="mr-2"><Plus /></el-icon> Tham gia đóng góp ngay
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
          <a
            href="https://github.com/LotusInputMethod/fcitx5-lotus"
            class="flex items-center gap-2"
          >
            <v-icon name="si-github" /> GitHub
          </a>
          <a href="https://github.com/LotusInputMethod/fcitx5-lotus/releases"
            >Releases</a
          >
          <a
            href="https://github.com/LotusInputMethod/fcitx5-lotus/issues/new?template=bug_report.yml"
            >Báo lỗi (Issues)</a
          >
        </div>
        <div class="footer-links">
          <h4>Tài liệu</h4>
          <a href="#installation">Cài đặt & Thiết lập</a>
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
        <div>© {{ new Date().getFullYear() }} Fcitx5 Lotus Team.</div>
        <div class="mt-2">
          Trang web này là mã nguồn mở,
          <a
            href="https://github.com/LotusInputMethod/LotusInputMethod.github.io"
            target="_blank"
            class="text-link"
            >xem mã nguồn tại đây</a
          >.
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* ========================================================================== */
/* 1. CATPPUCCIN COLOR PALETTE - 100% VARIABLES, NO HARDCODING                */
/* ========================================================================== */
:root[data-theme='latte'] {
  --ctp-base: #eff1f5;
  --ctp-mantle: #e6e9ef;
  --ctp-crust: #dce0e8;
  --ctp-surface0: #ccd0da;
  --ctp-surface1: #bcc0cc;
  --ctp-surface2: #acb0be;
  --ctp-text: #4c4f69;
  --ctp-subtext1: #5c5f77;
  --ctp-subtext0: #6c6f85;
  --ctp-overlay2: #7c7f93;
  --ctp-overlay1: #8c8fa1;
  --ctp-overlay0: #9ca0b0;

  --ctp-green: #40a02b;
  --ctp-blue: #1e66f5;
  --ctp-mauve: #8839ef;
  --ctp-yellow: #df8e1d;
  --ctp-red: #d20f39;
  --ctp-peach: #fe640b;
  --ctp-pink: #ea76cb;
  --ctp-sky: #04a5e5;
}

:root[data-theme='frappe'] {
  --ctp-base: #303446;
  --ctp-mantle: #292c3c;
  --ctp-crust: #232634;
  --ctp-surface0: #414559;
  --ctp-surface1: #51576d;
  --ctp-surface2: #626880;
  --ctp-text: #c6d0f5;
  --ctp-subtext1: #b5bfe2;
  --ctp-subtext0: #a5adce;
  --ctp-overlay2: #949cbb;
  --ctp-overlay1: #838ba7;
  --ctp-overlay0: #737994;

  --ctp-green: #a6d189;
  --ctp-blue: #8caaee;
  --ctp-mauve: #ca9ee6;
  --ctp-yellow: #e5c890;
  --ctp-red: #e78284;
  --ctp-peach: #ef9f76;
  --ctp-pink: #f4b8e4;
  --ctp-sky: #99d1db;
}

:root[data-theme='macchiato'] {
  --ctp-base: #24273a;
  --ctp-mantle: #1e2030;
  --ctp-crust: #181926;
  --ctp-surface0: #363a4f;
  --ctp-surface1: #494d64;
  --ctp-surface2: #5b6078;
  --ctp-text: #cad3f5;
  --ctp-subtext1: #b8c0e0;
  --ctp-subtext0: #a5adcb;
  --ctp-overlay2: #939ab7;
  --ctp-overlay1: #8087a2;
  --ctp-overlay0: #6e738d;

  --ctp-green: #a6da95;
  --ctp-blue: #8aadf4;
  --ctp-mauve: #c6a0f6;
  --ctp-yellow: #eed49f;
  --ctp-red: #ed8796;
  --ctp-peach: #f5a97f;
  --ctp-pink: #f5bde6;
  --ctp-sky: #91d7e3;
}

:root[data-theme='mocha'] {
  --ctp-base: #1e1e2e;
  --ctp-mantle: #181825;
  --ctp-crust: #11111b;
  --ctp-surface0: #313244;
  --ctp-surface1: #45475a;
  --ctp-surface2: #585b70;
  --ctp-text: #cdd6f4;
  --ctp-subtext1: #bac2de;
  --ctp-subtext0: #a6adc8;
  --ctp-overlay2: #9399b2;
  --ctp-overlay1: #7f849c;
  --ctp-overlay0: #6c7086;

  --ctp-green: #a6e3a1;
  --ctp-blue: #89b4fa;
  --ctp-mauve: #cba6f7;
  --ctp-yellow: #f9e2af;
  --ctp-red: #f38ba8;
  --ctp-peach: #fab387;
  --ctp-pink: #f5c2e7;
  --ctp-sky: #89dceb;
}

/* ========================================================================== */
/* 2. ÉP ELEMENT PLUS DÙNG CHUẨN MÀU CATPPUCCIN                               */
/* ========================================================================== */
:root {
  --el-color-primary: var(--ctp-green);
  --el-color-success: var(--ctp-green);
  --el-color-warning: var(--ctp-yellow);
  --el-color-danger: var(--ctp-red);
  --el-color-info: var(--ctp-overlay0);

  --el-bg-color: var(--ctp-base);
  --el-bg-color-page: var(--ctp-base);
  --el-bg-color-overlay: var(--ctp-surface0);

  --el-text-color-primary: var(--ctp-text);
  --el-text-color-regular: var(--ctp-subtext1);
  --el-text-color-secondary: var(--ctp-subtext0);

  --el-border-color: var(--ctp-surface2);
  --el-border-color-light: var(--ctp-surface1);
  --el-border-color-lighter: var(--ctp-surface0);

  --el-fill-color: var(--ctp-surface1);
  --el-fill-color-light: var(--ctp-surface0);
  --el-fill-color-lighter: var(--ctp-mantle);
  --el-fill-color-dark: var(--ctp-surface2);
  --el-fill-color-darker: var(--ctp-crust);

  --el-box-shadow-light: 0 4px 12px rgba(0, 0, 0, 0.1);
  --max-width: 1200px;
}

html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  scroll-behavior: smooth;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
    sans-serif;
  background-color: var(--ctp-base);
  color: var(--ctp-text);
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}
*,
*::before,
*::after {
  box-sizing: inherit;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: var(--ctp-base);
}
::-webkit-scrollbar-thumb {
  background: var(--ctp-surface2);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--ctp-green);
}

.ov-icon {
  fill: currentColor;
  vertical-align: middle;
  transition: fill 0.3s ease;
}

.el-message {
  background-color: var(--ctp-surface0) !important;
  border-color: var(--ctp-surface1) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
}

.el-message__content {
  color: var(--ctp-text) !important;
  font-weight: 500;
}

.el-message--success .el-message__content {
  color: var(--ctp-green) !important;
}
.el-message--success .el-icon {
  color: var(--ctp-green) !important;
}

.el-message--error .el-message__content {
  color: var(--ctp-red) !important;
}
.el-message--error .el-icon {
  color: var(--ctp-red) !important;
}

.el-message--info .el-message__content {
  color: var(--ctp-blue) !important;
}
</style>

<style scoped>
/* ========================================================================== */
/* 3. CSS CHO TỪNG THÀNH PHẦN                                                 */
/* ========================================================================== */
.section {
  padding: 80px 0;
}
.mr-2 {
  margin-right: 8px;
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
.align-bottom {
  vertical-align: text-bottom;
}

.section-bg-main {
  background-color: var(--ctp-base);
  transition: background-color 0.3s;
}
.section-bg-mantle {
  background-color: var(--ctp-mantle);
  transition: background-color 0.3s;
}
.section-bg-base {
  background-color: var(--ctp-base);
  transition: background-color 0.3s;
}

.instruction {
  color: var(--ctp-subtext1);
  transition: color 0.3s;
}
.text-link {
  color: var(--ctp-blue);
  text-decoration: none;
  font-weight: 500;
}
.text-link:hover {
  text-decoration: underline;
}
.border {
  border: 1px solid var(--ctp-surface1);
  transition: border-color 0.3s;
}
.rounded {
  border-radius: 4px;
}
.rounded-lg {
  border-radius: 8px;
}

.custom-card {
  background-color: var(--ctp-surface0);
  border: 1px solid var(--ctp-surface1);
  color: var(--ctp-text);
  border-radius: 12px;
  padding: 30px;
  box-shadow: var(--el-box-shadow-light);
  transition:
    background-color 0.3s,
    border-color 0.3s,
    color 0.3s,
    transform 0.3s;
}
.sub-card {
  background-color: var(--ctp-mantle);
}

.inline-code {
  background-color: var(--ctp-surface1);
  color: var(--ctp-text);
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
  background-color: var(--ctp-crust);
  border: 1px solid var(--ctp-surface1);
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
  color: var(--ctp-text);
  font-family: monospace;
  font-size: 0.875rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.btn-copy {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--ctp-surface1);
  border: 1px solid var(--ctp-surface2);
  color: var(--ctp-subtext1);
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
  background: var(--ctp-green);
  color: var(--ctp-crust);
  border-color: var(--ctp-green);
}

/* Buttons Custom cho theme Catppuccin */
.btn-theme {
  font-weight: bold;
  border-color: var(--ctp-surface2) !important;
  color: var(--ctp-text) !important;
  background: transparent !important;
}
.btn-github {
  background-color: var(--ctp-surface1) !important;
  border: 1px solid var(--ctp-surface2) !important;
  color: var(--ctp-text) !important;
  transition: all 0.3s ease;
}
.btn-github:hover {
  border-color: var(--ctp-green) !important;
  color: var(--ctp-surface2) !important;
}
.btn-source {
  background-color: var(--ctp-surface0) !important;
  border: 1px solid var(--ctp-surface2) !important;
  color: var(--ctp-text) !important;
  padding: 0 24px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}
.btn-source:hover {
  background-color: var(--ctp-surface1) !important;
  border-color: var(--ctp-green) !important;
  color: var(--ctp-green) !important;
}

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

/* Titles */
.section-title {
  text-align: center;
  margin-bottom: 40px;
}
.section-title h2 {
  font-size: 2.2rem;
  color: var(--ctp-text);
  margin-bottom: 10px;
  transition: color 0.3s;
}
.section-title p {
  font-size: 1.1rem;
  color: var(--ctp-subtext1);
  max-width: 600px;
  margin: 0 auto;
  transition: color 0.3s;
}

/* Hero Section */
.hero {
  padding: 160px 0 100px;
  background-color: var(--ctp-mantle);
  overflow: hidden;
  transition: background 0.3s;
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
  color: var(--ctp-green);
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
  box-shadow: var(--el-box-shadow-light);
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
  font-family: monospace;
  font-size: 0.75rem;
}
.term-body {
  padding: 24px;
  font-family: monospace;
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
  font-family: monospace;
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
.highlight-card {
  border: 2px solid var(--ctp-green);
  background-color: color-mix(
    in srgb,
    var(--ctp-green) 5%,
    var(--ctp-surface0)
  );
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
  background-color: var(--ctp-green);
  color: var(--ctp-base);
  box-shadow: 0 4px 10px color-mix(in srgb, var(--ctp-green) 30%, transparent);
}
.color-green {
  background-color: color-mix(in srgb, var(--ctp-green) 15%, transparent);
  color: var(--ctp-green);
}
.color-blue {
  background-color: color-mix(in srgb, var(--ctp-blue) 15%, transparent);
  color: var(--ctp-blue);
}
.color-mauve {
  background-color: color-mix(in srgb, var(--ctp-mauve) 15%, transparent);
  color: var(--ctp-mauve);
}
.color-peach {
  background-color: color-mix(in srgb, var(--ctp-peach) 15%, transparent);
  color: var(--ctp-peach);
}
.color-pink {
  background-color: color-mix(in srgb, var(--ctp-pink) 15%, transparent);
  color: var(--ctp-pink);
}
.color-sky {
  background-color: color-mix(in srgb, var(--ctp-sky) 15%, transparent);
  color: var(--ctp-sky);
}

/* Setup & Installation Box */
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
  background-color: color-mix(in srgb, var(--ctp-green) 15%, transparent);
  color: var(--ctp-green);
  border-radius: 50%;
  font-weight: bold;
  font-size: 1.1rem;
}
.step-list {
  margin: 0;
  padding-left: 20px;
  line-height: 1.6;
  color: var(--ctp-subtext1);
}

/* Tabs Layout with Icons */
.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Accordions */
.advanced-details summary {
  cursor: pointer;
  font-weight: 600;
  color: var(--ctp-text);
  background-color: var(--ctp-surface1);
  padding: 10px 15px;
  border-radius: 6px;
  border: 1px solid var(--ctp-surface2);
  transition:
    background-color 0.3s,
    color 0.3s,
    border-color 0.3s;
}
.advanced-details summary:hover {
  background-color: var(--ctp-surface2);
}

/* Alerts */
.custom-alert {
  background-color: color-mix(
    in srgb,
    var(--ctp-green) 15%,
    var(--ctp-surface0)
  );
  color: var(--ctp-green);
  border: 1px solid var(--ctp-green);
}
.custom-alert-info :deep(.el-alert__description) {
  color: var(--ctp-text) !important;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-top: 5px;
}

.custom-alert-info :deep(.el-alert__title) {
  color: var(--ctp-blue) !important;
  font-weight: bold;
  font-size: 1rem;
}

.custom-alert-info {
  background-color: color-mix(
    in srgb,
    var(--ctp-blue) 10%,
    var(--ctp-surface0)
  ) !important;
  border: 1px solid var(--ctp-blue) !important;
  padding: 15px;
}
.custom-alert-warn {
  background-color: color-mix(
    in srgb,
    var(--ctp-yellow) 15%,
    var(--ctp-surface0)
  );
  color: var(--ctp-yellow);
  border: 1px solid var(--ctp-yellow);
}
.warning-box {
  background-color: color-mix(
    in srgb,
    var(--ctp-yellow) 15%,
    var(--ctp-surface0)
  );
  border: 1px solid var(--ctp-yellow);
  color: var(--ctp-yellow);
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Buttons setup */
.step-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding: 0 10px;
}
.step-actions .el-button:not(.el-button--primary):not(.btn-success) {
  background-color: var(--ctp-surface0) !important;
  border: 1px solid var(--ctp-surface2) !important;
  color: var(--ctp-text) !important;
  transition: all 0.3s ease;
}

.step-actions
  .el-button:not(.el-button--primary):not(.btn-success):hover:not(:disabled) {
  background-color: var(--ctp-surface1) !important;
  border-color: var(--ctp-overlay0) !important;
  color: var(--ctp-text) !important;
}

.step-actions .el-button:disabled {
  background-color: var(--ctp-mantle) !important;
  border-color: var(--ctp-surface0) !important;
  color: var(--ctp-overlay0) !important;
  cursor: not-allowed;
  opacity: 0.6;
}
.btn-success {
  background-color: var(--ctp-green) !important;
  border-color: var(--ctp-green) !important;
  color: var(--ctp-base) !important;
}

/* Màn hình Success */
.success-card {
  text-align: center;
  padding: 40px 20px;
  border: 2px dashed var(--ctp-green);
  background-color: color-mix(
    in srgb,
    var(--ctp-green) 5%,
    var(--ctp-surface0)
  );
}
.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.success-content h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: var(--ctp-text);
}
.success-content p {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--ctp-subtext1);
}
.icon-circle {
  width: 64px;
  height: 64px;
  background-color: var(--ctp-green);
  color: var(--ctp-base);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 20px;
}

/* Hiệu ứng trượt ngang */
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

/* Usage */
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
  color: var(--ctp-text);
}
.icon-title {
  font-size: 24px;
}
.kbd-key {
  display: inline-block;
  padding: 3px 8px;
  background-color: var(--ctp-surface1);
  border: 1px solid var(--ctp-surface2);
  border-radius: 4px;
  border-bottom-width: 2px;
  font-family: monospace;
  font-size: 0.85rem;
  color: var(--ctp-text);
  transition: all 0.3s;
}
.table-bordered {
  border: 1px solid var(--ctp-surface1);
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

/* Footer */
.footer {
  background-color: var(--ctp-crust);
  padding: 60px 0 30px;
  border-top: 1px solid var(--ctp-mantle);
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
  transition: transform 0.3s ease;
}

.footer-logo img:hover {
  transform: scale(1.1);
}
.footer-logo span {
  color: var(--ctp-text);
  font-size: 1.25rem;
  font-weight: bold;
}
.footer-brand p {
  color: var(--ctp-subtext1);
}
.footer-links h4,
.footer-license h4 {
  color: var(--ctp-text);
  margin-bottom: 20px;
  font-size: 1rem;
}
.footer-links a {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ctp-subtext0);
  text-decoration: none;
  margin-bottom: 10px;
  transition: color 0.2s;
}
.footer-links a:hover {
  color: var(--ctp-green);
}
.footer-license p {
  line-height: 1.6;
  font-size: 0.875rem;
  color: var(--ctp-subtext0);
}
.footer-bottom {
  border-top: 1px solid var(--ctp-surface0);
  padding-top: 20px;
  text-align: center;
  font-size: 0.875rem;
  color: var(--ctp-subtext0);
}

/* ÉP Element Plus Table Theo Màu Catppuccin */
:deep(.el-tabs__item) {
  font-size: 15px;
  height: 48px;
  line-height: 48px;
  color: var(--ctp-subtext1);
  transition: color 0.3s;
}
:deep(.el-tabs__item.is-active) {
  font-weight: bold;
  color: var(--ctp-green);
}
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--ctp-surface0);
  color: var(--ctp-text);
  transition:
    background-color 0.3s,
    color 0.3s;
}
:deep(.el-table th.el-table__cell) {
  background-color: var(--ctp-surface1) !important;
  color: var(--ctp-text);
  border-bottom: 1px solid var(--ctp-surface2);
}
:deep(.el-table tr) {
  background-color: var(--ctp-surface0) !important;
  transition: background-color 0.3s;
}
:deep(.el-table td.el-table__cell),
:deep(.el-table th.el-table__cell.is-leaf) {
  border-bottom-color: var(--ctp-surface1);
  transition: border-color 0.3s;
}
:deep(
  .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell
) {
  background-color: var(--ctp-mantle) !important;
  transition: background-color 0.3s;
}
:deep(.el-button--primary) {
  background-color: var(--ctp-green) !important;
  border-color: var(--ctp-green) !important;
  color: var(--ctp-base) !important;
}
:deep(.el-button--primary:hover) {
  opacity: 0.9;
}
</style>
