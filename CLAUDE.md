# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Generate Velite data, then run the Velite watcher + Next.js with Turbopack concurrently
- `npm run build` - Full production build: sync-assets → Velite generation → next build → Pagefind indexing → copy Pagefind to public
- `npm run lint` - ESLint via `eslint .` (flat config)
- `npm test` - Unit tests for lib contracts via Vitest
- `npm run check-i18n` / `npm run check-i18n-content` - Validate locale pairing of generated Velite records (also run during build)
- `npm run sync-assets` - Copy `content/assets/` to `public/assets/` (also runs automatically before build)

## Architecture

**Content pipeline**: `content/` git submodule (Markdown) → Velite (`velite.config.ts`) → ignored typed data in `.velite/` → server-side adapter in `lib/content.ts` → pages and `lib/posts.ts` helpers.

**Routing** (App Router, bilingual with `zh-TW` as the unprefixed default):
- `proxy.ts` rewrites unprefixed paths (`/`, `/blog/*`, `/pages/*`, `/projects`, `/tags/*`) to the `zh-TW` locale segment and sets `x-locale`; `/en/*` passes through. All pages live under `app/[locale]/` with `generateStaticParams` covering both locales.
- `/` — Home page with latest posts (`/en` for the English section)
- `/blog` — Blog index with search, sort, pagination
- `/blog/[slug]` — Single post with TOC, reading progress, prev/next, related posts
- `/pages/[slug]` — Static content pages (from `content/pages/`)
- `/tags`, `/tags/[tag]` — Tag index and per-tag post lists
- `/projects` — GitHub repo cards (server fetch, cached 1h)
- `/api/og` — Dynamic OG image generation (`@vercel/og`, CJK fonts)
- `/api/mastodon` — Mastodon status feed proxy (cached 60s)
- Machine-readable: `/feed.xml`, `/llms.txt`, `/[locale]/feed.xml`, `/[locale]/llms.txt`, `/[locale]/sitemap.xml`, `/robots.txt`, `/sitemap.xml`, `/ai.txt`

**Key data flow**:
- `lib/config.ts` — `siteConfig` object built from `NEXT_PUBLIC_*` env vars (all site metadata, social links, accent colors, pagination)
- `lib/content.ts` — Server-side boundary for Velite's generated `Post`/`Page` records
- `lib/posts.ts` — Query helpers: `getAllPostsSorted()`, `getPostBySlug()`, `getPageBySlug()`, `getRelatedPosts()`, `getPostNeighbors()` (Async `"use cache"`-backed, PPR-compatible)
- `lib/tags.ts` — Synchronous tag helpers (`getTagSlug()`, `getAllTagsWithCount()`); kept split from the `"use cache"` module so the client sidebar stays bundle-lean
- `lib/seo.ts` — `metadataForDocument()` / `metadataForPath()`, hreflang/x-default pairing, sitemap entry helpers
- `lib/og.ts`, `lib/reading-time.ts` — Shared social-image/OG-card URLs; CJK-aware word count and reading-time estimate
- `lib/mastodon.ts` — Mastodon API client for sidebar feed widget
- `lib/rehype-callouts.ts` — Custom rehype plugin for GitHub-style `[!NOTE]` callout blocks

**Layout hierarchy**: `app/[locale]/layout.tsx` (fonts, theme CSS vars, ThemeProvider, JSON-LD) → `components/layout-shell.tsx` (header, sidebar, footer, back-to-top) → page content. UI strings come from `lib/i18n/dictionaries.ts`; path/alternate helpers from `lib/locales.ts`.

**Markdown processing** (configured in `velite.config.ts`):
- Remark: GFM, plus a raw-HTML remover (`remarkRemoveRawHtml` — raw HTML blocks are dropped by contract)
- Rehype: callouts → pretty-code (shiki, dual theme) → slug → autolink-headings → image optimizer → link localizer
  - `lib/rehype-optimize-images.ts` rewrites `../assets/` → `/assets/` and attaches intrinsic width/height + `loading=lazy` + `sizes`
  - `lib/rehype-localize-links.ts` prefixes `/en` to internal routes in English-source documents
- Built HTML is rendered verbatim by `components/markdown-body.tsx` (no runtime re-parse)

## Styling

- Tailwind CSS v4 with CSS-first configuration (no `tailwind.config.cjs`)
- Dark mode via `@custom-variant dark` in `styles/globals.css` (class-based, toggled by `next-themes`)
- Theme customization via `@theme` block in `styles/globals.css`: colors, fonts, easing, durations, shadows, keyframes, animations
- Accent color system via CSS variables set in `app/[locale]/layout.tsx` from env vars: `--color-accent`, `--color-accent-soft`, `--color-accent-text-light`, `--color-accent-text-dark`
- Typography plugin (`@tailwindcss/typography`) loaded via `@plugin` directive; prose dark mode handled by custom `.dark .prose` CSS overrides
- English headings use Playfair Display serif (`--font-serif-eng`); body uses Inter + CJK fallback stack
- PostCSS config: `postcss.config.mjs` using `@tailwindcss/postcss`

