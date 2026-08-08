import dynamic from 'next/dynamic';
import { FiLayout } from 'react-icons/fi';
import { clsx } from 'clsx';
import { MobileDrawer } from './mobile-drawer';
import { useDrawer } from '@/lib/use-drawer';

const RightSidebar = dynamic(() => import('./right-sidebar').then(mod => mod.RightSidebar), { ssr: false });
const RightSidebarContent = dynamic(() => import('./right-sidebar').then(mod => mod.RightSidebarContent), { ssr: false });

export function SidebarLayout({ children, tags, aboutUrl, avatarSrc }: { children: React.ReactNode; tags: TagItem[]; aboutUrl: string; avatarSrc: string }) {
  const { open, setOpen, mounted } = useDrawer();

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,1.4fr)] lg:gap-12">
        <div>{children}</div>
        <div className="hidden lg:block">
          <RightSidebar tags={tags} aboutUrl={aboutUrl} avatarSrc={avatarSrc} />
        </div>
      </div>

      <MobileDrawer
        open={open}
        mounted={mounted}
        onClose={() => setOpen(false)}
        title="側邊欄"
        icon={<FiLayout className="h-5 w-5" />}
        closeLabel="關閉側邊欄"
      >
        <RightSidebarContent tags={tags} aboutUrl={aboutUrl} avatarSrc={avatarSrc} />
      </MobileDrawer>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="開啟側邊欄"
        className={clsx(
          'fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-md backdrop-blur transition hover:bg-slate-100 hover:text-accent dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:hidden'
        )}
      >
        <FiLayout className="h-5 w-5" />
      </button>
    </>
  );
}
