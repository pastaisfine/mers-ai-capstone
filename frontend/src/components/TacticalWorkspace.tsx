'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import {
  MapPin,
  Radio,
  Clock,
  Ambulance,
  AlertTriangle,
  Activity,
  Signal,
  Plus,
  Minus,
  Layers,
  Crosshair,
} from 'lucide-react';
import type { Incident } from '../types';
import { IncidentMap } from './tactical-workspace/map/IncidentMap';
import { ResponderCard } from './tactical-workspace/ResponderCard';
import { TimelineCard } from './tactical-workspace/TimelineCard';
import { ContradictionCard } from './tactical-workspace/ContradictionCard';
import { AiConfidenceCard } from './tactical-workspace/AiConfidenceCard';
import { GpsTriangulationCard } from './tactical-workspace/GpsTriangulationCard';
import { useIncident } from '@/context/incident/useIncident';
import { useLocationAgent } from '@/hooks/useLocationAgent';

// ─── TacticalWorkspace ──────────────────────────────────────────────────────
export interface TacticalWorkspaceProps {
  theme: 'dark' | 'light';
}

const SEVERITY_COLORS: Record<Incident['severity'], { bg: string; text: string; ring: string; pin: string }> = {
  critical: { bg: 'bg-[#E63946]/15', text: 'text-[#FF4D5C]', ring: 'ring-[#E63946]/50', pin: '#E63946' },
  urgent: { bg: 'bg-[#F59E0B]/15', text: 'text-[#FBBF24]', ring: 'ring-[#F59E0B]/50', pin: '#F59E0B' },
  moderate: { bg: 'bg-[#EAB308]/15', text: 'text-[#EAB308]', ring: 'ring-[#EAB308]/50', pin: '#EAB308' },
  resolved: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', ring: 'ring-emerald-500/50', pin: '#10B981' },
};

export function TacticalWorkspace({
  theme,
}: TacticalWorkspaceProps) {
  const { incidents: allIncidents, activeIncident, setIncidents } = useIncident();
  const isDark = theme === 'dark';
  const lat = activeIncident?.coordinates?.lat
  const lng = activeIncident?.coordinates?.lng
  const sev = activeIncident?.severity ? SEVERITY_COLORS[activeIncident.severity] : SEVERITY_COLORS.moderate;

  // Your Incident.transcript is an array of { time, speaker, text } entries
  // (see data/initialIncident.ts), so flatten it into plain text for the agent.
  // If your transcript grows live (e.g. via Supabase realtime), this recomputes
  // automatically each time a new entry is appended.
  const liveTranscript = (activeIncident?.transcript ?? [])
    .map((t) => `${t.speaker}: ${t.text}`)
    .join('\n');

  const { isDetecting: isLocating } = useLocationAgent({
    incidentId: activeIncident?.id ?? '',
    transcript: liveTranscript,
    enabled: Boolean(activeIncident?.id) && !activeIncident?.coordinates,
    onLocated: (result) => {
      if (!result.coordinates || !activeIncident) return;
      setIncidents(prev =>
        prev.map(inc =>
          inc.id === activeIncident.id
            ? { ...inc, coordinates: result.coordinates! }
            : inc
        )
      );
    },
  });


  return (
    <section
      className={`flex-1 flex flex-col overflow-hidden min-w-0 border-l border-r ${isDark ? 'border-[#2D334A] bg-[#0A0E16]' : 'border-slate-200 bg-slate-50'
        }`}
    >
      {/* ============ Incident header ============ */}
      <div
        className={`px-5 py-4 border-b ${
          isDark ? 'border-[#2D334A] bg-[#0D101B]/80' : 'border-slate-200 bg-white'
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
                · {activeIncident?.type?.toUpperCase()}
              </span>
            </div>
            <h1
              className={`text-lg font-black uppercase tracking-tight truncate ${
                isDark ? 'text-white' : 'text-slate-900'
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
              <span>OPS</span>
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
      </div>


      {/* ============ Map ============ */}
      <div
        className={`relative flex-1 overflow-hidden ${isDark ? 'bg-[#06080E]' : 'bg-slate-100'
          }`}
      >
        <IncidentMap
          activeIncident={activeIncident}
          allIncidents={allIncidents}
          pinColor={sev.pin}
          isDark={isDark}
          onSelectIncident={useIncident}
          isLocating={isLocating}
        />

        {/* HUD overlays */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none z-10">
          {lat && lng && <GpsTriangulationCard lat={lat} lng={lng} />}
          <AiConfidenceCard activeIncident={activeIncident} />
        </div>

        {/* Contradiction warning banner */}
        {activeIncident?.contradiction && (
          <ContradictionCard activeIncident={activeIncident} />
        )}
      </div>

      {/* ============ Timeline + Responder ============ */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-5 gap-0 border-t ${isDark ? 'border-[#2D334A] bg-[#0D101B]' : 'border-slate-200 bg-white'
          }`}
      >
        <TimelineCard activeIncident={activeIncident} />
        <ResponderCard activeIncident={activeIncident} />
      </div>
    </section>
  );
}