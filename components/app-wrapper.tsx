'use client';

import { ViewTransitionProvider } from '@/components/view-transition-provider';
import Template from '@/app/template';

export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitionProvider>
      <Template>
        {children}
      </Template>
    </ViewTransitionProvider>
  );
}
