'use client';

import dynamic from 'next/dynamic';

// Lazy load RightSidebar since it's only visible on lg+ screens
const RightSidebar = dynamic(() => import('./right-sidebar').then(mod => ({ default: mod.RightSidebar })), {
  ssr: false,
});

export function SidebarLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,1.4fr)]">
            <div>{children}</div>
            <RightSidebar />
        </div>
    );
}