## Content Submodule

The `content/` directory is a git submodule pointing to a separate `personal-blog` repository. It contains `posts/`, `pages/`, and `assets/`. After pulling new content, run `npm run sync-assets` to update `public/assets/`. The build script does this automatically.

## Path Aliases

`@/*` maps to project root (configured in `tsconfig.json`). Velite's generated data lives in ignored `.velite/`; application code imports it through `lib/content.ts`.

## Deployment

GitHub (`github` remote, `git@github.com:gbanyan/blog-nextjs.git`) is the deployment source. Pushing to `main` on GitHub triggers the deployment pipeline. A self-hosted Gitea instance (`git.gbanyan.net` / `gitea.gbanyan.net`) mirrors the repository as a backup; it does not trigger deployments.

**Content-only update** (new/edited posts) — both steps are required to trigger deploy:
1. Commit and push inside `content/` submodule: `git -C content add . && git -C content commit -m "..." && git -C content push`
2. Update main repo submodule pointer and push to GitHub: `git add content && git commit -m "Update content submodule" && git push github main`

Pushing only to `content/` (personal-blog) does NOT trigger deployment. The main repo must also be pushed to GitHub because the deployment pipeline is bound to `blog-nextjs`, not `personal-blog`.

**Code changes**: Commit and push in the main repo as usual — `git push` to `main` (which goes to the GitHub deployment source) triggers the pipeline.

## Language

The site's default locale is `zh-TW`. UI text, labels, and timestamps are in Traditional Chinese.

## Design Context

### Users

- **Medical professionals & students**: Seek clinical insights, case studies, and medical education content
- **General public**: Interested inpersonal reflections, medicine explainedaccessibly, and lifestyle content
- **Tech enthusiasts & developers**: Drawn to HomeLab, technical tutorials, and developer environment content
- **Patients & advocates**: Those with similar conditions (Usher syndrome, hearing/vision impairments) seeking understanding and community

**Context**: Readers visit for deep, reflective content—often in quiet environments, seeking to learn, reflect, or connect with personal experiences. They value clarity, authenticity, and quality over speed.

**Job to be done**: Gain meaningful knowledge, find resonance with personal experiences, understand complex topics (medical/technical) in approachable terms.

### Brand Personality

- **Voice**: Reflective, professional, and thoughtful—like a trusted physician who also happens to be a developer
- **3-word personality**: Professional & refined, Thoughtful & reflective, Technical & practical, Approachable & human
- **Emotional goals**: Calm & contemplative, Inspired & curious

**Not**: Corporate, salesy, alarmist (like news sites), or overly technical/clinical.

### Aesthetic Direction

**Visual tone**: Warm & organic with academic & scholarly sensibility, combined with modern technical clarity

**References**:
- Medium (medium.com): Readability-focused, minimal distractions, clean typography
- Personal tech blogs: Individual personality, character, and hands-on authenticity
- Library aesthetic: Quiet, thoughtful, knowledge-rich environment

**Anti-references** (explicitly avoid):
- News sites: Cluttered, headline-focused, clickbait design
- Social media feeds: Infinite scroll, attention-grabbing tactics, dopamine-driven design
- Corporate/SaaS: Too polished, salesy, or uniform corporate branding
- Dry technical docs: Lacking personality, purely functional

**Theme**: Both light and dark modes equally important—light for daytime readability, dark for late-night focused reading. Accent colors should be warm (avoid reds/yellows which feel urgent/alerting).

### Design Principles

1. **Calm-first design**: Space, breathing room, and typography hierarchy should prioritize relaxed reading over visual stimulation. Avoid jarring transitions or animation that distracts from content.

2. **Warm technicality**: Blend technical precision with human warmth—clean, efficient interfaces that don't feel cold or sterile. The HomeLab/developer content should feel hands-on, not just theoretical.

3. **Academic elegance**: Typography and layout should honor the scholarly nature of medical writing and technical explanations—clear hierarchy, proper spacing, and readability first.

4. **Inclusive accessibility**: Consider hearing/vision impairments (user has Usher syndrome): high contrast, readable text, motion sensitivity support, clear navigation, and no time-based content hiding.

5. **Consistent rhythm**: Maintain consistent spacing, sizing, and interaction patterns across pages to create a predictable, trustworthy experience. Subtle interactions > flashy animations.

## Known limitations

- **Soft-404 for unknown dynamic slugs** (`/blog/<unknown>`, `/pages/<unknown>`, `/tags/<unknown>`): with `cacheComponents` (PPR) on the bundled Next 16, an on-demand miss renders the streaming shell and answers HTTP 200. `dynamicParams = false` and removing the `loading.tsx` shells are both rejected by the PPR build (verified 2026-08), so this is intrinsic to this Next version — re-check after a Next upgrade (Dependabot surfaces it).

