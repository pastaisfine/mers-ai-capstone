'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth/useAuth';

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/primary');
      } else {
        router.replace('/authpage');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#070A0F] text-[#F0F2F8]">
      <div className="relative flex flex-col items-center gap-6 max-w-md w-full px-6 text-center">
        {/* Glowing Radar Scanner Effect */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping duration-1000"></div>
          <div className="absolute w-16 h-16 rounded-full border border-emerald-500/30 animate-pulse"></div>
          <div className="w-12 h-12 rounded-full border-2 border-t-emerald-500 border-r-emerald-500/30 border-b-emerald-500/10 border-l-emerald-500/30 animate-spin"></div>
          <div className="absolute w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>

        <div className="space-y-2">
          <h1 className="text-lg font-bold tracking-widest text-[#F0F2F8] uppercase font-sans">
            MERS-AI System
          </h1>
          <p className="text-xs font-mono text-emerald-400/70 tracking-wider uppercase animate-pulse">
            Connecting to 999 Op-Center...
          </p>
        </div>

        {/* Small detail lines for technical vibe */}
        <div className="w-48 h-px bg-gradient-to-r from-transparent via-[#2D334A] to-transparent"></div>
        <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
          SECURE CHANNEL // MY-KUALA-LUMPUR
        </div>
      </div>
    </div>
  );
}

