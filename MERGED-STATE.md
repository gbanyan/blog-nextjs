# 合併狀態 / 版本記錄（供除錯用）

此文件記錄 4 個 worktree feature 分支合併進 `main` 的前後版本狀態，
方便以「合併前 base」為基準比對、定位顯示問題、或回滾。

## 1. 目前 `main` 狀態

- `main` HEAD（合併後）：`8a5c8e3`（完整：`8a5c8e3b0b...`）— 4 分支合併 + 型別/build 修正
- 合併前 base（顯示問題的比對基準）：`5a18839`（完整：`5a18839f9f8e...`）

### `main` 完整歷史（由新到舊）
```
8a5c8e3  chore: update content submodule gitlink to merged content HEAD
4c00fbc  fix: merged sidebar-layout 'use client', remove unused server imports, local TagItem type; next build passes
3db844e  fix: type integration (sidebar-data import path, TagItem type imports, contentlayer types regen)
[fix/nx  merge] 202d20b  PPR/cacheComponents, use-cache async pages, streaming Mastodon sidebar, RSS hourly revalidation
[fix/arch merge] 6d599e4  single-pass markdown image handling, declarative frontmatter, shared MobileDrawer/useDrawer
[fix/ux  merge] e76da7f   concise zh-TW microcopy + a11y aria-labels
[fix/perf merge] 6d599e4  bundle debloat, LCP hero, conditional mermaid, local OG fonts/caching
5a18839  (base, 合併前)
```

## 2. 4 個 feature 分支

| 分支 | tip commit | 內容 | 合併進 main? |
|------|-----------|------|-------------|
| `fix/perf` | `c0a386c` | 效能/UX：bundle 瘦身、LCP hero、mermaid 條件載入、OG 字型本地化+快取 | ✅ |
| `fix/ux` | `04366e5` | 繁體中文微文案 + a11y aria-label 中文化 | ✅ |
| `fix/arch` | `88fb9b9` | 單次圖片處理、declarative frontmatter、共用 MobileDrawer | ✅ |
| `fix/nx` | `3e1b15b` | PPR/cacheComponents、use-cache async 頁面、streaming Mastodon、RSS revalidation | ✅ |

- 分支仍在本地與 `origin`（合併成果沒丟，可重來）。
- herdr workspaces 已清理；主 workspace `w88` 保留。

## 3. Remotes（已推送狀態）

- `origin`（ssh://git.gbanyan.net...）：`main` → `8a5c8e3`
- `github`（git@github.com...）：`main` → `8a5c8e3`
- 4 個 feature 分支已推送至 `origin`。

## 4. 合併後整合修正（若顯示問題出在這些改動）

合併後 `tsc` + `next build` 修復的問題：
- `lib/sidebar-data.ts` import 路徑（`@/lib/posts` → `@/lib/tags`）
- `.contentlayer/generated` 型別重新產生
- `TagItem` 型別本地形別定義
- `right-sidebar` 移除未使用 server import
- `sidebar-layout` 補 `'use client'` 指令

## 5. Build 驗證

`npm run build`（sync-assets + contentlayer + next build + pagefind）通過，`next build` 82/82 static pages。

## 6. 回滾方式

### 方式 A：完整回滾到合併前 `5a18839`
```bash
git reset --hard 5a18839
git push --force origin main
git push --force github main
```

### 方式 B：revert 合併 commit（保留歷史）
```bash
git revert -m 1 6d599e4   # fix/perf 或 fix/arch 的 merge（依實際 hash）
git revert -m 1 e76da7f   # fix/ux merge
git revert -m 1 202d20b   # fix/nx merge
git push origin main
git push github main
```

### 方式 C：局部回退（只還原特定檔案到 base）
```bash
git checkout 5a18839 -- <檔案>
git commit -m "revert <檔案> to pre-merge base"
git push origin main
git push github main
```

## 7. 除錯提示

顯示問題最可能出在：
- `components/sidebar-layout.tsx` / `right-sidebar.tsx`（共用 MobileDrawer + sidebar-data props 整合）
- `app/page.tsx` / `app/blog/page.tsx` / `app/projects/page.tsx`（async + use-cache + PPR）
- `components/mastodon-feed.tsx`（streaming，fix/nx）
- `content` submodule gitlink（已更新至 7b52c564）

比對方式：
```bash
git diff 5a18839..HEAD -- <檔案>
```
