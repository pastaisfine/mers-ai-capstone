'use client';

/**
 * Reports tab: archived incident audits list, filters, and printable debrief viewer.
 * Data: src/data/historicalReports.ts · Types: ArchivedReport in src/types.ts
 * See src/components/guides/ReportsTab.md
 */

export interface ReportsTabProps {
  theme: 'dark' | 'light';
}

export function ReportsTab(_props: ReportsTabProps) {
  return <section data-component="ReportsTab" id="screen-reports" />;
}
