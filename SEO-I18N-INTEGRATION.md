# SEO / i18n routing integration

This branch keeps the current zh-TW public paths (`/`, `/blog/...`, `/pages/...`)
and adds the SEO contract needed by the routing lane.

## Content pairing contract

Localized documents opt in with the same `translation_key` and an explicit
`locale`:

```yaml
locale: zh-TW
translation_key: about-site
```

The English document uses the same key and `locale: en`. A missing key or
missing counterpart is intentionally treated as unpaired: no English URL,
hreflang, sitemap entry, RSS item, or llms link is invented.

English files use `translation_status: translated` after editorial translation.
The parent Velite adapter exposes that status and keeps translated English
documents indexable. Newly generated copies may still use
`translation_status: placeholder`; those routes remain browsable and paired,
but their detail metadata is `noindex` and they are omitted from sitemap, RSS,
and llms discovery output until translated.

## Expected paths

- zh-TW/default documents retain their existing paths.
- English documents use `/en/blog/<slug>` and `/en/pages/<slug>`.
- The routing lane should expose those paths and set its segment layout's
  `html[lang]` from `getDocumentLocale`.
- `/sitemap.xml`, `/feed.xml`, `/llms.txt`, and `/robots.txt` remain the
  zh-TW-compatible default endpoints.
- `/en/sitemap.xml`, `/en/feed.xml`, `/en/llms.txt`, and `/en/robots.txt` are
  additive locale endpoints. `/zh-TW/...` endpoint aliases are also emitted
  by the route handlers, but existing consumers should continue using the
  unprefixed URLs.

The routing lane can reuse `metadataForDocument` and `metadataForPath` from
`lib/seo.ts`; both helpers use `metadataBase`, self-referencing language
alternates, and `x-default` only when a default-locale target exists.
