'use client';

import { useEffect, useRef, useState } from 'react';
import { Source, Layer, Marker } from 'react-map-gl/mapbox';
import { Ambulance } from 'lucide-react';

interface LatLng {
  lat: number;
  lng: number;
}

interface RouteLayerProps {
  origin: LatLng; // dispatch center
  destination: LatLng; // incident location
  mapboxToken: string;
  isDark: boolean;
  color?: string;
  /**
   * If you have a REAL live GPS feed for the responding unit, pass its
   * position here and it will be used instead of the simulated animation.
   * Update this on whatever cadence your tracking feed provides (e.g. every
   * few seconds via websocket/polling).
   */
  liveResponderPosition?: LatLng | null;
  /** Simulated end-to-end travel time for the animated fallback, in seconds */
  simulatedEtaSeconds?: number;
}

interface RouteData {
  coordinates: [number, number][]; // [lng, lat][]
  distanceMeters: number;
  durationSeconds: number;
}

/**
 * Draws a driving route from the dispatch center to the incident, plus a
 * responder marker that moves along it.
 *
 * Tracking modes:
 *  - If `liveResponderPosition` is provided, the marker snaps to that real
 *    position (recommended once you have actual unit GPS).
 *  - Otherwise it animates smoothly along the fetched route as a stand-in,
 *    so the UI is fully functional before live GPS is wired up.
 */
export function RouteLayer({
  origin,
  destination,
  mapboxToken,
  isDark,
  color = '#22D3EE',
  liveResponderPosition = null,
  simulatedEtaSeconds = 240,
}: RouteLayerProps) {
  const [route, setRoute] = useState<RouteData | null>(null);
  const [simPosition, setSimPosition] = useState<LatLng | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  // Fetch the driving route whenever origin/destination change
  useEffect(() => {
    let cancelled = false;

    async function fetchRoute() {
      const coordsStr = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsStr}?geometries=geojson&overview=full&access_token=${mapboxToken}`;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Directions request failed (${res.status})`);
        const data = await res.json();
        const leg = data.routes?.[0];
        if (!leg || cancelled) return;

        setRoute({
          coordinates: leg.geometry.coordinates,
          distanceMeters: leg.distance,
          durationSeconds: leg.duration,
        });
      } catch (err) {
        console.error('[RouteLayer] failed to fetch directions:', err);
      }
    }

    fetchRoute();
    return () => {
      cancelled = true;
    };
  }, [origin.lat, origin.lng, destination.lat, destination.lng, mapboxToken]);

  // Simulated animation along the route (used only when no live GPS is fed in)
  useEffect(() => {
    if (liveResponderPosition || !route || route.coordinates.length < 2) return;

    const durationMs = (simulatedEtaSeconds ?? route.durationSeconds ?? 240) * 1000;

    function step(ts: number) {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(elapsed / durationMs, 1);

      const pos = positionAlongRoute(route!.coordinates, t);
      setSimPosition(pos);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    }

    startRef.current = null;
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [route, liveResponderPosition, simulatedEtaSeconds]);

  const responderPosition = liveResponderPosition ?? simPosition;

  return (
    <>
      {route && (
        <Source
          id="responder-route"
          type="geojson"
          data={{
            type: 'Feature',
            properties: {},
            geometry: { type: 'LineString', coordinates: route.coordinates },
          }}
        >
          <Layer
            id="responder-route-line"
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{
              'line-color': color,
              'line-width': 3,
              'line-opacity': isDark ? 0.85 : 0.75,
              'line-dasharray': [0.2, 1.5],
            }}
          />
        </Source>
      )}

      {/* Dispatch center marker */}
      <Marker longitude={origin.lng} latitude={origin.lat} anchor="center">
        <div
          className="w-3.5 h-3.5 rounded-sm ring-2 ring-white/70 shadow-lg"
          style={{ backgroundColor: color }}
          title="Dispatch center"
        />
      </Marker>

      {/* Responder marker, live or simulated */}
      {responderPosition && (
        <Marker longitude={responderPosition.lng} latitude={responderPosition.lat} anchor="center">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shadow-xl ring-2 ring-white/80"
            style={{ backgroundColor: color }}
            title={liveResponderPosition ? 'Responder (live)' : 'Responder (estimated)'}
          >
            <Ambulance className="w-4 h-4 text-black/80" />
          </div>
        </Marker>
      )}
    </>
  );
}

/**
 * Interpolate a point along a route's coordinate list at fraction t (0-1),
 * walking distance-proportionally rather than just index-proportionally so
 * the motion speed looks consistent across segments of different length.
 */
function positionAlongRoute(coords: [number, number][], t: number): LatLng {
  if (coords.length === 1) {
    return { lng: coords[0][0], lat: coords[0][1] };
  }

  const segmentLengths: number[] = [];
  let total = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const d = haversine(coords[i], coords[i + 1]);
    segmentLengths.push(d);
    total += d;
  }

  const target = total * t;
  let acc = 0;

  for (let i = 0; i < segmentLengths.length; i++) {
    if (acc + segmentLengths[i] >= target || i === segmentLengths.length - 1) {
      const segT = segmentLengths[i] === 0 ? 0 : (target - acc) / segmentLengths[i];
      const [lng1, lat1] = coords[i];
      const [lng2, lat2] = coords[i + 1];
      return {
        lng: lng1 + (lng2 - lng1) * segT,
        lat: lat1 + (lat2 - lat1) * segT,
      };
    }
    acc += segmentLengths[i];
  }

  const last = coords[coords.length - 1];
  return { lng: last[0], lat: last[1] };
}

function haversine([lng1, lat1]: [number, number], [lng2, lat2]: [number, number]): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}