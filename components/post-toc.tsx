'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  depth: number;
}

export function PostToc() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>('article h2, article h3')
    );
    const mapped = headings
      .filter((el) => el.id)
      .map((el) => ({
        id: el.id,
        text: el.innerText,
        depth: el.tagName === 'H3' ? 3 : 2
      }));
    setItems(mapped);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).id;
            if (id) {
              setActiveId(id);
            }
          }
        });
      },
      {
        // Trigger when heading is in upper 40% of viewport
        rootMargin: '0px 0px -60% 0px',
        threshold: 0.1
      }
    );

    headings.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-20 text-xs text-slate-500 dark:text-slate-400">
      <div className="mb-2 font-semibold text-slate-700 dark:text-slate-200">
        目錄
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} className={item.depth === 3 ? 'pl-3' : ''}>
            <a
              href={`#${item.id}`}
              className={`line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 ${
                item.id === activeId
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : ''
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
