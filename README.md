# Personal Blog (Next.js + Contentlayer)

This is a personal blog built with **Next.js 13 (App Router)**, **Contentlayer**, and **Tailwind CSS**.  
Markdown content (posts & pages) lives in a separate repository and is consumed via a git submodule.

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Typography plugin
- **Content**: Markdown via Contentlayer (`contentlayer/source-files`)
- **Theming**: `next-themes` (light / dark mode)
- **Content source**: Git submodule `content` → [`personal-blog`](https://gitea.gbanyan.net/gbanyan/personal-blog.git)

## Project Structure

- `app/` – Next.js App Router pages
  - `app/page.tsx` – Home page
  - `app/blog/` – Blog index and individual post pages
  - `app/pages/` – Static pages (e.g. 關於作者)
- `components/` – Layout shell, header, footer, MDX/markdown components, theme toggle
- `lib/`
  - `config.ts` – Site configuration derived from environment variables
  - `posts.ts` – Helpers for querying posts & pages from Contentlayer
- `content/` – **Git submodule** pointing to `personal-blog` (markdown content)
  - `posts/` – Blog posts (`.md`)
  - `pages/` – Static pages (`.md`)
  - `assets/` – Images referenced from markdown
- `public/assets` – Symlink to `content/assets` for serving images at `/assets/...`
- `contentlayer.config.ts` – Contentlayer document type definitions and markdown pipeline

## Prerequisites

- Node.js **18+** (recommended by Next.js 13)
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

   Then edit `.env.local`:

   ```bash
   NEXT_PUBLIC_SITE_NAME="Your Name"
   NEXT_PUBLIC_SITE_TITLE="Your Personal Site"
   NEXT_PUBLIC_SITE_DESCRIPTION="Personal homepage and blog."
   NEXT_PUBLIC_SITE_URL="https://your-domain.example"
   NEXT_PUBLIC_SITE_AUTHOR="Your Name"
   ```

   These values are used by `lib/config.ts` to customize:

   - Site title and description
   - Default SEO metadata
   - Header title
   - Footer author name

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

- At build time, a small rehype plugin rewrites these to `/assets/my-image.jpg`.
- `public/assets` is a symlink to `content/assets`, so Next.js serves them as static files.
- `feature_image` fields are also mapped from `../assets/...` → `/assets/...` and rendered above the article content.

## Available npm Scripts

- `npm run dev` – Start Next.js dev server with Contentlayer integration.
- `npm run build` – Run `contentlayer build` and then `next build` for production.
- `npm run start` – Start the production server (after `npm run build`).
- `npm run lint` – Run Next.js / ESLint linting.
- `npm run contentlayer` – Manually run `contentlayer build`.

## Deployment Notes

- This is a standard Next.js 13 App Router project and can be deployed to:
  - Vercel
  - Any Node.js host running `npm run build && npm run start`
- Make sure to:
  - Provide the same environment variables in your hosting environment as in `.env.local`.
  - Initialize the `content` submodule in your deployment pipeline (or vendor the generated `.contentlayer` output if needed).

## License

This is a personal project. No explicit open-source license is provided; all rights reserved unless otherwise noted.

