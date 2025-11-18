# Personal Blog (Next.js + Contentlayer)

This is a personal blog built with **Next.js 13 (App Router)**, **Contentlayer**, and **Tailwind CSS**.
Markdown content (posts & pages) lives in a separate repository and is consumed via a git submodule.

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
  - "最新文章" section listing latest posts as cards with thumbnail, date, title, tags, and excerpt.

- **Blog index** (`/blog`)
  - Uses `PostListWithControls`:
    - Keyword search filters posts by title, tags, and excerpt with instant feedback.
    - Sort order: new→old or old→new.
    - Pagination using `siteConfig.postsPerPage`.

- **Single post / page** (`/blog/[slug]`, `/pages/[slug]`)
  - Left: sticky TOC that highlights the current section as you scroll.
  - Top: published date, large title, colored tags.
  - Body: `prose` typography with tuned light/dark colors, images, blockquotes, code.
  - Top bar: reading progress indicator.
  - Bottom: "相關文章" cards suggesting up to three related posts that share overlapping tags.

- **Right sidebar** (on large screens)
  - Top hero:
    - Gravatar avatar (from env) linking to an "about" page.
    - Row of icon‑only service links (GitHub, Mastodon, LinkedIn).
    - Short "about me" sentence from env.
  - Hot tags: top 5 tags in a small tag cloud using the accent palette and neutral dark‑mode backgrounds.

- **Tags**
  - Each tag chips in lists, post headers, and sidebar link to `/tags/[slug]`.
  - `/tags` shows all tags and their counts.

- **Misc**
  - Floating "back to top" button on long pages.

## Motion & Interaction Guidelines

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

- Reading progress bar with a soft gradient glow at the top of post pages.
- Scroll reveal for post header + article body (`ScrollReveal` component).
- Hover elevation + gradient accents for post cards, list items, sidebar author card, and tag chips.
- Smooth theme toggle with icon rotation and global `transition-colors` on the page background.
- TOC smooth scrolling + short-lived highlight on the target heading.
- Subtle hover elevation for `blockquote` and `pre` blocks inside `.prose` content.

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
- `feature_image` fields are also mapped from `../assets/...` → `/assets/...` and rendered above the article content.

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
