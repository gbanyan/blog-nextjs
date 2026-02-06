# New Blog Post

Create and publish a new blog post for the personal blog.

## Step 1: Gather Information

Ask the user for the following using AskUserQuestion (all in one prompt):

1. **Title** — the article title (Chinese or English)
2. **Tags** — offer existing tags from past posts as multi-select options: `Medicine - 醫學`, `Writings - 創作`, `Hardware - 硬體`, `Software - 軟體`, `Unboxing - 開箱`. User can also input custom tags.
3. **Feature image** — options: no image, provide a URL or Unsplash link, or provide a local file path
4. **Description** — short excerpt for SEO/article list, or skip for now

## Step 2: Create the Post File

Create the markdown file at `content/posts/<title>.md` with this frontmatter format:

```yaml
---
title: <title>
slug: <english-slug-derived-from-title>
published_at: '<current-ISO-date>'
description: <description if provided>
tags:
- <tag1>
- <tag2>
authors:
- Gbanyan
feature_image: ../assets/<slug>.jpg
---
```

If the user provides article content, add it after the frontmatter.

## Step 3: Handle Feature Image

If the user provides an Unsplash URL:
1. Extract the real image URL by running: `curl -sL "<unsplash-page-url>" | grep -oE 'https://images\.unsplash\.com/photo-[^"? ]+' | head -1`
2. Download at 1920px width: `curl -sL -o content/assets/<slug>.jpg "<image-url>?w=1920&q=90"`
3. Optimize with jpegoptim: `jpegoptim --max=85 --strip-all --all-progressive content/assets/<slug>.jpg`
4. Verify the image visually using the Read tool

If the user provides a local file path, copy it to `content/assets/<slug>.jpg` and optimize.

If no image, omit `feature_image` from frontmatter.

## Step 4: Preview (Optional)

Ask the user if they want to preview with `npm run dev` before publishing.

## Step 5: Publish

Execute the two-step deployment:

```bash
# 1. Commit and push content submodule
git -C content add . && git -C content commit -m "Add new post: <title>" && git -C content push

# 2. Update main repo submodule pointer and push (triggers CI/CD)
git add content && git commit -m "Update content submodule" && git push
```

Confirm both pushes succeeded. The CI/CD pipeline on git.gbanyan.net will handle deployment automatically (and crontab mirrors to gitea.gbanyan.net).
