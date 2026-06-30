import { MapPin } from 'lucide-react';
import { timeAgo } from '@/lib/utils';
import { Incident, SeverityType } from '@/types';

export function ActiveIncidentsListBox({ incident, onClick, selected} : { incident: Incident; onClick: () => void; selected: boolean }) {

    const getStatusColor = (severity: SeverityType) => {
        switch (severity) {
            case SeverityType.CRITICAL: return 'bg-red-500';
            case SeverityType.URGENT: return 'bg-orange-500';
            case SeverityType.MODERATE: return 'bg-blue-500';
            case SeverityType.RESOLVED: return 'bg-gray-500';
            };
        };

    return (

        <div className={`m-2 p-4 rounded-lg border cursor-pointer transition-all duration-200 text-left shadow-sm ${selected ? 'border-[#E63946] bg-red-50/50' : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'} `}
        
            key={incident.id}
            onClick={onClick}
            >
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono font-bold text-slate-500">{incident.id}</span>
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wider uppercase ${getStatusColor(incident.severity)} text-white`}>{incident.severity}</span>
            </div>
                <p className="text-sm font-extrabold tracking-light leading-snug mb-1 text-slate-900 uppercase">{incident.title}</p>
            <div className="flex items-center gap-1 mb-3.5">
                <MapPin className="inline-block w-3.5 h-3.5 text-slate-400"/>
                <p className="text-xs left-0 truncate text-slate-500">{incident.location}</p>
            </div>
            <div className="flex justify-between items-center gap-2">
                <p className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">{incident.lang}</p>
                <p className="text-[9px] font-mono font-medium ml-auto text-slate-400">{timeAgo(incident.occurDateTime)}</p>
            </div>
        </div>

    );
}