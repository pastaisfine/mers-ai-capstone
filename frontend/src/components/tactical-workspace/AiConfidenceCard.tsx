import { useTheme } from '@/context/theme/useTheme';
import { Incident } from '@/types';
import { Activity } from 'lucide-react';
import { useMemo } from 'react';

export function AiConfidenceCard({
    activeIncident,
}: {
    activeIncident: Incident;
}) {
    const { theme } = useTheme();
    const isDark = useMemo(() => theme === 'dark', [theme]);

    return (<div
        className={`px-2.5 py-1.5 rounded-md backdrop-blur-md text-[10px] font-mono ${isDark ? 'bg-black/60 text-slate-300 border border-[#2D334A]' : 'bg-white/80 text-slate-700 border border-slate-300'
            }`}
    >
        <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span>AI CONFIDENCE</span>
            <span className="font-bold text-cyan-400">{activeIncident.confidence}%</span>
        </div>
    </div>)
}