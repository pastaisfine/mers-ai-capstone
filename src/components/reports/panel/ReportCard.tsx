import { useTheme } from '@/context/theme/useTheme';
import { ArchivedReport } from '@/models/report';
import { useMemo } from 'react';
import ApprovedStatusLabel from './ApprovedStatusLabel';
import { locale } from '@/constants/common';
import { useReport } from '@/context/report/useReport';

function ReportCard({ report, active }: { report: ArchivedReport, active: boolean }) {
    const { theme } = useTheme();
    const { setShowReportId } = useReport();
    const cardVariantClass = useMemo(() => {
        switch (`${theme}-${active ? 'active' : 'inactive'}`) {
            case 'light-active':
                return 'bg-red-50/70 border-[#E63946] shadow-sm';
            case 'light-inactive':
                return 'bg-slate-50 border-slate-200 hover:bg-state-100';
            case 'dark-active':
                return 'bg-[#1C2030] border-[#E63946]'
            case 'dark-inactive':
                return 'bg-[#121520] border-[#1D2130] hover:border-slate-700'
        }
    }, [theme, active]);
    const titleVariantClass = useMemo(() => {
        switch (theme) {
            case 'dark':
                return 'text-white';
            case 'light':
            default:
                return 'text-slate-800';
        }
    }, [theme])

    return (<div className={`flex flex-col ${cardVariantClass} p-2 rounded-md border gap-1`} onClick={() => { setShowReportId(report.id) }}>
        <div className="flex justify-between items-center">
            <span className={`text-[10px] font-semibold font-mono text-[#E63946]`}>{report.id}</span>
            <ApprovedStatusLabel status={report.approvedStatus} />
        </div>
        <span className={`${titleVariantClass} text-xs font-black uppercase`}>{report.title}</span>
        <span className="text-[10px] text-slate-400">{report.location}</span>
        <div className='flex justify-between text-[9px] font-mono text-slate-500'>
            <span>{report.severity} Severity</span>
            <span>{report.createAt.toLocaleDateString(locale)}</span>
        </div>
    </div>)
}

export default ReportCard