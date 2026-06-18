import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { ReportContext } from './useReport';
import { ArchivedReport, ReportFilterType } from '@/models/report';
import { HISTORICAL_REPORTS } from '@/data/historicalReports';

function inReportQuery(report: ArchivedReport, v: string): boolean {
    const lowercaseV = v.toLowerCase();
    return report.title.toLowerCase().includes(lowercaseV) || report.location.toLowerCase().includes(lowercaseV)
}

export function ReportProvider({ children }: { children: ReactNode }) {
    const [reports] = useState<ArchivedReport[]>(HISTORICAL_REPORTS);
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<ReportFilterType>('ALL');
    const [searchPattern, setSearchPattern] = useState<string>('');

    const setShowReportId = useCallback((v: string | null) => {
        if (v != selectedReportId) setSelectedReportId(v)
    }, [selectedReportId])

    const setSelectedFilterType = useCallback((v: ReportFilterType) => {
        if (v !== filterType) setFilterType(v);
    }, [filterType])

    const showReport = useMemo(() => reports.find((r) => r.id == selectedReportId) ?? null, [selectedReportId])

    const filteredReports = useMemo(() => {
        if (filterType == 'ALL') return reports.filter((r) => inReportQuery(r, searchPattern));
        return reports.filter((r) => r.approvedStatus == filterType && inReportQuery(r, searchPattern))
    }, [reports, filterType, searchPattern]);

    const setSearchPatternHandler = useCallback((v: string) => {
        const trimmedV = v.trim();
        if (trimmedV == searchPattern) return;
        setSearchPattern(trimmedV);
    }, [searchPattern]);

    return <ReportContext value={{
        reports, showReportId: selectedReportId, setShowReportId, showReport,
        selectedFilter: filterType, setFilterType: setSelectedFilterType, filteredReports, searchPattern,
        setSearchPattern: setSearchPatternHandler
    }}> {children}</ ReportContext>
}

