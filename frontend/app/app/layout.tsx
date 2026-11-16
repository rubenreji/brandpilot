import React, { Suspense } from 'react';
import { AppShell } from '@/components/layout/AppShell';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#101827] flex items-center justify-center text-xs text-slate-400">
          Loading BrandPilot Governance Studio...
        </div>
      }
    >
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
