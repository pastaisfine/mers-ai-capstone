"use client"

import "mapbox-gl/dist/mapbox-gl.css"
import { useMemo, useState, createContext, useContext } from "react"
import { useTheme } from "next-themes"
import { useIncident } from "@/context/incident/useIncident"
import { IncidentMap } from "./map/IncidentMap"
import { DispatchModal } from "./dispatch-modal"
import { SeverityType, type Incident } from "@/types"

const SEVERITY_PIN: Record<Incident["severity"], string> = {
  critical: "#E63946",
  urgent: "#F59E0B",
  moderate: "#3280FA",
  resolved: "#49D5A4",
}

interface MapPreviewCtx {
  setPreviewCoords: (coords: { lat: number; lng: number } | null) => void
}

export const MapPreviewContext = createContext<MapPreviewCtx>({ setPreviewCoords: () => { } })

export function useMapPreview() {
  return useContext(MapPreviewContext)
}

export function MapPanel() {
  const { theme } = useTheme()
  const { incidents, activeIncident } = useIncident()
  const isDark = theme === "dark"
  const [previewCoords, setPreviewCoords] = useState<{ lat: number; lng: number } | null>(null)

  const displayIncident = useMemo(() => {
    if (!previewCoords || !activeIncident) return activeIncident
    return { ...activeIncident, coordinates: previewCoords }
  }, [activeIncident, previewCoords])

  const pinColor = displayIncident?.severity ? SEVERITY_PIN[displayIncident.severity] : SEVERITY_PIN[SeverityType.MODERATE]

  return (
    <MapPreviewContext value={{ setPreviewCoords }}>
      <div className="absolute inset-0 bg-muted/30">
        {displayIncident && (
          <IncidentMap
            activeIncident={displayIncident}
            allIncidents={incidents}
            pinColor={pinColor}
            isDark={isDark}
          />
        )}

        {activeIncident && <DispatchModal incident={activeIncident} />}
      </div>
    </MapPreviewContext>
  )
}
