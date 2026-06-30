import { Incident } from '@/types';
import { AlertTriangle } from 'lucide-react';

export function ContradictionCard({ activeIncident }: { activeIncident: Incident }) {
    return (<div className="absolute top-3 right-3 max-w-xs pointer-events-none z-10">
        <div className="px-3 py-2 rounded-md bg-red-950/80 backdrop-blur-md border border-red-500/50 text-[10px] font-mono text-red-200 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
            <span className="leading-relaxed">{activeIncident.contradiction}</span>
        </div>
    </div>)
}