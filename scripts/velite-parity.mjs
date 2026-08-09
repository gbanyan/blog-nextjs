import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const contentlayerIndex = resolve(root, '.contentlayer/generated/index.mjs');
const veliteIndex = resolve(root, '.velite/index.js');

const expectedCounts = { Post: 52, Page: 4 };
const sharedFields = [
  'title',
  'slug',
  'description',
  'type',
  'ghost_id',
  'status',
  'visibility',
  'featured',
  'created_at',
  'updated_at',
  'published_at',
  'custom_excerpt',
  'authors',
  'feature_image',
  'tags',
];
const pageFields = ['layout', 'nav_category', 'nav_label', 'hero', 'icon'];
const missing = Symbol('missing');
const differences = [];

const fail = (scope, field, expected, actual) => {
  differences.push({ scope, field, expected, actual });
};

const hasValue = (record, field) =>
  Object.prototype.hasOwnProperty.call(record, field) && record[field] !== undefined
    ? record[field]
    : missing;

const dateValue = (value) => {
  if (value === missing || value === null) return value;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.valueOf()) ? value : date.toISOString();
};

const sourceWithoutExtension = (sourcePath) =>
  sourcePath.endsWith('.md') ? sourcePath.slice(0, -3) : sourcePath;

const sourceWithExtension = (sourcePath) =>
  sourcePath.endsWith('.md') ? sourcePath : `${sourcePath}.md`;

const routeRelativePath = (collection, sourcePath) =>
  sourceWithoutExtension(sourcePath).replace(`${collection === 'Post' ? 'posts' : 'pages'}/`, '');

const stable = (value) => {
  if (value === missing) return '<missing>';
  return JSON.stringify(value);
};

const same = (left, right) => stable(left) === stable(right);

const printable = (value) => {
  const result = stable(value);
  return result.length > 220 ? `${result.slice(0, 217)}...` : result;
};

const sha256 = (value) =>
  createHash('sha256').update(value ?? '').digest('hex').slice(0, 16);

const firstDifference = (expected, actual) => {
  const limit = Math.min(expected.length, actual.length);
  for (let index = 0; index < limit; index += 1) {
    if (expected[index] !== actual[index]) return index;
  }
  return limit;
};

const normalize = (collection, record, source) => {
  const sourcePath =
    source === 'contentlayer'
      ? record._raw.sourceFilePath
      : sourceWithExtension(record.sourcePath);
  const flattenedPath =
    source === 'contentlayer'
      ? record.flattenedPath
      : routeRelativePath(collection, record.sourcePath);
  const slug = hasValue(record, 'slug');
  const url =
    source === 'contentlayer'
      ? record.url
      : `/${collection === 'Post' ? 'blog' : 'pages'}/${
          slug === missing || slug === '' ? flattenedPath : slug
        }`;

  return {
    id: source === 'contentlayer' ? record._id : sourcePath,
    sourcePath,
    flattenedPath,
    url,
    fields: Object.fromEntries(
      [...sharedFields, ...(collection === 'Page' ? pageFields : [])].map((field) => [
        field,
        field.endsWith('_at') ? dateValue(hasValue(record, field)) : hasValue(record, field),
      ]),
    ),
    bodyHtml: source === 'contentlayer' ? record.body.html : record.body,
  };
};

const mapBySource = (records, collection, source) => {
  const normalized = records.map((record) => normalize(collection, record, source));
  const result = new Map();
  for (const record of normalized) {
    if (result.has(record.sourcePath)) {
      fail(collection, 'duplicate source path', '<unique>', record.sourcePath);
    }
    result.set(record.sourcePath, record);
  }
  return result;
};

const compareValue = (scope, field, expected, actual) => {
  if (!same(expected, actual)) fail(scope, field, expected, actual);
};

const compareCollection = (collection, oldRecords, newRecords) => {
  const oldBySource = mapBySource(oldRecords, collection, 'contentlayer');
  const newBySource = mapBySource(newRecords, collection, 'velite');

  compareValue(collection, 'count', expectedCounts[collection], oldRecords.length);
  compareValue(collection, 'Velite count', oldRecords.length, newRecords.length);

  for (const sourcePath of [...oldBySource.keys()].sort()) {
    const oldRecord = oldBySource.get(sourcePath);
    const newRecord = newBySource.get(sourcePath);
    if (!newRecord) {
      fail(collection, 'missing source path', sourcePath, '<missing>');
      continue;
    }

    compareValue(`${collection} ${sourcePath}`, 'id', oldRecord.id, newRecord.id);
    compareValue(`${collection} ${sourcePath}`, 'sourcePath', oldRecord.sourcePath, newRecord.sourcePath);
    compareValue(
      `${collection} ${sourcePath}`,
      'flattenedPath',
      oldRecord.flattenedPath,
      newRecord.flattenedPath,
    );
    compareValue(`${collection} ${sourcePath}`, 'url', oldRecord.url, newRecord.url);

    for (const field of Object.keys(oldRecord.fields)) {
      compareValue(
        `${collection} ${sourcePath}`,
        field,
        oldRecord.fields[field],
        newRecord.fields[field],
      );
    }

    if (oldRecord.bodyHtml !== newRecord.bodyHtml) {
      fail(
        `${collection} ${sourcePath}`,
        'body.html',
        `sha256:${sha256(oldRecord.bodyHtml)} length:${oldRecord.bodyHtml.length}`,
        `sha256:${sha256(newRecord.bodyHtml)} length:${newRecord.bodyHtml.length} first-difference:${firstDifference(oldRecord.bodyHtml, newRecord.bodyHtml)}`,
      );
    }
  }

  for (const sourcePath of [...newBySource.keys()].sort()) {
    if (!oldBySource.has(sourcePath)) {
      fail(collection, 'unexpected source path', '<absent>', sourcePath);
    }
  }

  return { oldBySource, newBySource };
};

