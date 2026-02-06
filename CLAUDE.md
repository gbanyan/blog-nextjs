# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start dev server (runs Contentlayer2 + Next.js with Turbopack concurrently)
- `npm run build` - Full production build: sync-assets → contentlayer2 build → next build → pagefind indexing → copy pagefind to public
- `npm run lint` - ESLint via `next lint`
- `npm run sync-assets` - Copy `content/assets/` to `public/assets/` (also runs automatically before build)

No test framework is configured.

## Architecture

**Content pipeline**: `content/` git submodule (MDX/Markdown) → Contentlayer2 (`contentlayer.config.ts`) → typed `Post`/`Page` objects imported from `contentlayer2/generated` → consumed by pages and `lib/posts.ts` helpers.

**Routing** (App Router):
- `/` — Home page with latest posts
- `/blog` — Blog index with search, sort, pagination
- `/blog/[slug]` — Single post with TOC, reading progress, prev/next navigation
- `/pages/[slug]` — Static content pages (from `content/pages/`)
- `/tags`, `/tags/[tag]` — Tag index and per-tag post lists
- `/api/og` — Dynamic OG image generation (`@vercel/og`)
- `/feed.xml` — RSS feed (route handler)

**Key data flow**:
- `lib/config.ts` — `siteConfig` object built from `NEXT_PUBLIC_*` env vars (all site metadata, social links, accent colors, pagination)
- `lib/posts.ts` — Query helpers: `getAllPostsSorted()`, `getPostBySlug()`, `getPageBySlug()`, `getAllTagsWithCount()`, `getRelatedPosts()`, `getPostNeighbors()`
- `lib/mastodon.ts` — Mastodon API client for sidebar feed widget
- `lib/rehype-callouts.ts` — Custom rehype plugin for GitHub-style `[!NOTE]` callout blocks

**Layout hierarchy**: `app/layout.tsx` (fonts, theme CSS vars, ThemeProvider, JSON-LD) → `components/layout-shell.tsx` (header, sidebar, footer, back-to-top) → page content.

**Markdown processing** (configured in `contentlayer.config.ts`):
- Remark: GFM
- Rehype: callouts → pretty-code (shiki, dual theme) → slug → autolink-headings → image path rewriter (`../assets/` → `/assets/`)
- Image paths in markdown are relative (`../assets/foo.jpg`); a rehype plugin rewrites them to `/assets/foo.jpg` at build time

## Styling

- Tailwind CSS v4 with CSS-first configuration (no `tailwind.config.cjs`)
- Dark mode via `@custom-variant dark` in `styles/globals.css` (class-based, toggled by `next-themes`)
- Theme customization via `@theme` block in `styles/globals.css`: colors, fonts, easing, durations, shadows, keyframes, animations
- Accent color system via CSS variables set in `app/layout.tsx` from env vars: `--color-accent`, `--color-accent-soft`, `--color-accent-text-light`, `--color-accent-text-dark`
- Typography plugin (`@tailwindcss/typography`) loaded via `@plugin` directive; prose dark mode handled by custom `.dark .prose` CSS overrides
- English headings use Playfair Display serif (`--font-serif-eng`); body uses Inter + CJK fallback stack
- PostCSS config: `postcss.config.mjs` using `@tailwindcss/postcss`

## Content Submodule

The `content/` directory is a git submodule pointing to a separate `personal-blog` repository. It contains `posts/`, `pages/`, and `assets/`. After pulling new content, run `npm run sync-assets` to update `public/assets/`. The build script does this automatically.

## Path Aliases

`@/*` maps to project root (configured in `tsconfig.json`). Contentlayer generated types at `.contentlayer/generated` are aliased as `contentlayer2/generated`.

## Deployment

Two Git remotes are involved: `git.gbanyan.net` (SSH, primary push target) and `gitea.gbanyan.net` (HTTPS, Gitea web UI). A crontab on the server automatically mirrors `git.gbanyan.net` → `gitea.gbanyan.net`. Push to `main` on `git.gbanyan.net` triggers CI/CD automatically (server-side hook). No Dockerfile or workflow file in this repo.

**Content-only update** (new/edited posts) — both steps are required to trigger deploy:
1. Commit and push inside `content/` submodule: `git -C content add . && git -C content commit -m "..." && git -C content push`
2. Update main repo submodule pointer and push: `git add content && git commit -m "Update content submodule" && git push`

Pushing only to `content/` (personal-blog) does NOT trigger deployment. The main repo must also be pushed because CI/CD is bound to `blog-nextjs`, not `personal-blog`.

**Code changes**: Commit and push in the main repo as usual — `git push` to `main` triggers the pipeline.

## Language

The site's default locale is `zh-TW`. UI text, labels, and timestamps are in Traditional Chinese.
