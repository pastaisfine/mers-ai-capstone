import { useMemo } from 'react';
import DocumentIcon from '../icons/DocumentIcon';
import DownloadIcon from '../icons/DownloadIcon';
import { useTheme } from '@/context/theme/useTheme';

function ReportExportSection() {
    const { theme } = useTheme();
    const themeBoxVariantClass = useMemo(() => {
        switch (theme) {
            case 'dark':
                return 'bg-[#0B0D12] border-[#2D334A]';
            case 'light':
            default:
                return 'bg-white border-slate-200';
        }
    }, [theme]);
    const themeTitleVariantClass = useMemo(() => {
        switch (theme) {
            case 'dark':
                return 'text-white';
            case 'light':
            default:
                return 'text-slate-900';
        }
    }, [theme])
    const themeButtonVariantClass = useMemo(() => {
        switch (theme) {
            case 'dark':
                return 'border-slate-700 text-white hover:bg-slate-700 bg-[#181C26]';
            case 'light':
            default:
                return 'bg-white border-slate-300 text-slate-750 hover:bg-slate-100 shadow-sm'
        }
    }, [theme])
    return (
        <div id="report-export-section" className={`border flex p-4 justify-between items-center ${themeBoxVariantClass}`}>
            <div className="flex flex-col">
                <span className="flex items-center gap-2">
                    <DocumentIcon />
                    <p className={`text-sm font-black ${themeTitleVariantClass}`}>CERTIFIED DEBRIEF RECORDS</p>
                </span>
                <p className="text-[11px] text-slate-400 font-medium">Operational audit signature logs cryptographically verified for Malaysia civil safety.</p>
            </div>
            <div>
                <button onClick={() => window.print()} className={`flex justify-between px-4 py-2 items-center gap-2 text-xs font-black ${themeButtonVariantClass}`}>
                    <DownloadIcon />
                    EXPORT PDF REPORT
                </button>
            </div>
        </div>
    )
}

export default ReportExportSection;