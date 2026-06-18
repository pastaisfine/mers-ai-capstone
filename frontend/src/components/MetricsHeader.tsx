'use client';

import Image from 'next/image';
import {
  FileText,
  LayoutDashboard,
  Moon,
  SlidersHorizontal,
  Sun,
} from 'lucide-react';
import { useTime } from '@/context/time/useTime';
import { useSimulator } from '@/context/simulator/useSimulator';
import { useIncident } from '@/context/incident/useIncident';
import { useMemo } from 'react';
import { SeverityType, TabName } from '@/types';
import { useTab } from '@/context/tab/useTab';
import { useTheme } from '@/context/theme/useTheme';

/**
 * Top navigation: branding, tab switcher (Dashboard / Simulation / Reports),
 * live clock, theme toggle, and incident count metrics.
 * See src/components/guides/MetricsHeader.md
 */

export interface MetricsHeaderProps {

}

const tabs: {
  id: TabName;
  label: string;
  icon: typeof LayoutDashboard | typeof SlidersHorizontal | typeof FileText;
}[] = [
  { id: TabName.DASHBOARD, label: 'OP-Desk', icon: LayoutDashboard },
  { id: TabName.SIMULATION, label: 'Simulator', icon: SlidersHorizontal },
  { id: TabName.REPORTS, label: 'Reports', icon: FileText },
] as const;

export function MetricsHeader({
}: MetricsHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const { currentTimeText } = useTime();
  const { isSimulating } = useSimulator();
  const { incidents } = useIncident();
  const { currentTab, setCurrentTab } = useTab();

  const activeCount = useMemo(() => incidents.filter(i => i.severity !== SeverityType.RESOLVED).length, [incidents])
  const criticalCount = useMemo(() => incidents.filter(i => i.severity === SeverityType.CRITICAL).length, [incidents])
  const resolvedCount = useMemo(() => incidents.filter(i => i.severity === SeverityType.RESOLVED).length, [incidents])

  const tabClass = (tab: typeof currentTab) =>
    currentTab === tab
      ? 'bg-[#ef3347] text-white shadow-[0_0_18px_rgba(239,51,71,0.18)]'
      : isDark
        ? 'text-[#9aa7bd] hover:bg-white/[0.06] hover:text-white'
        : 'text-[#8a97ad] hover:bg-slate-100 hover:text-[#0b1730]';

  return (
    <header
      data-component="MetricsHeader"
      className={`flex h-[56px] shrink-0 items-center justify-between gap-4 border-b px-5 ${isDark ? 'border-[#141b29] bg-[#070a0f] text-white' : 'border-slate-200 bg-[#f8fafc] text-[#07142b]'
        }`}
    >
      <div className="flex min-w-[420px] items-center gap-4">
        <h1 className="text-[22px] font-black uppercase leading-none tracking-normal">
          <span className={isDark ? 'text-white' : 'text-[#07142b]'}>M</span>
          <span className="text-[#f4b83e]">E</span>
          <span className={isDark ? 'text-white' : 'text-[#07142b]'}>RS-AI</span>
        </h1>

        <div
          className={`flex h-[28px] items-center gap-2 rounded-full border px-4 ${isDark ? 'border-emerald-400/20 bg-emerald-400/10' : 'border-emerald-200 bg-emerald-50'
            }`}
        >
          <span className="h-[7px] w-[7px] rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          <span className={`text-[11px] font-extrabold uppercase tracking-normal ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
            System Operational
          </span>
        </div>

        <div className={`font-mono text-[11px] font-semibold tracking-normal ${isDark ? 'text-[#9db2d2]' : 'text-[#5e6f8e]'}`}>
          {currentTimeText} UTC+8
        </div>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-4">
        <nav
          className={`grid h-[32px] grid-cols-3 gap-1 rounded-lg border p-[3px] ${isDark ? 'border-[#1f293b] bg-[#0d1320]' : 'border-[#17233a] bg-white'
            }`}
          aria-label="Primary navigation"
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setCurrentTab(id)}
              className={`flex h-[24px] min-w-[92px] items-center justify-center gap-2 rounded-md px-3 text-[11px] font-extrabold uppercase transition-colors ${tabClass(id)}`}
              aria-current={currentTab === id ? 'page' : undefined}
            >
              <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div
          className={`flex h-[32px] items-center gap-3 rounded-lg border px-4 font-mono text-[10px] font-extrabold uppercase ${isDark ? 'border-[#1f293b] bg-[#0d1320]' : 'border-slate-300 bg-white'
            }`}
        >
          <div className="flex items-center gap-2">
            <span className={isDark ? 'text-[#9aa7bd]' : 'text-[#5e6f8e]'}>Active</span>
            <span className={`rounded px-1.5 py-0.5 ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
              {activeCount}
            </span>
          </div>
          <span className={isDark ? 'text-[#566176]' : 'text-slate-400'}>|</span>
          <div className="flex items-center gap-2">
            <span className={isDark ? 'text-[#ff4d5f]' : 'text-[#e11d35]'}>Critical</span>
            <span className={`rounded px-1.5 py-0.5 ${isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-600'}`}>
              {criticalCount}
            </span>
          </div>
          <span className={isDark ? 'text-[#566176]' : 'text-slate-400'}>|</span>
          <div className="flex items-center gap-2">
            <span className={isDark ? 'text-[#9aa7bd]' : 'text-[#5e6f8e]'}>Resolved</span>
            <span className={`rounded px-1.5 py-0.5 ${isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-600'}`}>
              {resolvedCount}
            </span>
          </div>
          {isSimulating && (
            <>
              <span className={isDark ? 'text-[#566176]' : 'text-slate-400'}>|</span>
              <div className="flex items-center gap-2 text-[#ff4d5f]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff4d5f]" />
                Live
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex min-w-[190px] items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => toggleTheme()}
          aria-label="Toggle theme"
          className={`flex h-[34px] w-[34px] items-center justify-center rounded-lg border transition-colors ${isDark
            ? 'border-[#1f293b] bg-[#0d1320] text-yellow-400 hover:bg-white/10'
            : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-100'
            }`}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div className={`h-8 w-px ${isDark ? 'bg-[#253044]' : 'bg-slate-400'}`} />

        <div className="flex items-center gap-3">
          <Image
            src="/op-khalid-avatar.png"
            alt="OP-Khalid"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full border-2 border-[#ef3347] object-cover"
          />
          <div className="leading-none">
            <div className={`text-[12px] font-black uppercase tracking-normal ${isDark ? 'text-white' : 'text-[#07142b]'}`}>
              OP-KHALID
            </div>
            <div className={`mt-1 font-mono text-[8px] font-normal uppercase tracking-[0.2em] ${isDark ? 'text-[#8fa0bb]' : 'text-[#6f7f98]'}`}>
              Shift A Team
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
