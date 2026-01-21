# blog-nextjs

Personal blog built with Next.js 16 (App Router), Contentlayer2, and Tailwind CSS.

## Commands
- `npm run dev` - Start dev server (Turbopack + Contentlayer2)
- `npm run build` - Full build (sync-assets → contentlayer2 → next build → pagefind)
- `npm run sync-assets` - Sync content assets to public/

## Architecture
- `app/` - Next.js App Router pages
- `content/` - Git submodule with MDX posts and pages
- `components/` - React components
- Contentlayer2 processes MDX from `content/` directory
- Pagefind provides client-side search

## Conventions
- TypeScript strict mode
- Tailwind for styling
- MDX for blog content
