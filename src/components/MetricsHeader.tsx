'use client';

/**
 * Top navigation: branding, tab switcher (Dashboard / Simulation / Reports),
 * live clock, theme toggle, and incident count metrics.
 * See src/components/guides/MetricsHeader.md
 */

export interface MetricsHeaderProps {
  currentTab: 'dashboard' | 'simulation' | 'reports';
  setCurrentTab: (tab: 'dashboard' | 'simulation' | 'reports') => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  activeCount: number;
  criticalCount: number;
  resolvedCount: number;
  currentTimeText: string;
  isSimulating: boolean;
}

export function MetricsHeader(_props: MetricsHeaderProps) {
  return <header data-component="MetricsHeader" />;
}
