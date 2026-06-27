"use client"

import { useMemo, useState } from "react"
import { Filter, MapPin, Search, ShieldAlert } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useIncident } from "@/context/incident/useIncident"
import { SeverityType } from "@/types"
import { timeAgo } from "@/lib/utils"
import { getSeverityBadgeClass } from "@/lib/severity"
import { cn } from "@/lib/utils"

export function IncidentList() {
  const { incidents, selectedIncidentId, setSelectedIncidentId } = useIncident()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSeverity, setFilterSeverity] = useState<SeverityType>(SeverityType.ALL)

  const activeIncidents = useMemo(
    () => incidents.filter((i) => i.severity !== SeverityType.RESOLVED),
    [incidents]
  )

  const results = useMemo(() => {
    return activeIncidents.filter((incident) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        incident.title.toLowerCase().includes(q) ||
        incident.id.toLowerCase().includes(q) ||
        incident.location.toLowerCase().includes(q)
      const matchesSeverity =
        filterSeverity === SeverityType.ALL || incident.severity === filterSeverity
      return matchesSearch && matchesSeverity
    })
  }, [searchQuery, filterSeverity, activeIncidents])

  return (
    <>
      {/* Mobile horizontal strip */}
      <div className="flex shrink-0 gap-2 overflow-x-auto border-b bg-card/80 p-2 backdrop-blur-sm md:hidden">
        {results.map((incident) => (
          <button
            key={incident.id}
            type="button"
            onClick={() => setSelectedIncidentId(incident.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 transition-colors",
              selectedIncidentId === incident.id
                ? "border-primary bg-primary/10"
                : "border-border hover:bg-muted/50"
            )}
          >
            <Badge
              className={cn(
                "text-[10px] font-bold uppercase",
                getSeverityBadgeClass(incident.severity)
              )}
            >
              {incident.severity.slice(0, 3)}
            </Badge>
            <span className="font-mono text-xs">{incident.id}</span>
          </button>
        ))}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden min-h-0 flex-col border-r bg-card md:flex">
        <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
          <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <ShieldAlert className="size-3.5 text-destructive" />
            Active ({activeIncidents.length})
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-xs" className="text-muted-foreground">
                <Filter className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={filterSeverity}
                onValueChange={(v) => setFilterSeverity(v as SeverityType)}
              >
                <DropdownMenuRadioItem value={SeverityType.ALL}>All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={SeverityType.CRITICAL}>Critical</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={SeverityType.URGENT}>Urgent</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={SeverityType.MODERATE}>Moderate</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="relative shrink-0 border-b px-3 py-2.5">
          <Search className="absolute left-6 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search code, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 border-muted bg-muted/30 pl-8 text-xs"
          />
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-1.5 p-2">
            {results.map((incident) => {
              const selected = selectedIncidentId === incident.id
              return (
                <button
                  key={incident.id}
                  type="button"
                  onClick={() => setSelectedIncidentId(incident.id)}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2.5 text-left transition-all",
                    selected
                      ? "border-primary/40 bg-primary/5 shadow-sm ring-1 ring-primary/20"
                      : "border-transparent bg-muted/20 hover:border-border hover:bg-muted/40"
                  )}
                >
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {incident.id}
                    </span>
                    <Badge
                      className={cn(
                        "h-4 px-1.5 text-[9px] font-bold uppercase tracking-wide",
                        getSeverityBadgeClass(incident.severity)
                      )}
                    >
                      {incident.severity}
                    </Badge>
                  </div>
                  <p className="line-clamp-1 text-sm font-semibold leading-tight">
                    {incident.title}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="size-3 shrink-0" />
                    <span className="truncate">{incident.location}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="rounded bg-background/60 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                      {incident.lang}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {timeAgo(incident.occurDateTime)}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </ScrollArea>
      </aside>
    </>
  )
}