const compareSet = (scope, expected, actual) => {
  compareValue(scope, 'records', [...expected].sort(), [...actual].sort());
};

if (!existsSync(contentlayerIndex) || !existsSync(veliteIndex)) {
  console.error(
    'Velite parity requires generated output. Run `npm run contentlayer` and `npm run velite:build` first.',
  );
  process.exitCode = 1;
} else {
  const [{ allPosts, allPages }, { posts, pages }] = await Promise.all([
    import(`${pathToFileURL(contentlayerIndex).href}?parity=contentlayer`),
    import(`${pathToFileURL(veliteIndex).href}?parity=velite`),
  ]);

  const postMaps = compareCollection('Post', allPosts, posts);
  const pageMaps = compareCollection('Page', allPages, pages);

  const oldUnderscore = allPosts
    .filter((record) => typeof record.slug === 'string' && record.slug.includes('_'))
    .map((record) => `${record._raw.sourceFilePath}:${record.slug}:${record.url}`)
    .sort();
  const newUnderscore = posts
    .filter((record) => typeof record.slug === 'string' && record.slug.includes('_'))
    .map((record) => `${sourceWithExtension(record.sourcePath)}:${record.slug}:${`/blog/${record.slug}`}`)
    .sort();
  compareValue('underscore slugs', 'count', 2, oldUnderscore.length);
  compareSet('underscore slugs', oldUnderscore, newUnderscore);

  const oldMissingStatus = allPosts
    .filter((record) => !Object.prototype.hasOwnProperty.call(record, 'status') || record.status === undefined)
    .map((record) => record._id);
  const newMissingStatus = posts
    .filter((record) => !Object.prototype.hasOwnProperty.call(record, 'status') || record.status === undefined)
    .map((record) => sourceWithExtension(record.sourcePath));
  compareValue('missing-status posts', 'count', 3, oldMissingStatus.length);
  compareSet('missing-status posts', oldMissingStatus, newMissingStatus);

  const oldFeedPosts = allPosts
    .filter((record) => record.status === 'published')
    .map((record) => record._id);
  const newFeedPosts = posts
    .filter((record) => record.status === 'published')
    .map((record) => sourceWithExtension(record.sourcePath));
  compareSet('published feed posts', oldFeedPosts, newFeedPosts);
  for (const [label, records] of [
    ['Contentlayer2', allPosts],
    ['Velite', posts],
  ]) {
    for (const record of records.filter(
      (candidate) => !Object.prototype.hasOwnProperty.call(candidate, 'status') || candidate.status === undefined,
    )) {
      const id = label === 'Contentlayer2' ? record._id : sourceWithExtension(record.sourcePath);
      if ((label === 'Contentlayer2' ? oldFeedPosts : newFeedPosts).includes(id)) {
        fail('missing-status posts', `${label} feed exclusion`, '<excluded>', id);
      }
    }
  }

  for (const [collection, records] of [
    ['Post', allPosts],
    ['Page', allPages],
    ['Post', posts],
    ['Page', pages],
  ]) {
    for (const record of records) {
      const sourcePath =
        collection === 'Post' && record._raw
          ? record._raw.sourceFilePath
          : collection === 'Page' && record._raw
            ? record._raw.sourceFilePath
            : sourceWithExtension(record.sourcePath);
      if (sourcePath.endsWith('Arc 瀏覽器使用心得.md')) {
        fail(`${collection} Arc exclusion`, 'source path', '<excluded>', sourcePath);
      }
    }
  }

  void postMaps;
  void pageMaps;
  if (differences.length > 0) {
    console.error(`Velite parity failed with ${differences.length} difference(s):`);
    for (const difference of differences) {
      console.error(
        `- ${difference.scope} ${difference.field}: expected ${printable(difference.expected)}, actual ${printable(difference.actual)}`,
      );
    }
    process.exitCode = 1;
  } else {
    console.log('Velite parity passed: 52 posts, 4 pages; metadata, dates, tags, URLs, paths, IDs, body HTML, underscore slugs, Arc exclusion, and missing-status feed semantics match.');
  }
}
