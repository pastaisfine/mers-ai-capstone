'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Map, Marker, AttributionControl, type MapRef } from 'react-map-gl/mapbox';
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

/**
 * Center panel: tactical map, incident header, timeline, and responder ETA cards.
 * See src/components/guides/TacticalWorkspace.md
 */

// ─── IncidentMap ────────────────────────────────────────────────────────────

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const MAP_STYLES_DARK = [
  { id: 'mapbox://styles/mapbox/dark-v11',      label: 'TACTICAL' },
  { id: 'mapbox://styles/mapbox/satellite-streets-v12', label: 'SATELLITE' },
  { id: 'mapbox://styles/mapbox/navigation-night-v1',   label: 'NAV' },
  { id: 'mapbox://styles/mapbox/standard',          label: '3D'},
] as const;

const MAP_STYLES_LIGHT = [
  { id: 'mapbox://styles/mapbox/light-v11',     label: 'LIGHT' },
  { id: 'mapbox://styles/mapbox/satellite-streets-v12', label: 'SATELLITE' },
  { id: 'mapbox://styles/mapbox/streets-v12',   label: 'STREETS' },
  { id: 'mapbox://styles/mapbox/standard',     label: '3D' },
] as const;

interface IncidentMapProps {
  activeIncident: Incident;
  allIncidents?: Incident[];
  pinColor: string;
  isDark: boolean;
}

function IncidentMap({ activeIncident, allIncidents, pinColor, isDark }: IncidentMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [styleIndex, setStyleIndex] = useState(0);
  const { lat, lng } = activeIncident.coordinates;

  const styles = isDark ? MAP_STYLES_DARK : MAP_STYLES_LIGHT;
  const currentStyle = styles[styleIndex];

  // Re-center when active incident changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: [lng, lat],
      zoom: 15,
      pitch: 40,
      bearing: -18,
      duration: 1400,
      essential: true,
    });
  }, [lat, lng]);

  if (!MAPBOX_TOKEN) {
    return <SVGFallback activeIncident={activeIncident} pinColor={pinColor} isDark={isDark} />;
  }

  const handleZoomIn  = () => mapRef.current?.zoomIn({ duration: 250 });
  const handleZoomOut = () => mapRef.current?.zoomOut({ duration: 250 });
  const handleCycleStyle = () => setStyleIndex(i => (i + 1) % styles.length);
  const handleRecenter = () =>
    mapRef.current?.flyTo({ center: [lng, lat], zoom: 15, pitch: 40, bearing: -18, duration: 700 });

  return (
    <div className="absolute inset-0">
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom: 15,
          pitch: 40,
          bearing: -18,
        }}
        mapStyle={currentStyle.id}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        reuseMaps
      >
        {/* Other incidents (smaller, dimmer) */}
        {allIncidents
          ?.filter(inc => inc.id !== activeIncident.id)
          .map(inc => (
            <Marker
              key={inc.id}
              longitude={inc.coordinates.lng}
              latitude={inc.coordinates.lat}
              anchor="center"
            >
              <div
                className="w-3 h-2.5 rounded-full ring-1 ring-black-400 opacity-70 hover:opacity-50 transition-opacity"
                style={{
                  backgroundColor:
                    inc.severity === 'CRITICAL' ? 'red' :
                    inc.severity === 'URGENT'   ? 'orange' :
                    inc.severity === 'MODERATE' ? 'yellow' : 'green',
                }}
                title={`${inc.id} · ${inc.title}`}
              />
            </Marker>
          ))}

        {/* Active incident pin */}
        <Marker longitude={lng} latitude={lat} anchor="center">
          <div className="relative pointer-events-none">
            <div
              className="absolute -inset-7 rounded-full animate-ping"
              style={{ backgroundColor: 'red', opacity: 0.35 }} 
            />
            <div
              className="relative w-5 h-5 rounded-full ring-2 bg-stone-500 shadow-2xl flex items-center justify-center"
              style={{ backgroundColor: 'darkred' }} 
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold whitespace-nowrap"
              style={{
                backgroundColor: 'rgba(13, 16, 27, 0.95)',
                color: 'white',
                borderLeft: `2px solid ${pinColor}`,
              }}
            >
              {activeIncident.id}
            </div>
          </div>
        </Marker>

        <AttributionControl position="bottom-left" compact />
      </Map>

      {/* Custom map controls */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-10">
        <MapButton onClick={handleZoomIn} isDark={isDark} title="Zoom in">
          <Plus className="w-3.5 h-3.5" />
        </MapButton>
        <MapButton onClick={handleZoomOut} isDark={isDark} title="Zoom out">
          <Minus className="w-3.5 h-3.5" />
        </MapButton>
        <MapButton onClick={handleCycleStyle} isDark={isDark} title={`Cycle style (${currentStyle.label})`}>
          <Layers className="w-3.5 h-3.5" />
        </MapButton>
        <MapButton onClick={handleRecenter} isDark={isDark} title="Recenter on incident">
          <Crosshair className="w-3.5 h-3.5" />
        </MapButton>
      </div>

      {/* Style indicator */}
      <div
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[9px] font-mono font-bold tracking-widest pointer-events-none ${
          isDark ? 'bg-black/60 text-cyan-400 ring-1 ring-cyan-500/30' : 'bg-white/80 text-cyan-700 ring-1 ring-cyan-500/40'
        }`}
      >
        {currentStyle.label} · MAPBOX
      </div>
    </div>
  );
}

interface MapButtonProps {
  onClick: () => void;
  isDark: boolean;
  title: string;
  children: React.ReactNode;
}

function MapButton({ onClick, isDark, title, children }: MapButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-md backdrop-blur-md transition-colors cursor-pointer ${
        isDark
          ? 'bg-black/60 text-slate-300 border border-[#2D334A] hover:bg-black/80 hover:text-white'
          : 'bg-white/80 text-slate-700 border border-slate-300 hover:bg-white'
      }`}
    >
      {children}
    </button>
  );
}

