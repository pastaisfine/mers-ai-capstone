import { useTheme } from '@/context/theme/useTheme';
import { Incident } from '@/types';
import { Radio } from 'lucide-react';
import { useMemo } from 'react';

export function TimelineCard({ activeIncident }: {
    activeIncident: Incident;
}) {
    const { theme } = useTheme();
    const isDark = useMemo(() => theme === 'dark', [theme]);

    return <div
        className={`lg:col-span-3 p-3 border-b lg:border-b-0 lg:border-r ${isDark ? 'border-[#2D334A]' : 'border-slate-200'
            }`}
    >
        <div className="flex items-center justify-between mb-2">
            <h3 className={`text-[10px] font-mono font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Radio className="inline w-3 h-3 mr-1" />
                EVENT TIMELINE
            </h3>
            <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {activeIncident.timeline.length} events
            </span>
        </div>
        <ul className="space-y-1 text-[11px] font-mono max-h-28 overflow-y-auto pr-1">
            {activeIncident.timeline.map((entry, i) => (
                <li
                    key={i}
                    className={`flex gap-2 leading-relaxed ${entry.isAlert
                        ? 'text-red-400'
                        : isDark
                            ? 'text-slate-300'
                            : 'text-slate-700'
                        }`}
                >
                    <span className={`shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {entry.time}
                    </span>
                    <span className={`shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>—</span>
                    <span className="truncate">{entry.event}</span>
                </li>
            ))}
        </ul>
    </div>
}
