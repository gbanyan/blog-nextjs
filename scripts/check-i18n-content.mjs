import assert from 'node:assert/strict';
import { pages, posts } from '../.velite/index.js';

const eligiblePosts = posts.filter((post) => !post.sourcePath.includes('/en/'));
const eligiblePages = pages.filter((page) => !page.sourcePath.includes('/en/'));
const englishPosts = posts.filter((post) => post.locale === 'en');
const englishPages = pages.filter((page) => page.locale === 'en');
const chinesePosts = posts.filter((post) => post.locale === 'zh-TW');
const chinesePages = pages.filter((page) => page.locale === 'zh-TW');

assert.equal(eligiblePosts.length, englishPosts.length);
assert.equal(eligiblePages.length, englishPages.length);
assert.equal(chinesePosts.length, eligiblePosts.length);
assert.equal(chinesePages.length, eligiblePages.length);
assert.equal(posts.some((post) => post.sourcePath.includes('Arc 瀏覽器使用心得')), false);
assert.equal(pages.some((page) => page.sourcePath.includes('Arc 瀏覽器使用心得')), false);

function pairKey(document) {
  return document.translation_id ?? document.sourcePath.replace(/^(posts|pages)\/(en\/)?/, '$1/').replace(/\.md$/, '');
}

for (const collection of [posts, pages]) {
  const sources = new Map(
    collection.filter((document) => document.locale === 'zh-TW').map((document) => [pairKey(document), document])
  );
  for (const english of collection.filter((document) => document.locale === 'en')) {
    const source = sources.get(pairKey(english));
    assert.ok(source, `missing source for ${english.sourcePath}`);
    assert.equal(english.slug, source.slug, english.sourcePath);
    assert.equal(english.status, source.status, english.sourcePath);
    assert.equal(String(english.published_at), String(source.published_at), english.sourcePath);
    assert.deepEqual(english.tags, source.tags, english.sourcePath);
    assert.equal(english.translation_status, 'translated', english.sourcePath);
    // Translation changes prose and/or translated frontmatter while the
    // routing and asset metadata below must remain paired with the source.
    assert.ok(
      english.raw !== source.raw || english.title !== source.title,
      english.sourcePath
    );
    assert.equal(english.feature_image, source.feature_image, english.sourcePath);
  }
}

console.log(JSON.stringify({
  posts: { total: posts.length, 'zh-TW': chinesePosts.length, en: englishPosts.length },
  pages: { total: pages.length, 'zh-TW': chinesePages.length, en: englishPages.length },
  translationPairs: englishPosts.length + englishPages.length,
}, null, 2));