interface SVGFallbackProps {
  activeIncident: Incident;
  pinColor: string;
  isDark: boolean;
}

function SVGFallback({ activeIncident, pinColor, isDark }: SVGFallbackProps) {
  const { x, y } = activeIncident.coordinates;

  const roads = useMemo(
    () => [
      'M 0 80 Q 120 60 250 110 T 500 130',
      'M 0 200 Q 150 240 300 200 T 500 220',
      'M 80 0 Q 120 120 90 220 T 110 300',
      'M 340 0 Q 320 100 360 180 T 380 300',
    ],
    [],
  );

  const buildings = useMemo(
    () => [
      { x: 40, y: 30, w: 28, h: 18 }, { x: 110, y: 50, w: 22, h: 14 },
      { x: 180, y: 30, w: 36, h: 22 }, { x: 300, y: 60, w: 26, h: 18 },
      { x: 410, y: 40, w: 30, h: 16 }, { x: 60, y: 240, w: 24, h: 18 },
      { x: 200, y: 250, w: 28, h: 16 }, { x: 340, y: 240, w: 36, h: 22 },
      { x: 430, y: 250, w: 24, h: 18 },
    ],
    [],
  );

  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(rgba(45, 51, 74, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(45, 51, 74, 0.5) 1px, transparent 1px)'
            : 'linear-gradient(rgba(148, 163, 184, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.4) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <svg viewBox="0 0 500 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="pinPulseSvg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={pinColor} stopOpacity="0.6" />
            <stop offset="100%" stopColor={pinColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        {roads.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={isDark ? '#1E2435' : '#CBD5E1'} strokeWidth={i < 2 ? 6 : 3} strokeLinecap="round" />
        ))}
        {buildings.map((b, i) => (
          <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill={isDark ? '#11162A' : '#E2E8F0'} stroke={isDark ? '#2D334A' : '#CBD5E1'} strokeWidth={0.5} rx="1" />
        ))}

        <circle cx={x} cy={y} r="40" fill="url(#pinPulseSvg)">
          <animate attributeName="r" values="20;40;20" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0.1;0.9" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx={x} cy={y} r="8" fill={pinColor} stroke="white" strokeWidth="2" />
        <circle cx={x} cy={y} r="3" fill="white" />

        <line x1="0"   y1={y} x2="500" y2={y}   stroke={pinColor} strokeWidth="0.3" strokeDasharray="2 4" opacity="0.4" />
        <line x1={x} y1="0"   x2={x} y2="300" stroke={pinColor} strokeWidth="0.3" strokeDasharray="2 4" opacity="0.4" />
      </svg>

      <div
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[9px] font-mono font-bold tracking-widest pointer-events-none ${
          isDark ? 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/40' : 'bg-amber-50 text-amber-700 ring-1 ring-amber-300'
        }`}
      >
        ⚠ NEXT_PUBLIC_MAPBOX_TOKEN MISSING · SVG FALLBACK
      </div>
    </div>
  );
}

// ─── TacticalWorkspace ──────────────────────────────────────────────────────

export interface TacticalWorkspaceProps {
  activeIncident: Incident;
  theme: 'dark' | 'light';
  currentTimeText: string;
  allIncidents?: Incident[];
}

const SEVERITY_COLORS: Record<Incident['severity'], { bg: string; text: string; ring: string; pin: string }> = {
  CRITICAL: { bg: 'bg-[#E63946]/15', text: 'text-[#FF4D5C]', ring: 'ring-[#E63946]/50', pin: '#E63946' },
  URGENT:   { bg: 'bg-[#F59E0B]/15', text: 'text-[#FBBF24]', ring: 'ring-[#F59E0B]/50', pin: '#F59E0B' },
  MODERATE: { bg: 'bg-[#EAB308]/15', text: 'text-[#EAB308]', ring: 'ring-[#EAB308]/50', pin: '#EAB308' },
  RESOLVED: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', ring: 'ring-emerald-500/50', pin: '#10B981' },
};

export function TacticalWorkspace({
  activeIncident,
  theme,
  currentTimeText,
  allIncidents,
}: TacticalWorkspaceProps) {
  const isDark = theme === 'dark';
  const sev = SEVERITY_COLORS[activeIncident.severity];
  const { lat, lng } = activeIncident.coordinates;

  return (
    <section
      className={`flex-1 flex flex-col overflow-hidden min-w-0 border-l border-r ${
        isDark ? 'border-[#2D334A] bg-[#0A0E16]' : 'border-slate-200 bg-slate-50'
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
                · {activeIncident.type.toUpperCase()}
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
      </div>

      {/* ============ Map ============ */}
      <div
        className={`relative flex-1 overflow-hidden ${
          isDark ? 'bg-[#06080E]' : 'bg-slate-100'
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
          <div
            className={`px-2.5 py-1.5 rounded-md backdrop-blur-md text-[10px] font-mono ${
              isDark ? 'bg-black/60 text-emerald-400 border border-emerald-500/30' : 'bg-white/80 text-emerald-700 border border-emerald-500/40'
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

          <div
            className={`px-2.5 py-1.5 rounded-md backdrop-blur-md text-[10px] font-mono ${
              isDark ? 'bg-black/60 text-slate-300 border border-[#2D334A]' : 'bg-white/80 text-slate-700 border border-slate-300'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>AI CONFIDENCE</span>
              <span className="font-bold text-cyan-400">{activeIncident.confidence}%</span>
            </div>
          </div>
        </div>

        {/* Contradiction warning banner */}
        {activeIncident.contradiction && (
          <div className="absolute top-3 right-3 max-w-xs pointer-events-none z-10">
            <div className="px-3 py-2 rounded-md bg-red-950/80 backdrop-blur-md border border-red-500/50 text-[10px] font-mono text-red-200 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
              <span className="leading-relaxed">{activeIncident.contradiction}</span>
            </div>
          </div>
        )}
      </div>

      {/* ============ Timeline + Responder ============ */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-5 gap-0 border-t ${
          isDark ? 'border-[#2D334A] bg-[#0D101B]' : 'border-slate-200 bg-white'
        }`}
      >
        {/* Timeline */}
        <div
          className={`lg:col-span-3 p-3 border-b lg:border-b-0 lg:border-r ${
            isDark ? 'border-[#2D334A]' : 'border-slate-200'
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
                className={`flex gap-2 leading-relaxed ${
                  entry.isAlert
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

        {/* Responder card */}
        <div className="lg:col-span-2 p-3">
          <h3 className={`text-[10px] font-mono font-bold tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Ambulance className="inline w-3 h-3 mr-1" />
            NEAREST RESPONDER
          </h3>
          <div
            className={`p-2.5 rounded-md border ${
              isDark
                ? 'bg-[#11162A] border-[#2D334A]'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className={`text-xs font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {activeIncident.responder.name}
              </h4>
              <span
                className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                  activeIncident.responder.status === 'DISPATCHED'
                    ? 'bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/40'
                    : 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/40'
                }`}
              >
                {activeIncident.responder.status}
              </span>
            </div>
            <p className={`text-[10px] mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {activeIncident.responder.type}
            </p>
            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
              <div>
                <div className={isDark ? 'text-slate-500' : 'text-slate-400'}>DISTANCE</div>
                <div className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {activeIncident.responder.distance}
                </div>
              </div>
              <div>
                <div className={isDark ? 'text-slate-500' : 'text-slate-400'}>ETA</div>
                <div className="font-bold text-emerald-400">{activeIncident.responder.eta}</div>
              </div>
              <div>
                <div className={isDark ? 'text-slate-500' : 'text-slate-400'}>PARAMEDIC</div>
                <div className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {activeIncident.responder.paramedic ?? '—'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
