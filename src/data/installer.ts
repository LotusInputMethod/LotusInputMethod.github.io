export const distros = [
  { name: 'Ubuntu', icon: 'si-ubuntu' },
  { name: 'Debian', icon: 'si-debian' },
  { name: 'Fedora', icon: 'si-fedora' },
  { name: 'Arch Linux', icon: 'si-archlinux' },
  { name: 'openSUSE', icon: 'si-opensuse' },
  { name: 'NixOS', icon: 'si-nixos' },
  { name: 'Void Linux', icon: 'co-linux' },
];

export type StepBlock =
  | { type: 'text'; content: string }
  | { type: 'code'; content: string };

export const methods = ['Package Manager', 'Binary', 'Source'];
export const shells = ['Bash', 'Zsh', 'Fish'];
export const deWms = [
  'GNOME',
  'KDE Plasma',
  'Xfce',
  'Cinnamon',
  'MATE',
  'Pantheon',
  'Budgie',
  'LXQt',
  'COSMIC',
  'i3',
  'Sway',
  'Hyprland',
  'Niri',
];
export const environments = ['X11', 'Wayland'];
export const initSystems = ['systemd', 'OpenRC', 'runit'];

export const logic = {
  steps: {
    install: {
      'Arch Linux': {
        'Package Manager': 'paru -S fcitx5-lotus-bin',
        Binary: 'Arch khuyến khích sử dụng AUR để cài đặt',
        Source: 'paru -S fcitx5-lotus-git',
      },
      Debian: {
        'Package Manager': {
          Bash: "CODENAME=$(grep '^VERSION_CODENAME=' /etc/os-release | cut -d'=' -f2)\nsudo mkdir -p /etc/apt/keyrings\ncurl -fsSL https://fcitx5-lotus.pages.dev/pubkey.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/fcitx5-lotus.gpg\necho \"deb [signed-by=/etc/apt/keyrings/fcitx5-lotus.gpg] https://fcitx5-lotus.pages.dev/apt/$CODENAME $CODENAME main\" | sudo tee /etc/apt/sources.list.d/fcitx5-lotus.list\nsudo apt update && sudo apt install fcitx5-lotus",
          Fish: "set CODENAME (grep '^VERSION_CODENAME=' /etc/os-release | cut -d'=' -f2)\nsudo mkdir -p /etc/apt/keyrings\ncurl -fsSL https://fcitx5-lotus.pages.dev/pubkey.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/fcitx5-lotus.gpg\necho \"deb [signed-by=/etc/apt/keyrings/fcitx5-lotus.gpg] https://fcitx5-lotus.pages.dev/apt/$CODENAME $CODENAME main\" | sudo tee /etc/apt/sources.list.d/fcitx5-lotus.list\nsudo apt update && sudo apt install fcitx5-lotus",
        },
        Binary: 'sudo dpkg -i fcitx5-lotus_*.deb',
        Source:
          'sudo apt-get install acl cmake extra-cmake-modules libfcitx5core-dev libfcitx5config-dev libfcitx5utils-dev libinput-dev libudev-dev g++ golang hicolor-icon-theme pkg-config libx11-dev fcitx5-modules-dev python3 librsvg2-bin\ngit clone https://github.com/LotusInputMethod/fcitx5-lotus.git\ncd fcitx5-lotus\ngit submodule update --init --recursive\ncmake -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_INSTALL_LIBDIR=/usr/lib/x86_64-linux-gnu .\nmake\nsudo make install',
      },
      Ubuntu: {
        'Package Manager': {
          Bash: "CODENAME=$(grep '^UBUNTU_CODENAME=' /etc/os-release | cut -d'=' -f2)\nsudo mkdir -p /etc/apt/keyrings\ncurl -fsSL https://fcitx5-lotus.pages.dev/pubkey.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/fcitx5-lotus.gpg\necho \"deb [signed-by=/etc/apt/keyrings/fcitx5-lotus.gpg] https://fcitx5-lotus.pages.dev/apt/$CODENAME $CODENAME main\" | sudo tee /etc/apt/sources.list.d/fcitx5-lotus.list\nsudo apt update && sudo apt install fcitx5-lotus",
          Fish: "set CODENAME (grep '^UBUNTU_CODENAME=' /etc/os-release | cut -d'=' -f2)\nsudo mkdir -p /etc/apt/keyrings\ncurl -fsSL https://fcitx5-lotus.pages.dev/pubkey.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/fcitx5-lotus.gpg\necho \"deb [signed-by=/etc/apt/keyrings/fcitx5-lotus.gpg] https://fcitx5-lotus.pages.dev/apt/$CODENAME $CODENAME main\" | sudo tee /etc/apt/sources.list.d/fcitx5-lotus.list\nsudo apt update && sudo apt install fcitx5-lotus",
        },
        Binary: 'sudo dpkg -i fcitx5-lotus_*.deb',
        Source:
          'sudo apt-get install acl cmake extra-cmake-modules libfcitx5core-dev libfcitx5config-dev libfcitx5utils-dev libinput-dev libudev-dev g++ golang hicolor-icon-theme pkg-config libx11-dev fcitx5-modules-dev python3 librsvg2-bin\ngit clone https://github.com/LotusInputMethod/fcitx5-lotus.git\ncd fcitx5-lotus\ngit submodule update --init --recursive\ncmake -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_INSTALL_LIBDIR=/usr/lib/x86_64-linux-gnu .\nmake\nsudo make install',
      },
      Fedora: {
        'Package Manager': {
          Bash: "RELEASEVER=$(grep '^VERSION_ID=' /etc/os-release | cut -d'=' -f2)\nsudo rpm --import https://fcitx5-lotus.pages.dev/pubkey.gpg\nsudo dnf config-manager addrepo --from-repofile=https://fcitx5-lotus.pages.dev/rpm/fedora/fcitx5-lotus-$RELEASEVER.repo\nsudo dnf install fcitx5-lotus",
          Fish: "set RELEASEVER (grep '^VERSION_ID=' /etc/os-release | cut -d'=' -f2)\nsudo rpm --import https://fcitx5-lotus.pages.dev/pubkey.gpg\nsudo dnf config-manager addrepo --from-repofile=https://fcitx5-lotus.pages.dev/rpm/fedora/fcitx5-lotus-$RELEASEVER.repo\nsudo dnf install fcitx5-lotus",
        },
        Binary: 'sudo rpm -i fcitx5-lotus-*.rpm',
        Source:
          'sudo dnf install acl cmake extra-cmake-modules fcitx5-devel libinput-devel libudev-devel gcc-c++ golang hicolor-icon-theme systemd-devel libX11-devel python3 librsvg2-tools\ngit clone https://github.com/LotusInputMethod/fcitx5-lotus.git\ncd fcitx5-lotus\ngit submodule update --init --recursive\ncmake -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_INSTALL_LIBDIR=/usr/lib64 .\nmake\nsudo make install',
      },
      openSUSE: {
        'Package Manager':
          'sudo rpm --import https://fcitx5-lotus.pages.dev/pubkey.gpg\nsudo zypper addrepo https://fcitx5-lotus.pages.dev/rpm/opensuse/fcitx5-lotus-tumbleweed.repo\nsudo zypper refresh\nsudo zypper install fcitx5-lotus',
        Binary: 'sudo rpm -i fcitx5-lotus-*.rpm',
        Source:
          'sudo zypper install cmake kf6-extra-cmake-modules fcitx5-devel libinput-devel systemd-devel gcc-c++ go hicolor-icon-theme systemd-devel libX11-devel python3-pyside6 python3-QtPy python3-dbus-python acl rsvg-convert\ngit clone https://github.com/LotusInputMethod/fcitx5-lotus.git\ncd fcitx5-lotus\ngit submodule update --init --recursive\ncmake -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_INSTALL_LIBDIR=/usr/lib64 .\nmake\nsudo make install',
      },
      NixOS: {
        'Package Manager': [
          {
            type: 'text',
            content: 'Fcitx5-lotus 3.4.0 đã có trên nixpkgs-unstable.',
          },
          {
            type: 'text',
            content:
              'Lưu ý: cần dùng nixpkgs-unstable (gói chưa có ở nhánh stable).',
          },
          {
            type: 'text',
            content:
              'Cách 1 — configuration.nix: thêm engine vào fcitx5(NixOS sẽ tự set các biến môi trường cần thiết):',
          },
          {
            type: 'code',
            content:
              '{\n  pkgs,\n  ...\n}: {\n  i18n.inputMethod = {\n    enable = true;\n    type = "fcitx5";\n    fcitx5.addons = [ pkgs.fcitx5-lotus ];\n  };\n}',
          },
          { type: 'text', content: 'Cách 2 — Home Manager (home.nix):' },
          {
            type: 'code',
            content:
              '{\n  pkgs,\n  ...\n}: {\n  home.packages = [ pkgs.fcitx5-lotus ];\n}',
          },
          {
            type: 'text',
            content: 'Cách 3 — thử nghiệm nhanh, không khai báo:',
          },
          {
            type: 'code',
            content:
              'nix profile install nixpkgs#fcitx5-lotus\nnix shell nixpkgs#fcitx5-lotus',
          },
        ],
        Binary:
          'NixOS ưu tiên cấu hình thông qua nixpkgs hoặc build from source',
        Source: [
          {
            type: 'text',
            content: 'Thêm input của fcitx5-lotus vào flake.nix:',
          },
          {
            type: 'code',
            content:
              '{\n  inputs = {\n    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";\n\n    fcitx5-lotus = {\n      url = "github:LotusInputMethod/fcitx5-lotus";\n      inputs.nixpkgs.follows = "nixpkgs";\n    };\n  };\n\n  outputs = { self, ... }:\n  # ...\n}',
          },
          {
            type: 'text',
            content: 'Bật fcitx5-lotus service trong configuration.nix:',
          },
          {
            type: 'code',
            content:
              '{\n  inputs,\n  ...\n}: {\n  imports = [\n    inputs.fcitx5-lotus.nixosModules.fcitx5-lotus\n  ];\n\n  services.fcitx5-lotus = {\n    enable = true;\n    users = [ "your_username" ]; # Sửa thành list tên user của bạn\n  };\n}',
          },
          { type: 'text', content: 'Rebuild lại system để cài đặt.' },
        ],
      },
      'Void Linux': {
        'Package Manager':
          'Void Linux sử dụng xbps. Hiện chưa có gói chính thức, vui lòng build from source.',
        Binary:
          'Void Linux sử dụng xbps. Hiện chưa có gói chính thức, vui lòng build from source.',
        Source:
          'sudo xbps-install -S fcitx5 fcitx5-configtool fcitx5-gtk fcitx5-qt acl acl-progs cmake extra-cmake-modules libfcitx5-devel libinput-devel eudev-libudev-devel gcc go gettext-devel pkg-config hicolor-icon-theme libX11-devel python3-QtPy python3-PyQt5 python3-pyqt6 python3-pyqt6-gui python3-pyqt6-widgets librsvg\n\ngit clone https://github.com/LotusInputMethod/fcitx5-lotus.git\ncd fcitx5-lotus\ngit submodule update --init --recursive\nmkdir build && cd build\ncmake -DCMAKE_INSTALL_PREFIX=/usr -DCMAKE_INSTALL_LIBDIR=/usr/lib -DINSTALL_RUNIT=ON -DRUNIT_SV_DIR=/etc/sv ..\nmake\nsudo make install',
      },
    },
    autostart: {
      GNOME: 'GNOME Tweaks → Startup Applications → Add → Fcitx 5',
      'KDE Plasma':
        'System Settings → Autostart → Add... → Add Application... → Fcitx 5',
      Xfce: 'Settings → Session and Startup → Application Autostart → Add → Fcitx 5',
      Cinnamon:
        'System Settings → Startup Applications → + → Choose application → Fcitx 5',
      MATE: 'Control Center → Startup Applications → Add (Name: Fcitx 5, Command: fcitx5)',
      Pantheon:
        'System Settings → Applications → Startup → Add Startup App... → Fcitx 5',
      Budgie:
        'Budgie Desktop Settings → Autostart → + → Add application → Fcitx 5',
      LXQt: 'LXQt Configuration Center → Session Settings → Autostart → LXQt Autostart → Add (Name: Fcitx 5, Command: fcitx5)',
      COSMIC:
        'COSMIC Settings → Applications → Startup Applications → Add app → Fcitx 5',
      i3: 'Thêm `exec --no-startup-id fcitx5 -d` vào ~/.config/i3/config',
      Sway: 'Thêm `exec --no-startup-id fcitx5 -d` vào ~/.config/sway/config',
      Hyprland:
        'Thêm `hl.exec_cmd("fcitx5 -d")` vào ~/.config/hypr/hyprland.lua',
      Niri: 'Thêm `spawn-sh-at-startup "fcitx5 -d"` vào ~/.config/niri/config.kdl',
    },
    wayland_extras: {
      General: {
        title: 'Khuyến nghị Xwayland',
        description:
          'Ngay cả khi bạn chỉ dùng ứng dụng Wayland native, bật Xwayland vẫn được khuyến nghị. Nếu bảng gõ client-side không hoạt động, Fcitx sẽ chuyển sang cửa sổ X11 để đảm bảo vị trí hiển thị chính xác thay vì một cửa sổ Wayland ngẫu nhiên.',
      },
      'KDE Plasma': {
        best_setup: [
          'Vào <b>System Settings</b> → <b>Keyboard</b> → <b>Virtual Keyboard</b> → Chọn <b>Fcitx 5</b>.',
        ],
      },
      Sway: {
        support_info:
          'Hỗ trợ text-input-v3 và zwp_input_method_v2 (từ bản 1.10+).',
        caveats:
          'Qt < 6.8.2 cần `QT_IM_MODULE=fcitx` do Sway chưa hỗ trợ text-input-v2. Lưu ý: Yêu cầu Sway 1.10 trở lên.',
      },
      Weston: {
        best_setup: [
          'Đặt `GTK_IM_MODULE=fcitx` và `QT_IM_MODULE=fcitx`.',
          'Cấu hình `~/.config/weston.ini`:',
          '[core]\nxwayland=true\n\n[input-method]\npath=/usr/bin/fcitx5',
        ],
        support_info: 'Sử dụng text-input-v1 và zwp_input_method_v1.',
        caveats:
          'Do thiếu text-input-v3, IM module là giải pháp duy nhất cho Gtk/Qt.',
      },
      Niri: {
        best_setup: [
          'Nên cài đặt xwayland-satellite. Mặc định niri sẽ tự khởi động mà không cần spawn-at-startup.',
        ],
        caveats:
          'niri không hỗ trợ Xorg trực tiếp. Hãy cài chung với xwayland-satellite',
      },
    },
  },
};

export const userCreationCmd =
  'sudo groupadd -f input\nsudo useradd -M -g input -s /usr/bin/nologin -d / uinput_proxy';

export const udevReloadCmd =
  'sudo udevadm control --reload-rules\nsudo udevadm trigger';

export const uinputModprobeCmd = 'sudo modprobe uinput';

export const fcitx5Config = {
  steps: [
    'Mở <b>Fcitx5 Configuration</b> (tìm trong menu hoặc chạy <code>fcitx5-configtool</code>).',
    'Tìm <b>Lotus</b> ở cột bên phải.',
    'Nhấn mũi tên <b>&lt;</b> để thêm nó sang cột bên trái.',
    'Bấm <b>Apply</b> để lưu thay đổi.',
  ],
};

export const kanataConfig = {
  title: 'Cấu hình Kanata',
  desc: 'Nếu dùng Kanata, hãy loại bỏ Uinput Server khỏi danh sách quét:',
  code: '(defcfg\n  ...\n  linux-dev-names-exclude ("Lotus-Uinput-Server")\n  ...\n)',
};
