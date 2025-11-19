import { RightSidebar } from './right-sidebar';

export function SidebarLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,1.4fr)]">
            <div>{children}</div>
            <RightSidebar />
        </div>
    );
}
