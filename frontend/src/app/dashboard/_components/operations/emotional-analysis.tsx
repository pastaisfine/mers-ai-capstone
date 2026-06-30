"use client"

import { Activity, Volume2, Waves } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getPanicBadgeClass } from "@/lib/severity"
import { cn } from "@/lib/utils"
import type { Incident } from "@/types"

interface EmotionalAnalysisProps {
  incident: Incident
  compact?: boolean
}

export function EmotionalAnalysis({ incident, compact }: EmotionalAnalysisProps) {
  const panicClass = getPanicBadgeClass(incident.panicLevel)
  const isHighDistress = incident.distressScore > 70

  return (
    <section className={cn("space-y-3", compact && "space-y-2.5")}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Panic Level
        </p>
        <Badge
          className={cn(
            "text-xs font-bold uppercase tracking-wide",
            panicClass
          )}
        >
          {incident.panicLevel?.toUpperCase()}
        </Badge>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px]">
          <span className="font-semibold uppercase tracking-widest text-muted-foreground">
            Distress Score
          </span>
          <span
            className={cn(
              "font-bold tabular-nums",
              isHighDistress ? "text-destructive" : "text-warning"
            )}
          >
            {incident.distressScore}/100
          </span>
        </div>
        <Progress
          value={incident.distressScore}
          className={cn(
            "h-2 bg-muted/80",
            isHighDistress
              ? "[&_[data-slot=progress-indicator]]:bg-destructive"
              : "[&_[data-slot=progress-indicator]]:bg-warning"
          )}
        />
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Prosody Analysis
        </p>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-md border bg-background/50 px-2 py-1.5">
            <Activity className="size-3 shrink-0 text-primary" />
            <span className="text-[10px] leading-tight">Fast — 210 wpm</span>
          </div>
          <div className="flex items-center gap-2 rounded-md border bg-background/50 px-2 py-1.5">
            <Waves className="size-3 shrink-0 text-warning" />
            <span className="text-[10px] leading-tight">Tremor detected</span>
          </div>
          <div className="flex items-center gap-2 rounded-md border bg-background/50 px-2 py-1.5">
            <Volume2 className="size-3 shrink-0 text-destructive" />
            <span className="text-[10px] leading-tight">Escalating</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px]">
          <span className="font-semibold uppercase tracking-widest text-muted-foreground">
            AI Confidence
          </span>
          <span className="font-bold tabular-nums text-secondary">
            {incident.confidence}%
          </span>
        </div>
        <Progress
          value={incident.confidence}
          className="h-1.5 bg-muted/80 [&_[data-slot=progress-indicator]]:bg-secondary"
        />
      </div>
    </section>
  )
}
