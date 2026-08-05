# Fcitx5 Lotus — Trang chủ

Trang web giới thiệu và hướng dẫn cài đặt cho [Fcitx5 Lotus](https://github.com/LotusInputMethod/fcitx5-lotus) — bộ gõ tiếng Việt hiện đại, hiệu năng cao cho Linux.

Trang chủ trực tiếp tại: https://lotusinputmethod.github.io/

## Tính năng trang web

- Hero động với terminal mockup + thống kê GitHub (stars, contributors, phiên bản).
- Installer tương tác: chọn distro/DE/shell/init → hướng dẫn cài đặt tương ứng.
- Hướng dẫn sử dụng (tabs): cài đặt nhanh, cài đặt nâng cao, chế độ gõ, mẹo hay.
- Hướng dẫn gỡ cài đặt theo từng distro.
- Danh sách contributor tải từ GitHub (cache 2 giờ).

## Tech stack

Vue 3 · Vite · TypeScript · Element Plus · oh-vue-icons · Bun · GitHub Pages

## Phát triển

Yêu cầu: Node ≥ 20.19 (hoặc Bun).

```sh
bun install          # cài phụ thuộc
bun dev              # chạy dev server
bun run lint         # kiểm tra eslint
bun run type-check   # kiểm tra TypeScript
bun run build        # build production
bun run preview      # xem bản build
```

## Triển khai

Push lên nhánh `main` → GitHub Actions (`deploy.yml`) tự build và deploy lên GitHub Pages.

## Đóng góp

Mọi đóng góp đều được hoan nghênh — xem [CONTRIBUTING](https://github.com/LotusInputMethod/fcitx5-lotus/blob/main/CONTRIBUTING.md) của dự án chính.

## Giấy phép

GNU General Public License v3.0 — xem [LICENSE](LICENSE).
