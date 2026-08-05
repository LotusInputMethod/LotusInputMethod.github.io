# AGENTS.md

Trang landing của Fcitx5 Lotus — bộ gõ tiếng Việt cho Linux. SPA Vue 3 + Vite + TypeScript, UI tiếng Việt, theme Catppuccin, deploy lên GitHub Pages qua GitHub Actions.

## Tech stack

- Vue 3 (Composition API, `<script setup lang="ts">`)
- Vite 7, TypeScript, vue-router 4
- Element Plus (auto-import), oh-vue-icons (`<v-icon>`), Bun

## Lệnh

- Cài đặt: `bun install`
- Dev: `bun dev`
- Lint: `bun run lint` / `bun run lint:fix`
- Type-check: `bun run type-check`
- Build: `bun run build` / Preview: `bun run preview`

Quan trọng: khi chỉ kiểm tra code, chạy `bun run lint` + `bun run type-check` là đủ — **KHÔNG build**. CI (`ci.yml`) chạy cả 3 khi push.

## Cấu trúc

- `src/views/Home.vue` — layout, chỉ render các section + `initTheme()`.
- `src/components/` — 8 section (NavBar, HeroSection, FeaturesSection, InstallSection, UsageSection, UninstallSection, ContributorsSection, FooterSection) + reusable (FeatureCard, UsageTable, CodeBlock, UninstallItem, InteractiveInstaller).
- `src/utils/` — `theme.ts` (useTheme), `github.ts` (useGitHubStats, cache localStorage 2h), `actions.ts` (openLink, copyToClipboard, scroll...).
- `src/data/` — `installer.ts`, `usage.ts` (dữ liệu hiển thị).
- `src/assets/shared.css` — reset, theme vars, class dùng chung (non-scoped, import ở main.ts).

## Quy ước

- Mọi text UI bằng tiếng Việt; import alias `@/`; icon qua `el-icon` hoặc `<v-icon name="...">`.
- State dùng chung giữa section → composable singleton (useTheme/useGitHubStats); không props/emit giữa section.
- CSS: riêng 1 section → `<style scoped>`; class dùng chung hoặc render bởi component con → `shared.css` (scoped của cha không áp dụng vào con). Override Element Plus dùng `:root .el-*` cho đủ specificity. Không tự thêm CSS mới cho class không có rule (`.flex`, `.mb-0`...).
- Không sửa tay `components.d.ts` / `auto-imports.d.ts` (generated).
- Project không có test suite; không thêm test nếu không được yêu cầu.

## Git

- Commit theo Conventional Commits: `feat(...)`, `fix(...)`, `refactor(...)`.
- Chạy `bun run lint` + `bun run type-check` trước khi commit; chỉ commit khi được yêu cầu.

## Không được làm

- KHÔNG build khi chỉ kiểm tra code.
- KHÔNG đổi logic/hành vi khi refactor (giao diện phải y hệt).
- KHÔNG sửa text hiển thị trừ khi được yêu cầu.
- KHÔNG thêm dependency mới mà chưa hỏi.
- KHÔNG commit secrets.
