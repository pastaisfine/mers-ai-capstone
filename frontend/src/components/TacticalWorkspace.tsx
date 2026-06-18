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
} from 'lucide-react';
import type { Incident } from '../types';
import { IncidentMap } from './tactical-workspace/map/IncidentMap';
import { ResponderCard } from './tactical-workspace/ResponderCard';
import { TimelineCard } from './tactical-workspace/TimelineCard';
import { ContradictionCard } from './tactical-workspace/ContradictionCard';
import { AiConfidenceCard } from './tactical-workspace/AiConfidenceCard';
import { GpsTriangulationCard } from './tactical-workspace/GpsTriangulationCard';
import { useIncident } from '@/context/incident/useIncident';

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
  const { incidents: allIncidents, activeIncident } = useIncident();
  const isDark = theme === 'dark';
  const { lat, lng } = activeIncident.coordinates;
  const sev = SEVERITY_COLORS[activeIncident.severity];


  return (
    <section
      className={`flex-1 flex flex-col overflow-hidden min-w-0 border-l border-r ${isDark ? 'border-[#2D334A] bg-[#0A0E16]' : 'border-slate-200 bg-slate-50'
        }`}
    >
      {/* ============ Incident header ============ */}


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
        />

        {/* HUD overlays */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none z-10">
          <GpsTriangulationCard lat={lat} lng={lng} />
          <AiConfidenceCard activeIncident={activeIncident} />
        </div>

        {/* Contradiction warning banner */}
        {activeIncident.contradiction && (
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
