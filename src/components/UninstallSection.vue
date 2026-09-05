<script setup lang="ts">
import UninstallItem from './UninstallItem.vue';
import CodeBlock from './CodeBlock.vue';

const archCleanup = 'sudo pacman -Rns fcitx5-lotus';
const archParu = 'paru -Rns fcitx5-lotus';
const archYay = 'yay -Rns fcitx5-lotus';

const aptRemove =
  'sudo apt remove fcitx5-lotus\nsudo rm /etc/apt/sources.list.d/fcitx5-lotus.list\nsudo rm /etc/apt/keyrings/fcitx5-lotus.gpg\nsudo apt update';

const dnfRemove =
  'sudo dnf remove fcitx5-lotus\nsudo rm /etc/yum.repos.d/fcitx5-lotus-*.repo';

const zypperRemove =
  'sudo zypper remove fcitx5-lotus\nsudo zypper removerepo fcitx5-lotus';

const voidXbpsRemove =
  'sudo xbps-remove -R fcitx5-lotus fcitx5-lotus-settings';

const voidSvCleanup =
  'sudo rm -f /var/service/fcitx5-lotus.*\nsudo rm -rf /etc/sv/fcitx5-lotus.*';

const releasesDebian = '# Debian / Ubuntu\nsudo apt remove fcitx5-lotus';
const releasesFedora = '# Fedora\nsudo dnf remove fcitx5-lotus';
const releasesOpenSUSE = '# openSUSE\nsudo zypper remove fcitx5-lotus';

const cleanupCode =
  'rm -rf ~/.local/share/fcitx5/lotus\nrm -rf ~/.config/fcitx5/conf/lotus.conf';
</script>

