<template>
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
        <a href="https://github.com/LotusInputMethod/fcitx5-lotus" class="flex items-center gap-2">
          <v-icon name="si-github" /> GitHub
        </a>
        <a href="https://github.com/LotusInputMethod/fcitx5-lotus/releases">Releases</a>
        <a href="https://github.com/LotusInputMethod/fcitx5-lotus/issues/new?template=bug_report.yml">Báo lỗi
          (Issues)</a>
      </div>
      <div class="footer-links">
        <h4>Tài liệu</h4>
        <a href="#installation">Cài đặt & Thiết lập</a>
        <a href="#usage">Hướng dẫn</a>
        <a href="#uninstall">Gỡ cài đặt</a>
        <a href="https://github.com/LotusInputMethod/fcitx5-lotus/blob/main/CONTRIBUTING.md">Đóng góp</a>
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
        <a href="https://github.com/LotusInputMethod/LotusInputMethod.github.io" target="_blank" class="text-link">xem
          mã nguồn tại đây</a>.
      </div>
    </div>
  </footer>
</template>

<style scoped>
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
</style>
