import { useTheme } from '@/context/theme/useTheme';
import { Incident } from '@/types';
import { Ambulance } from 'lucide-react';
import { useMemo } from 'react';

export function ResponderCard({ activeIncident }: { activeIncident: Incident }) {
    const { theme } = useTheme();
    const isDark = useMemo(() => theme === 'dark', [theme]);

    return (
        <div className="lg:col-span-2 p-3">
            <h3 className={`text-[10px] font-mono font-bold tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Ambulance className="inline w-3 h-3 mr-1" />
                NEAREST RESPONDER
            </h3>
            <div
                className={`p-2.5 rounded-md border ${isDark
                    ? 'bg-[#11162A] border-[#2D334A]'
                    : 'bg-slate-50 border-slate-200'
                    }`}
            >
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`text-xs font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {activeIncident?.responder.name}
                    </h4>
                    <span
                        className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${activeIncident?.responder.status === 'DISPATCHED'
                            ? 'bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/40'
                            : 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/40'
                            }`}
                    >
                        {activeIncident?.responder.status}
                    </span>
                </div>
                <p className={`text-[10px] mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {activeIncident?.responder.type}
                </p>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                    <div>
                        <div className={isDark ? 'text-slate-500' : 'text-slate-400'}>DISTANCE</div>
                        <div className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            {activeIncident?.responder.distance}
                        </div>
                    </div>
                    <div>
                        <div className={isDark ? 'text-slate-500' : 'text-slate-400'}>ETA</div>
                        <div className="font-bold text-emerald-400">{activeIncident?.responder.eta}</div>
                    </div>
                    <div>
                        <div className={isDark ? 'text-slate-500' : 'text-slate-400'}>PARAMEDIC</div>
                        <div className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            {activeIncident?.responder.paramedic ?? '—'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}