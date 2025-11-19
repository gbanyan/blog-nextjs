# Personal Blog (Next.js + Contentlayer)

This is a personal blog built with **Next.js 13 (App Router)**, **Contentlayer**, and **Tailwind CSS**.
Markdown content (posts & pages) lives in a separate repository and is consumed via a git submodule.
Recent iterations focused on migrating every image to `next/image`, refreshing the typography scale for mixed Chinese/English copy, and layering an elegant scrolling timeline aesthetic onto the home + blog index.

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Typography plugin
- **Content**: Markdown via Contentlayer (`contentlayer/source-files`)
- **Theming**: `next-themes` (light/dark), env‑driven accent color system
- **Content source**: Git submodule `content` → [`personal-blog`](https://gitea.gbanyan.net/gbanyan/personal-blog.git)

## Project Structure

- `app/` – Next.js App Router
  - `app/page.tsx` – Home page (latest posts list)
  - `app/blog/page.tsx` – Blog index with sort + pagination
  - `app/blog/[slug]/page.tsx` – Single blog post (TOC + reading progress)
  - `app/pages/[slug]/page.tsx` – Static content pages (e.g. 關於作者)
  - `app/tags/page.tsx` – Tag index (all tags)
  - `app/tags/[tag]/page.tsx` – Tag overview (posts for a given tag)
- `components/`
  - `layout-shell.tsx` – Global layout (header, sidebar, footer, back‑to‑top)
  - `site-header.tsx` – Navbar (title + Blog + pages from contentlayer)
  - `right-sidebar.tsx` – Sticky sidebar (avatar, services icons, short about, hot tags)
  - `post-list-item.tsx` – Article list row with thumbnail, tags, excerpt
  - `post-list-with-controls.tsx` – List with sort + pagination controls
  - `post-toc.tsx` – Scroll‑synced table of contents
  - `reading-progress.tsx` – Top reading progress bar
  - `theme-toggle.tsx` – Sun/moon theme toggle
  - `hero.tsx` – (currently unused) hero section using accent colors
- `lib/`
  - `config.ts` – Site configuration derived from env (name, URLs, avatar, accent colors, etc.)
  - `posts.ts` – Helpers for querying posts/pages and tags from Contentlayer
- `content/` – **Git submodule** pointing to `personal-blog`
  - `posts/` – Blog posts (`.md`)
  - `pages/` – Static pages (`.md`)
  - `assets/` – Images referenced from markdown
- `public/assets` – Symlink to `content/assets` for serving images at `/assets/...`
- `contentlayer.config.ts` – Contentlayer document types and markdown pipeline

## UI Overview

- **Navbar**
  - Left: site title (from env).
  - Right: `Blog` + links for each `Page` from Contentlayer (`content/pages`), plus a theme toggle.
  - Links use the accent palette on hover/focus.

- **Home page** (`/`)
  - Centered hero heading: `SITE_NAME 的最新動態` + tagline.
  - Timeline-inspired "最新文章" rail: a slim gradient spine with evenly spaced ticks aligned to each article card plus a downward-pointing finial at the bottom.
  - Posts remain card-based (thumbnail + excerpt) but inherit the new responsive typography scale + weight strategy.

- **Blog index** (`/blog`)
  - Uses `PostListWithControls` with the same vertical timeline rail visually tying the list together.
    - Keyword search filters posts by title, tags, and excerpt with instant feedback.
    - Sort order: new→old or old→new.
    - Pagination using `siteConfig.postsPerPage`.

- **Single post / page** (`/blog/[slug]`, `/pages/[slug]`)
  - Wrapped in `PostLayout`, which pairs `ReadingProgress` with a motion-aware grid; `hasToc` only enables the sidebar when `h2`/`h3` headings exist and the floating glass pill toggle lets readers hide/show the TOC on large screens.
  - The sticky TOC (`components/post-toc.tsx`) layers a dot indicator beside the active heading, smooth-scrolls anchors, temporarily highlights the target section via `toc-target-highlight`, and drops list bullets for an academic rhythm.
  - Header keeps the date, title, and centered tag chips with refined spacing while feature images now flow edge-to-edge inside a rounded `next/image` card.
  - Body text leans on the tuned `prose` palette, Chinese-friendly leading, and accent blockquotes, with the slim progress bar staying above.
  - Navigation stays focused on 上一章 / 下一章 bars, and the related section uses airy `PostCard` grids with minimal chrome to preserve the reading flow.

- **Right sidebar** (on large screens)
  - Top hero:
    - Gravatar avatar (from env) rendered with `next/image` and shared rounded-mask styling.
    - Row of icon-only service links with manual overrides (HomeLab → server, 開發工作環境 → device, 關於本站 → menu, etc.).
    - Short "about me" sentence honoring `\n` line breaks and no leading icon for cleaner typography.
  - Hot tags: top 5 tags sized via the responsive scale and accent glows for consistency.

- **Tags**
  - Each tag chips in lists, post headers, and sidebar link to `/tags/[slug]`.
  - `/tags` now uses a masonry-like layout with pill consistency, subtle shadows, and accent outlines so the page no longer feels empty.

- **Misc**
  - Floating "back to top" button on long pages.

## Typography & Motion Guidelines

### Typography scale & font weights

- **Base scale**: global root font-size uses `clamp(15px, 0.65vw + 11px, 19px)` and `--line-height-body: clamp(1.5, 0.15vw + 1.45, 1.65)` so Chinese + English copy stays legible from phones through 4K displays.
- **Prose headings**: `h1`/`h2`/`h3` are sized via clamps (≈2.2‑3.4, 1.8‑2.8, 1.4‑2.0rem) with tighter line heights (1.25‑1.35) and subtle letter-spacing tweaks that pair with the serif accent.
- **Paragraphs & lists**: `prose p`, `li`, and `figcaption` settle between 1rem and 1.15rem while `small` descends to 0.8‑0.95rem so captions stay subordinate without losing legibility.
- **Navigation/TOC**: tag chips, TOC anchors, and the floating toggle sit around 0.9‑1rem at 500 weight; `toc-target-highlight` plus the accent marker keep the active heading visible without bullet clutter.
- **Blockquotes & code**: blockquotes lean into accent-gradient sides, oversized quotes, and hover elevation, while `pre`/`code` blocks gain padded, light backgrounds for clearer inline emphasis.
- **Serif accent for English headings**: `app/layout.tsx` now loads `Playfair_Display` into `--font-serif-eng`, and `styles/globals.css` applies that serif stack to `.type-display`, `.type-title`, `.type-subtitle`, and the global `h1`/`h2` selectors (with slight letter-spacing) so Latin headings stay elegant without disrupting the CJK fallback.
- **Font stack**: `Inter var`, `Noto Sans TC`, `PingFang TC`, `Microsoft JhengHei`, `Helvetica Neue`, `system-ui`, `sans-serif`.

### Motion & interaction

- Keep motion subtle and purposeful:
  - Use small translations (±2–4px) and short durations (200–400ms, `ease-out`).
  - Prefer fade/slide-in over large bounces or rotations.
- Respect user preferences:
  - Animations that run on their own are wrapped with `motion-safe:` so they are disabled when `prefers-reduced-motion` is enabled.
- Reading experience first:
  - Scroll-based reveals are used sparingly (e.g. post header and article body), not on every small element.
  - TOC and reading progress bar emphasize orientation, not decoration.
- Hover & focus:
  - Use light elevation (shadow + tiny translateY) and accent color changes to indicate interactivity.
  - Focus states remain visible and are not replaced by motion-only cues.

### Implemented Visual Touches

- Site-wide `next/image` usage (cards, feature media, sidebar avatar, related posts) to boost LCP without layout shifts.
- Reading progress bar slimmed down with a softer gradient glow.
- Scroll reveal for post header + article body (`ScrollReveal` component).
- Single post layout now wraps the article and optional TOC in `PostLayout`, animating column widths and exposing the floating glass pill toggle.
- Elegant vertical timeline rail on home/blog pages with aligned milestone ticks.
- Hover elevation + gradient accents for post cards, sidebar tiles, and tag chips.
- Smooth theme toggle with icon rotation and global `transition-colors`.
- TOC smooth scrolling with a dot indicator, temporary `toc-target-highlight`, and bullet-less list styling.
- Academic blockquotes featuring accent-side rules and caption text.

## Prerequisites

- Node.js **18+**
- npm (comes with Node)

## Setup

1. **Clone the repository**

   ```bash
   git clone https://gitea.gbanyan.net/gbanyan/blog-nextjs.git
   cd blog-nextjs
   ```

2. **Initialize the content submodule**

   ```bash
   git submodule update --init --recursive
   ```

   This checks out the `content` submodule pointing to `personal-blog`, which contains:

   - `posts/` – posts in markdown
   - `pages/` – static pages in markdown
   - `assets/` – images used by posts/pages

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Configure environment variables**

   Copy the example env file and update it with your personal information:

   ```bash
   cp .env.local.example .env.local
   ```

   Then edit `.env.local` (examples):

   ```bash
   # Core site info
   NEXT_PUBLIC_SITE_NAME="Gbanyan"
   NEXT_PUBLIC_SITE_TITLE="Gbanyan 的個人網站"
   NEXT_PUBLIC_SITE_DESCRIPTION="醫學、科技與生活隨筆。"
   NEXT_PUBLIC_SITE_URL="https://your-domain.example"
   NEXT_PUBLIC_SITE_AUTHOR="Gbanyan"
   NEXT_PUBLIC_SITE_TAGLINE="醫學、科技與生活的隨筆記錄。"

   # Avatar (Gravatar hash only, no email)
   NEXT_PUBLIC_SITE_AVATAR_URL="https://www.gravatar.com/avatar/<your_md5_hash>?s=160&d=identicon"

   # Short "about me" text for right sidebar
   NEXT_PUBLIC_SITE_ABOUT_SHORT="醫師，喜歡寫作與技術分享。"

   # Accent color palette
   NEXT_PUBLIC_COLOR_ACCENT="#2563eb"
   NEXT_PUBLIC_COLOR_ACCENT_SOFT="#dbeafe"
   NEXT_PUBLIC_COLOR_ACCENT_TEXT_LIGHT="#1d4ed8"
   NEXT_PUBLIC_COLOR_ACCENT_TEXT_DARK="#93c5fd"

   # Social links
   NEXT_PUBLIC_TWITTER_HANDLE="@yourhandle"
   NEXT_PUBLIC_GITHUB_URL="https://github.com/yourname"
   NEXT_PUBLIC_LINKEDIN_URL="https://www.linkedin.com/in/yourname/"
   NEXT_PUBLIC_EMAIL_CONTACT="you@example.com"
   NEXT_PUBLIC_MASTODON_URL="https://your.instance/@yourhandle"
   NEXT_PUBLIC_GITEA_URL="https://gitea.example/yourname"
   ```

   Notes:

   - To compute the Gravatar hash locally (without exposing your email):

     ```bash
     echo -n 'your-email@example.com' | md5    # macOS
     # or
     echo -n 'your-email@example.com' | md5sum | cut -d' ' -f1    # Linux
     ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   Then open <http://localhost:3000> in your browser.

## Content Model

Contentlayer is configured in `contentlayer.config.ts` to read from the `content` submodule:

- **Posts**
  - Path: `content/posts/**/*.md`
  - Type: `Post`
  - Important frontmatter fields:
    - `title` (string, required)
    - `slug` (string, optional – overrides path-based slug)
    - `tags` (string list, optional)
    - `published_at` (date, optional)
    - `description` (string, optional – used as excerpt / meta)
    - `feature_image` (string, optional – usually `../assets/xxx.jpg`)

- **Pages**
  - Path: `content/pages/**/*.md`
  - Type: `Page`
  - Important frontmatter fields:
    - `title` (string, required)
    - `slug` (string, optional)
    - `description` (string, optional)
    - `feature_image` (string, optional)

### Images

- Markdown uses relative paths like:

  ```markdown
  ![](../assets/my-image.jpg)
  ```

- At build time, a rehype plugin rewrites these to `/assets/my-image.jpg`.
- `public/assets` is a symlink to `content/assets`, so Next.js serves them as static files.
- `feature_image` fields are also mapped from `../assets/...` → `/assets/...` and rendered above the article content via `next/image`.
- All component-level imagery (list thumbnails, related posts, sidebar avatar, about page hero, etc.) now uses `next/image` for responsive sizing, blur placeholders, and better LCP.

## Updating Content from the Submodule

Content is maintained in the `personal-blog` repo and pulled in via the `content` submodule.

### Pull new content locally

From the root of this project:

```bash
# Option 1: generic update
cd content
git pull
cd ..

# Option 2: one-liner from root
git -C content pull
```

Then update the parent repo to point to the new submodule commit:

```bash
git add content
git commit -m "Update content submodule to latest main"
git push
```

Next.js + Contentlayer will pick up the changes automatically on the next `npm run dev` or `npm run build`.

### Cloning with submodule updates

On a fresh clone where the submodule has moved, run:

```bash
git submodule update --init --recursive
```

This ensures your `content` folder matches the commit referenced in `blog-nextjs`.

## Available npm Scripts

- `npm run dev` – Start Next.js dev server (Contentlayer is integrated via `next-contentlayer`).
- `npm run build` – Run `next build` for production.
- `npm run start` – Start the production server (after `npm run build`).
- `npm run lint` – Run Next.js / ESLint linting.
- `npm run contentlayer` – Manually run `contentlayer build` (optional).

## Deployment Notes

- This is a standard Next.js 13 App Router project and can be deployed to:
  - Vercel
  - Any Node.js host running `npm run build && npm run start`
- Make sure to:
  - Provide the same environment variables in your hosting environment as in `.env.local`.
  - Initialize/update the `content` submodule in your deployment pipeline (or vendor `.contentlayer` if you prefer).

## License

This is a personal project. No explicit open-source license is provided; all rights reserved unless otherwise noted.
