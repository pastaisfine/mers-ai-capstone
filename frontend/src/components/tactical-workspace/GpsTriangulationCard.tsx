import { useTheme } from '@/context/theme/useTheme';
import { Signal } from 'lucide-react';
import { useMemo } from 'react';

export function GpsTriangulationCard({ lat, lng }: { lat: number; lng: number }) {
    const { theme } = useTheme();
    const isDark = useMemo(() => theme === 'dark', [theme]);
    return <div
        className={`px-2.5 py-1.5 rounded-md backdrop-blur-md text-[10px] font-mono ${isDark ? 'bg-black/60 text-emerald-400 border border-emerald-500/30' : 'bg-white/80 text-emerald-700 border border-emerald-500/40'
            }`}
    >
        <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3" />
            <span className="font-bold tracking-wider">TRIANGULATION LOCKED</span>
        </div>
        <div className={`mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            GPS {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
        </div>
    </div>
}