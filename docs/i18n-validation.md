# i18n validation

Run the dependency-free validator after Velite has generated data:

```bash
node scripts/check-i18n.mjs
```

The script discovers arrays in `.velite/*.json`. The integrated i18n adapter
may instead provide either a JSON snapshot or an ESM module:

```bash
node scripts/check-i18n.mjs --manifest .velite/i18n-validation.json
node scripts/check-i18n.mjs --adapter scripts/i18n-validation-adapter.mjs
```

The adapter/snapshot contract is intentionally small:

```js
{
  records: [
    { locale: 'zh-TW', translationKey: 'post:stable-id', route: '/blog/foo' },
    { locale: 'en', translationKey: 'post:stable-id', route: '/en/blog/foo' }
  ],
  routes: [
    {
      locale: 'zh-TW', translationKey: 'post:stable-id', path: '/blog/foo',
      canonical: 'https://example.test/blog/foo',
      hreflang: { 'zh-TW': 'https://example.test/blog/foo', en: 'https://example.test/en/blog/foo' }
    }
  ],
  expected: {
    localeCounts: { 'zh-TW': 1, en: 1 },
    routeCounts: { 'zh-TW': 1, en: 1 },
    routeCount: 2,
    sitemapCount: 2,
    feedItemCount: 1
  },
  outputs: { sitemap: '/sitemap.xml', feed: '/feed.xml', llms: '/llms.txt' }
}
```

`records` must contain at least one `zh-TW` and one `en` record. Every record
needs a stable `translationKey`; an English record is optional for a key, but
if it is absent there must be no English route, English hreflang, sitemap URL,
feed item, or llms URL for that key. Each route must point to exactly one
record, and duplicate normalized paths fail the check. `expected` is optional
except when the integration lane wants counts pinned; the validator always
checks that there is exactly one route per routable record.

To smoke-test the rendered canonical/hreflang tags and generated outputs, run
the site and pass its base URL:

```bash
node scripts/check-i18n.mjs --smoke http://localhost:3000
```

The smoke server should expose the same paths returned by the adapter. No
package script is required, so this can be run without changing `package.json`.
