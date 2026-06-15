import ToggleGroup from '@/components/common/ToggleGroup';
import SearchIcon from '@/components/icons/SearchIcon';
import { useReport } from '@/context/report/useReport';
import { useTheme } from '@/context/theme/useTheme';
import { ApprovalType, ReportFilterType } from '@/models/report';
import { useMemo } from 'react';
import ReportCard from './ReportCard';

function ReportNavigation() {
    const { theme } = useTheme();
    const { filteredReports, showReportId, selectedFilter, setFilterType, setSearchPattern, searchPattern } = useReport();
    const horizontalBarClass = useMemo(() => {
        switch (theme) {
            case 'dark':
                return 'border-[#1D2130]';
            case 'light':
            default:
                return 'border-slate-100';
        }
    }, [theme])

    const searchBoxClass = useMemo(() => {
        switch (theme) {
            case 'dark':
                return 'bg-[#151924] border-[#1D2130] text-white focus:border-[#E63946]'
            case 'light':
            default:
                return 'bg-slate-50 border-slate-200 text-slate-850 focus:border-[#E63946]'

        }
    }, [theme]);

    function toggleGroupValueHandle(v: string) {
        if (v == selectedFilter) return;
        setFilterType(v as ReportFilterType)
    }
    return <div className="flex flex-col">
        <div className={`border-b ${horizontalBarClass} mb-2 flex flex-col gap-3 pb-4`}>
            <div className='relative'>
                <SearchIcon className='absolute left-2.5 top-2' />
                <input value={searchPattern} onChange={(e) => setSearchPattern(e.target.value)} className={`pl-8 pr-2 py-auto border-2 w-full h-8 ${searchBoxClass} rounded-md text-xs`} placeholder='Search title, ID or area' />
            </div>
            <ToggleGroup values={["ALL", ApprovalType.APPROVED, ApprovalType.REJECTED]} selectedValue={selectedFilter} setValue={toggleGroupValueHandle} valueActiveColors={{ "ALL": "bg-gray-500", [ApprovalType.APPROVED]: "bg-emerald-500", [ApprovalType.REJECTED]: "bg-red-500" }} />
        </div>
        <div className='flex flex-col gap-2'>
            {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} active={report.id == showReportId} />
            ))}
        </div>
    </div>
}

export default ReportNavigation;