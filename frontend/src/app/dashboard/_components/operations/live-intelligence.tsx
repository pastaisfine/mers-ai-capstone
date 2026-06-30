"use client"

import { Brain } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useIncident } from "@/context/incident/useIncident"
import { TranscriptFeed } from "./transcript-feed"
import { EmotionalAnalysis } from "./emotional-analysis"

export function LiveIntelligence() {
  const { activeIncident } = useIncident()

  return (
    <aside className="hidden min-h-0 flex-col border-l bg-card lg:flex">
      <div className="flex shrink-0 items-center gap-2.5 border-b px-4 py-3">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
          <Brain className="size-4 text-primary" />
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest">
            Live Intelligence
          </h2>
          <p className="text-[10px] text-muted-foreground">Real-time call analysis</p>
        </div>
      </div>

      {/* Emotional analysis — top */}
      <div className="shrink-0 border-b bg-muted/10 p-4">
        {activeIncident && <EmotionalAnalysis incident={activeIncident} />}
      </div>

      <Separator className="shrink-0" />

      {/* Transcript — fills remaining height */}
      <div className="flex min-h-0 flex-1 flex-col p-4">
        {activeIncident && <TranscriptFeed incident={activeIncident} fillHeight />}
      </div>
    </aside>
  )
}
