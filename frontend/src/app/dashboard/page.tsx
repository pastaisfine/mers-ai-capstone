'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth/useAuth';
import { DashboardShell } from './_components/dashboard-shell';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/authpage');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="relative flex size-20 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full border border-secondary/20" />
          <div className="size-12 animate-spin rounded-full border-2 border-t-primary border-r-primary/30 border-b-primary/10 border-l-primary/30" />
        </div>
        <p className="mt-6 font-mono text-xs uppercase tracking-wider text-muted-foreground animate-pulse">
          Verifying Operator Credentials...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <DashboardShell />;
}
