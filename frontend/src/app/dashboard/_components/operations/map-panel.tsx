"use client"

import "mapbox-gl/dist/mapbox-gl.css"
import { useTheme } from "next-themes"
import { useIncident } from "@/context/incident/useIncident"
import { IncidentMap } from "@/components/tactical-workspace/map/IncidentMap"
import { ContradictionCard } from "@/components/tactical-workspace/ContradictionCard"
import { DispatchModal } from "./dispatch-modal"
import { SeverityType, type Incident } from "@/types"

const SEVERITY_PIN: Record<Incident["severity"], string> = {
  critical: "#E63946",
  urgent: "#F59E0B",
  moderate: "#3280FA",
  resolved: "#49D5A4",
}

export function MapPanel() {
  const { theme } = useTheme()
  const { incidents, activeIncident } = useIncident()
  const isDark = theme === "dark"
  const pinColor = activeIncident?.severity ? SEVERITY_PIN[activeIncident.severity] : SEVERITY_PIN[SeverityType.MODERATE]

  return (
    <div className="absolute inset-0 bg-muted/30">
      <IncidentMap
        activeIncident={activeIncident}
        allIncidents={incidents}
        pinColor={pinColor}
        isDark={isDark}
      />

      {/* {activeIncident?.contradiction && (
        <ContradictionCard activeIncident={activeIncident} />
      )} */}

      {activeIncident && <DispatchModal incident={activeIncident} />}
    </div>
  )
}
