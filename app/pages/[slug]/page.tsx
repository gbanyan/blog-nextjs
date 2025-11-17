import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { allPages } from 'contentlayer/generated';
import { getPageBySlug } from '@/lib/posts';

export function generateStaticParams() {
  return allPages.map((page) => ({
    slug: page.slug || page.flattenedPath
  }));
}

interface Props {
  params: { slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const slug = params.slug;
  const page = getPageBySlug(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description || page.title
  };
}

export default function StaticPage({ params }: Props) {
  const slug = params.slug;
  const page = getPageBySlug(slug);

  if (!page) return notFound();

  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.body.html }} />
    </article>
  );
}
