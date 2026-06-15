import ReportNavigation from './panel/ReportNavigation';
import { useTheme } from '@/context/theme/useTheme';
import { useMemo } from 'react';

function ReportPanel() {
    const { theme } = useTheme();
    const panelVariantClass = useMemo(() => {
        switch (theme) {
            case 'dark':
                return 'bg-[#0B0D12] border-[#2D334A]'
            case 'light':
            default:
                return 'bg-white border-slate-200'
        }
    }, [theme]);
    const titleVariantClass = useMemo(() => {
        switch (theme) {
            case 'dark':
                return 'text-slate-400'
            case 'light':
            default:
                return 'text-slate-500'
        }
    }, [theme])
    return <div className={`flex flex-col ${panelVariantClass} h-full p-4 gap-4`}>
        <span className={`text-xs font-black ${titleVariantClass}`}>ARCHIVED INCIDENT AUDITS</span>
        <ReportNavigation />
    </div>;
}

export default ReportPanel