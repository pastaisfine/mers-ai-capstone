"use client"

import { Brain, PhoneCall } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useIncident } from "@/context/incident/useIncident"
import { TranscriptFeed } from "./transcript-feed"
import { EmotionalAnalysis } from "./emotional-analysis"
import { cn } from "@/lib/utils"

export function LiveIntelligence() {
  const { activeIncident } = useIncident()
  const hasLiveCall = activeIncident.transcript.length > 0

  return (
    <aside className="hidden min-h-0 flex-col border-l bg-card lg:flex">
      {/* ── Header ── */}
      <div className="flex shrink-0 items-center gap-2.5 border-b px-4 py-3">
        <div
          className={cn(
            "flex size-7 items-center justify-center rounded-md transition-colors",
            hasLiveCall ? "bg-destructive/15" : "bg-primary/10"
          )}
        >
          <Brain
            className={cn(
              "size-4 transition-colors",
              hasLiveCall ? "text-destructive" : "text-primary"
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-xs font-semibold uppercase tracking-widest">
            Live Intelligence
          </h2>
          <p className="text-[10px] text-muted-foreground">Real-time call analysis</p>
        </div>

        {/* Live call status pill */}
        {hasLiveCall && (
          <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-1">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-destructive" />
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-destructive">
              Active
            </span>
          </div>
        )}
      </div>

      {/* ── Active call banner ── */}
      {hasLiveCall && (
        <div className="shrink-0 border-b bg-destructive/5 px-4 py-2">
          <div className="flex items-center gap-2">
            <PhoneCall className="size-3.5 shrink-0 text-destructive" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-semibold text-destructive">
                {activeIncident.caller}
              </p>
              <p className="text-[9px] text-muted-foreground">
                {activeIncident.location} · {activeIncident.duration}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Emotional analysis ── */}
      <div className="shrink-0 border-b bg-muted/10 p-4">
        {activeIncident && <EmotionalAnalysis incident={activeIncident} />}
      </div>

      <Separator className="shrink-0" />

      {/* ── Transcript ── */}
      <div className="flex min-h-0 flex-1 flex-col p-4">
        {activeIncident && <TranscriptFeed incident={activeIncident} fillHeight />}
      </div>
    </aside>
  )
}
