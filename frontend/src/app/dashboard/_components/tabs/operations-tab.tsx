"use client"

import { useState } from "react"
import { Brain, FlaskConical, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { IncidentList } from "../operations/incident-list"
import { MapPanel } from "../operations/map-panel"
import { LiveIntelligence } from "../operations/live-intelligence"
import { TranscriptFeed } from "../operations/transcript-feed"
import { EmotionalAnalysis } from "../operations/emotional-analysis"
import { useIncident } from "@/context/incident/useIncident"
import { useSimulator } from "@/context/simulator/useSimulator"

export function OperationsTab() {
  const { activeIncident } = useIncident()
  const { isSimulating, setIsSimulating } = useSimulator()
  const [intelOpen, setIntelOpen] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      {isSimulating && !bannerDismissed && (
        <div className="relative z-40 flex shrink-0 items-center justify-between bg-warning px-4 py-2 text-warning-foreground">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase">
            <FlaskConical className="size-4" />
            Simulation Active — Not Live Data
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-warning-foreground/30"
              onClick={() => setIsSimulating(false)}
            >
              End Simulation
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setBannerDismissed(true)}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_1fr] overflow-hidden md:grid-cols-[minmax(280px,26%)_1fr] md:grid-rows-1 lg:grid-cols-[minmax(320px,26%)_1fr_minmax(280px,28%)]">
        <IncidentList />

        <div className="relative min-h-0 overflow-hidden border-t md:border-t-0 md:border-l lg:border-r-0">
          <MapPanel />
        </div>

        <LiveIntelligence />

        {/* Mobile / tablet intel FAB */}
        <div className="absolute bottom-20 right-4 z-30 lg:hidden">
          <Sheet open={intelOpen} onOpenChange={setIntelOpen}>
            <SheetTrigger asChild>
              <Button size="icon" className="size-12 rounded-full shadow-lg">
                <Brain className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="flex h-[70vh] flex-col gap-0 p-0">
              <SheetHeader className="border-b px-4 py-3">
                <SheetTitle className="flex items-center gap-2 text-sm uppercase tracking-widest">
                  <Brain className="size-4 text-primary" /> Live Intelligence
                </SheetTitle>
              </SheetHeader>
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
                <EmotionalAnalysis incident={activeIncident} compact />
                <Separator className="my-4" />
                <div className="min-h-0 flex-1">
                  <TranscriptFeed incident={activeIncident} fillHeight />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