<template>
  <section id="uninstall" class="section section-bg-mantle">
    <div class="container">
      <details class="uninstall-master-details">
        <summary class="uninstall-master-summary">
          <div class="section-title mb-0 text-center">
            <h2 class="mb-0">Gỡ cài đặt</h2>
          </div>
        </summary>

        <div class="uninstall-expanded-content mt-6">
          <div class="section-title text-left mb-6">
            <p>
              Rất tiếc khi thấy bạn phải gỡ cài đặt Lotus. Nếu bạn gặp vấn đề
              gì, hãy mở
              <a href="https://github.com/LotusInputMethod/fcitx5-lotus/issues/new" target="_blank"
                class="text-link">issue trên GitHub</a>
              để team có thể hỗ trợ bạn sớm nhất nhé!
            </p>
          </div>

          <div class="custom-card uninstall-card">
            <UninstallItem icon="si-archlinux" name="Arch Linux">
              <p class="instruction mb-3">
                Bạn có thể dùng <code>pacman</code> (khuyên dùng),
                <code>yay</code> hoặc <code>paru</code> để gỡ cài đặt (nhớ gỡ
                đúng gói bạn đã cài):
              </p>
              <CodeBlock :code="archCleanup" size="small" />
              <CodeBlock :code="archParu" size="small" />
              <CodeBlock :code="archYay" size="small" />
              <el-alert title="Lưu ý" type="info" description="Các file config ở $HOME sẽ được giữ lại."
                :closable="false" class="custom-alert-info mt-2" />
            </UninstallItem>

            <UninstallItem icon="si-debian" name="Debian">
              <CodeBlock :code="aptRemove" />
            </UninstallItem>

            <UninstallItem icon="si-ubuntu" name="Ubuntu">
              <CodeBlock :code="aptRemove" />
            </UninstallItem>

            <UninstallItem icon="si-fedora" name="Fedora">
              <CodeBlock :code="dnfRemove" />
            </UninstallItem>

            <UninstallItem icon="si-opensuse" name="openSUSE">
              <CodeBlock :code="zypperRemove" />
            </UninstallItem>

            <UninstallItem icon="co-linux" name="Void Linux">
              <p class="instruction mb-2">Gỡ gói qua xbps:</p>
              <CodeBlock :code="voidXbpsRemove" />
              <p class="instruction mb-2 mt-3">
                Dịch vụ runit đã kích hoạt nằm ngoài gói (bản sao trong
                <code>/etc/sv</code> + liên kết <code>/var/service</code>) nên
                xbps không tự xoá — tắt và dọn thủ công:
              </p>
              <CodeBlock :code="voidSvCleanup" />
            </UninstallItem>

            <UninstallItem icon="si-nixos" name="NixOS">
              <p class="instruction mb-2">Gỡ tùy theo cách bạn đã cài:</p>
              <p class="instruction mb-2">
                <b>Cách 1 — Cài từ nixpkgs (package manager):</b>
              </p>
              <ul class="uninstall-list">
                <li>
                  Xóa/comment dòng
                  <code class="inline-code">pkgs.fcitx5-lotus</code> trong
                  <code class="inline-code">home.packages</code> hoặc
                  <code class="inline-code">environment.systemPackages</code>
                  /
                  <code class="inline-code">i18n.inputMethod.fcitx5.addons</code>.
                </li>
                <li>
                  Chạy
                  <code class="inline-code">nixos-rebuild switch</code> (hoặc
                  <code class="inline-code">home-manager switch</code>).
                </li>
              </ul>
              <p class="instruction mb-2 mt-3">
                <b>Cách 2 — Build từ source qua flake repo:</b>
              </p>
              <ul class="uninstall-list">
                <li>
                  Xóa dòng
                  <code class="inline-code">services.fcitx5-lotus</code> và
                  <code class="inline-code">inputs</code> trong config.
                </li>
                <li>
                  Chạy <code class="inline-code">nixos-rebuild switch</code>.
                </li>
              </ul>
              <p class="instruction mt-3">NixOS sẽ tự dọn dẹp.</p>
            </UninstallItem>

            <UninstallItem icon="si-github" name="GitHub Releases">
              <p class="instruction mb-3">
                Gỡ cài đặt tùy theo distro bạn đang sử dụng:
              </p>
              <CodeBlock :code="releasesDebian" />
              <CodeBlock :code="releasesFedora" />
              <CodeBlock :code="releasesOpenSUSE" />
            </UninstallItem>

            <UninstallItem icon="si-linux" name="Source">
              <p class="instruction mb-3">
                Vào lại thư mục source code đã build và chạy:
              </p>
              <CodeBlock :code="'sudo make uninstall'" size="small" />
            </UninstallItem>
          </div>

          <div class="custom-card cleanup-card mt-6">
            <div class="usage-header mb-3">
              <h3>Dọn dẹp hệ thống</h3>
            </div>
            <p class="instruction mb-3">
              Nếu muốn xóa hoàn toàn dữ liệu gõ tắt và cấu hình:
            </p>
            <CodeBlock :code="cleanupCode" />
          </div>
        </div>
      </details>
    </div>
  </section>
</template>

<style scoped>
/* Uninstall Section */
.uninstall-master-details {
  list-style: none;
}

.uninstall-master-summary {
  display: flex;
  align-items: center;
  cursor: pointer;
  list-style: none;
  transition: all 0.3s ease;
}

.uninstall-master-summary::-webkit-details-marker {
  display: none;
}

.uninstall-master-summary .section-title {
  width: 100%;
}

.uninstall-master-summary .section-title h2 {
  position: relative;
  display: inline-block;
  padding-right: 35px;
  margin: 0 auto;
}

/* Custom arrow for master toggle */
.uninstall-master-summary .section-title h2::after {
  content: '→';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5rem;
  color: var(--ctp-subtext0);
  transition:
    transform 0.3s ease,
    color 0.3s ease;
}

.uninstall-master-details[open] .uninstall-master-summary .section-title h2::after {
  transform: translateY(-50%) rotate(90deg);
  color: var(--ctp-green);
}

.uninstall-card {
  max-width: 800px;
  margin: 0 auto;
}

.cleanup-card {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.usage-tips {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
</style>
