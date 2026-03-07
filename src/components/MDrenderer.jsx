'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MDrenderer({ md }) {
  if (!md) return null;

  // const md_norm = md.replace(/^\s+/gm, ''); // remove indentation problems

  return (
    <div
      className="
        prose prose-sm max-w-none
        prose-p:my-2
        prose-ul:my-2 prose-ul:pl-5
        prose-ol:my-2 prose-ol:pl-5
        prose-li:my-1
        prose-strong:text-zinc-900 dark:prose-strong:text-zinc-50
        prose-headings:text-zinc-900 dark:prose-headings:text-zinc-50
        prose-p:text-zinc-700 dark:prose-p:text-zinc-200
        prose-li:text-zinc-700 dark:prose-li:text-zinc-200
        prose-a:text-blue-600 dark:prose-a:text-blue-400
      "
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {md}
      </ReactMarkdown>
    </div>
  );
}
