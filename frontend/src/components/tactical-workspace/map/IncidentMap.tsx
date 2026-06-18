import { Incident } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { Map, Marker, AttributionControl, type MapRef } from 'react-map-gl/mapbox';
import { SVGFallback } from '../fallback/SvgFallback';
import { MapButton } from './MapButton';
import { Crosshair, Layers, Minus, Plus } from 'lucide-react';

interface IncidentMapProps {
    activeIncident: Incident;
    allIncidents?: Incident[];
    pinColor: string;
    isDark: boolean;
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
export function IncidentMap({ activeIncident, allIncidents, pinColor, isDark }: IncidentMapProps) {
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
                className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[9px] font-mono font-bold tracking-widest pointer-events-none ${isDark ? 'bg-black/60 text-cyan-400 ring-1 ring-cyan-500/30' : 'bg-white/80 text-cyan-700 ring-1 ring-cyan-500/40'
                    }`}
            >
                {currentStyle.label} · MAPBOX
            </div>
        </div>
    );
}