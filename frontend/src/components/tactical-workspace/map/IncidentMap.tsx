import { Incident } from '@/types';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Map, Marker, Popup, AttributionControl, type MapRef } from 'react-map-gl/mapbox';
import { SVGFallback } from '../fallback/SvgFallback';
import { MapButton } from './MapButton';
import { Crosshair, Layers, Minus, Plus, MapPin, Search, X} from 'lucide-react';

interface IncidentMapProps {
    activeIncident: Incident;
    allIncidents?: Incident[];
    pinColor: string;
    isDark: boolean;
    onSelectIncident?: (incident: Incident) => void;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const MAP_STYLES_DARK = [
    { id: 'mapbox://styles/mapbox/dark-v11', label: 'TACTICAL' },
    { id: 'mapbox://styles/mapbox/satellite-streets-v12', label: 'SATELLITE' },
    { id: 'mapbox://styles/mapbox/navigation-night-v1', label: 'NAV' },
    { id: 'mapbox://styles/mapbox/standard', label: '3D' },
] as const;

const MAP_STYLES_LIGHT = [
    { id: 'mapbox://styles/mapbox/light-v11', label: 'LIGHT' },
    { id: 'mapbox://styles/mapbox/satellite-streets-v12', label: 'SATELLITE' },
    { id: 'mapbox://styles/mapbox/streets-v12', label: 'STREETS' },
    { id: 'mapbox://styles/mapbox/standard', label: '3D' },
] as const;

/**
 * Center panel: tactical map, incident header, timeline, and responder ETA cards.
 * See src/components/guides/TacticalWorkspace.md
 */
// Source by: Qistina
// ─── IncidentMap ────────────────────────────────────────────────────────────
export function IncidentMap({ activeIncident, allIncidents, pinColor, isDark, onSelectIncident }: IncidentMapProps) {
    const mapRef = useRef<MapRef | null>(null);
    const [styleIndex, setStyleIndex] = useState(0);
    const [hoveredIncident, setHoveredIncident] = useState<Incident | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const { lat, lng } = activeIncident.coordinates;

    const styles = isDark ? MAP_STYLES_DARK : MAP_STYLES_LIGHT;
    const currentStyle = styles[styleIndex];

    // Combined list (active + others) for searching
  const searchableIncidents = useMemo(() => {
    const list = allIncidents ?? [];
    return list.some(inc => inc.id === activeIncident.id) ? list : [activeIncident, ...list];
  }, [allIncidents, activeIncident]);
  
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return searchableIncidents.filter(inc =>
      inc.title.toLowerCase().includes(q) ||
      inc.location.toLowerCase().includes(q) ||
      inc.id.toLowerCase().includes(q),
    ).slice(0, 6);}, [searchQuery, searchableIncidents]);
    
  const flyToIncident = useCallback((inc: Incident) => {
    mapRef.current?.flyTo({
      center: [inc.coordinates.lng, inc.coordinates.lat],
      zoom: 16,
      pitch: 40,
      bearing: -18,
      duration: 1000,
      essential: true,
    });
    setHoveredIncident(inc);
    onSelectIncident?.(inc);
  }, [onSelectIncident]);

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

    const handleZoomIn = () => mapRef.current?.zoomIn({ duration: 250 });
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
                                        inc.severity === 'critical' ? 'red' :
                                            inc.severity === 'urgent' ? 'orange' :
                                                inc.severity === 'moderate' ? 'yellow' : 'green',
                                }}
                                title={`${inc.id} · ${inc.title}`}
                            />
                        </Marker>
                    ))}

                {/* Active incident pin */}
                <Marker longitude={lng} latitude={lat} anchor="center">
                    <div className="relative cursor-pointer"
                    onMouseEnter={() => setHoveredIncident(activeIncident)}
                    onMouseLeave={() => setHoveredIncident(curr => (curr?.id === activeIncident.id ? null : curr))}
                    >
                        <div className="absolute -inset-7 rounded-full animate-ping pointer-events-none"
                        style={{ backgroundColor: 'red', opacity: 0.35 }} 
                        />
                        <div className="relative w-5 h-5 rounded-full ring-2 bg-stone-500 shadow-2xl flex items-center justify-center"
                        style={{ backgroundColor: 'darkred' }} 
                        >
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold whitespace-nowrap pointer-events-none"
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

                        {/* Hover detail popup */}
                        {hoveredIncident && (
                          <Popup
                            longitude={hoveredIncident.coordinates.lng}
                            latitude={hoveredIncident.coordinates.lat}
                            anchor="bottom"
                            offset={18}
                            closeButton={false}
                            closeOnClick={false}
                            className={`incident-hover-popup ${isDark ? 'incident-hover-popup-dark' : 'incident-hover-popup-light'}`}
                          >
                            <div
                              className={`min-w-45 max-w-105 text-[15px] font-mono p-3 rounded ${
                                isDark ? 'text-slate-200' : 'text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                <span
                                  className="inline-block w-2 h-2 rounded-full shrink-0"
                                  style={{
                                    backgroundColor:
                                      hoveredIncident.severity === 'critical' ? '#E63946' :
                                      hoveredIncident.severity === 'urgent'   ? '#F59E0B' :
                                      hoveredIncident.severity === 'moderate' ? '#EAB308' : '#10B981',
                                  }}
                                />
                                <span className="font-bold uppercase tracking-wide">{hoveredIncident.title}</span>
                              </div>
                              <div className="opacity-70 flex items-center gap-1 mb-0.5">
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span className="font-bold uppercase tracking-wide">{hoveredIncident.location}</span>
                              </div>
                              <div className="flex items-center justify-between opacity-90">
                                <span className="uppercase">{hoveredIncident.severity}</span>
                                <span className="opacity-60">{hoveredIncident.id}</span>
                              </div>
                            </div>
                          </Popup>
                        )}
                
                        <AttributionControl position="bottom-left" compact />
                      </Map>
                
                      {/* Search box */}
                      <div className="absolute top-5 right-3 z-10 flex flex-col items-end gap-1.5">
                        <div className="flex items-center">
                          {searchOpen && (
                            <div className="relative">
                              <input
                                autoFocus
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' && searchResults[0]) flyToIncident(searchResults[0]);
                                  if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); }
                                }}
                                placeholder="Search by name or location…"
                                className={`w-56 px-3 py-2 rounded-md text-xs font-mono backdrop-blur-md outline-none ${
                                  isDark
                                    ? 'bg-black/70 text-slate-200 placeholder-slate-500 border border-[#2D334A] focus:border-cyan-500/50'
                                    : 'bg-white/90 text-slate-800 placeholder-slate-400 border border-slate-300 focus:border-cyan-500'
                                }`}
                              />
                
                              {searchResults.length > 0 && (
                                <div
                                  className={`absolute top-full mt-1 w-56 max-h-56 overflow-y-auto rounded-md backdrop-blur-md z-30 ${
                                    isDark ? 'bg-black/85 border border-[#2D334A]' : 'bg-white/95 border border-slate-300'
                                  }`}
                                >
                                  {searchResults.map(inc => (
                                    <button
                                      key={inc.id}
                                      type="button"
                                      onClick={() => { flyToIncident(inc); setSearchOpen(false); setSearchQuery(''); }}
                                      className={`w-full text-left px-3 py-2 text-[10px] font-mono border-b last:border-b-0 transition-colors ${
                                        isDark
                                          ? 'border-[#2D334A] text-slate-300 hover:bg-white/5'
                                          : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                                      }`}
                                    >
                                      <div className="font-bold truncate">{inc.title}</div>
                                      <div className="opacity-60 truncate flex items-center gap-1">
                                        <MapPin className="w-2.5 h-2.5 shrink-0" />
                                        {inc.location}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                
                          <MapButton
                            onClick={() => {
                              if (searchOpen) { setSearchOpen(false); setSearchQuery(''); }
                              else setSearchOpen(true);
                            }}
                            isDark={isDark}
                            title={searchOpen ? 'Close search' : 'Search incidents'}
                          >
                            {searchOpen ? <X className="w-3.5 h-3.5" /> : <Search className="w-3.5 h-3.5" />}
                          </MapButton>
                        </div>
                      </div>
                      
            {/* Custom map controls */}
            <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-10">
                <MapButton onClick={handleZoomIn} isDark={isDark} title="oom in">
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