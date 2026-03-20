export const distros = [
  { name: "Ubuntu", icon: "si-ubuntu" },
  { name: "Debian", icon: "si-debian" },
  { name: "Fedora", icon: "si-fedora" },
  { name: "Arch Linux", icon: "si-archlinux" },
  { name: "openSUSE", icon: "si-opensuse" },
  { name: "NixOS", icon: "si-nixos" }
];

export const methods = ["Package Manager", "Binary", "Source"];
export const shells = ["Bash", "Zsh", "Fish"];
export const deWms = ["GNOME", "KDE Plasma", "Xfce", "Cinnamon", "MATE", "Pantheon", "Budgie", "LXQt", "COSMIC", "i3", "Sway", "Hyprland"];
export const environments = ["X11", "Wayland"];

export const logic = {
  "steps": {
    "install": {
      "Arch Linux": {
        "Package Manager": "yay -S fcitx5-lotus-bin",
        "Binary": "Arch khuyến khích sử dụng AUR để cài đặt",
        "Source": "yay -S fcitx5-lotus-git"
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
        "Binary": "NixOS ưu tiên cấu hình thông qua flake hoặc module.",
        "Source": "NixOS ưu tiên sử dụng nix-shell."
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
          "Vào <b>System Settings</b> → <b>Keyboard</b> → <b>Virtual Keyboard</b> → Chọn <b>Fcitx 5</b>."
        ]
      },
      "Sway": {
        "support_info": "Hỗ trợ text-input-v3 và zwp_input_method_v2 (từ bản 1.10+).",
        "caveats": "Qt < 6.8.2 cần `QT_IM_MODULE=fcitx` do Sway chưa hỗ trợ text-input-v2. Lưu ý: Yêu cầu Sway 1.10 trở lên."
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

export const fcitx5Config = {
  steps: [
    'Mở <b>Fcitx5 Configuration</b> (tìm trong menu hoặc chạy <code>fcitx5-configtool</code>).',
    'Tìm <b>Lotus</b> ở cột bên phải.',
    'Nhấn mũi tên <b>&lt;</b> để thêm nó sang cột bên trái.',
    'Bấm <b>Apply</b> để lưu thay đổi.'
  ]
};

export const kanataConfig = {
  title: "Cấu hình Kanata",
  desc: "Nếu dùng Kanata, hãy loại bỏ Uinput Server khỏi danh sách quét:",
  code: "(defcfg\n  ...\n  linux-dev-names-exclude (\"Lotus-Uinput-Server\")\n  ...\n)"
};
