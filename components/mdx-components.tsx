import type { MDXComponents } from 'mdx/types';

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1 className="mt-8 scroll-m-20 text-3xl font-bold" {...props} />
  ),
  h2: (props) => (
    <h2 className="mt-6 scroll-m-20 text-2xl font-semibold" {...props} />
  ),
  p: (props) => (
    <p className="leading-7 [&:not(:first-child)]:mt-4" {...props} />
  ),
  a: (props) => (
    <a
      className="font-medium text-blue-600 underline-offset-4 hover:underline"
      {...props}
    />
  ),
  ul: (props) => <ul className="my-4 ml-6 list-disc" {...props} />,
  ol: (props) => <ol className="my-4 ml-6 list-decimal" {...props} />,
  code: (props) => (
    <code
      className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800"
      {...props}
    />
  ),
  pre: (props) => (
    <pre className="my-4 overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100" {...props} />
  )
};

