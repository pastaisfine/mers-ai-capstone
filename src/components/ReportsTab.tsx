'use client';

import ReportContainer from './reports/ReportContainer';
import ReportPanel from './reports/ReportPanel';
import { ThemeProvider } from '@/context/theme/ThemeProvider';
import { Theme } from '@/types';
import { useReport } from '@/context/report/useReport';

/**
 * Reports tab: archived incident audits list, filters, and printable debrief viewer.
 * Data: src/data/historicalReports.ts · Types: ArchivedReport in src/types.ts
 * See src/components/guides/ReportsTab.md
 */

export interface ReportsTabProps {
  theme: Theme
}

export function ReportsTab(_props: ReportsTabProps) {
  const { showReport } = useReport();
  return <section className="flex w-full justify-center" data-component="ReportsTab" id="screen-reports" >
    <ThemeProvider defaultTheme={_props.theme}>
      <div id="report-panel-div" className="sm:basis-60 lg:basis-90 min-h-dvh">
        <ReportPanel />
      </div>
      <div id="report-container-div" className="flex-1 overflow-y-auto max-h-screen">
        {showReport && <ReportContainer report={showReport} />}
      </div>
    </ThemeProvider>
  </section>;
}
