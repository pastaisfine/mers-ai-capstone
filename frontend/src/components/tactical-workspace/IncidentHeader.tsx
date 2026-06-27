import { useTheme } from '@/context/theme/useTheme';
import { useTime } from '@/context/time/useTime';
import { Incident, SeverityType } from '@/types';
import { Clock, MapPin } from 'lucide-react';
import { useMemo } from 'react';

const SEVERITY_COLORS: Record<Incident['severity'], { bg: string; text: string; ring: string }> = {
    [SeverityType.CRITICAL]: { bg: 'bg-[#E63946]/15', text: 'text-[#FF4D5C]', ring: 'ring-[#E63946]/50' },
    [SeverityType.URGENT]: { bg: 'bg-[#F59E0B]/15', text: 'text-[#FBBF24]', ring: 'ring-[#F59E0B]/50' },
    [SeverityType.MODERATE]: { bg: 'bg-[#EAB308]/15', text: 'text-[#EAB308]', ring: 'ring-[#EAB308]/50' },
    [SeverityType.RESOLVED]: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', ring: 'ring-emerald-500/50' },
};

export function IncidentHeader({ activeIncident }: {
    activeIncident: Incident;
}) {
    const { theme } = useTheme();
    const { currentTimeText } = useTime();
    const isDark = useMemo(() => theme === 'dark', [theme]);
    const sev = SEVERITY_COLORS[activeIncident.severity];

    return (<div
        className={`px-5 py-4 border-b ${isDark ? 'border-[#2D334A] bg-[#0D101B]/80' : 'border-slate-200 bg-white'
            }`}
    >
        <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider ${sev.bg} ${sev.text} ring-1 ${sev.ring}`}
                    >
                        {activeIncident.severity}
                    </span>
                    <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {activeIncident.id}
                    </span>
                    <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        · {activeIncident.type.toUpperCase()}
                    </span>
                </div>
                <h1
                    className={`text-lg font-black uppercase tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-900'
                        }`}
                >
                    {activeIncident.title}
                </h1>
                <div className={`flex items-center gap-1.5 mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <MapPin className="w-3 h-3" />
                    <span className="font-mono truncate">{activeIncident.location}</span>
                </div>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
                <div className={`flex items-center gap-1.5 text-[11px] font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    <Clock className="w-3 h-3" />
                    <span>OPS {currentTimeText}</span>
                </div>
                <div className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    PRIORITY <span className={`font-bold ${sev.text}`}>{activeIncident.priority}</span>
                </div>
            </div>
        </div>

        <div className={`grid grid-cols-4 gap-2 mt-3 text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <div>
                <div className="opacity-60">CALLER</div>
                <div className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{activeIncident.caller}</div>
            </div>
            <div>
                <div className="opacity-60">DURATION</div>
                <div className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{activeIncident.duration}</div>
            </div>
            <div>
                <div className="opacity-60">LANG</div>
                <div className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{activeIncident.lang}</div>
            </div>
            <div>
                <div className="opacity-60">PANIC</div>
                <div className={`font-bold ${sev.text}`}>{activeIncident.panicLevel}</div>
            </div>
        </div>
    </div>)
}