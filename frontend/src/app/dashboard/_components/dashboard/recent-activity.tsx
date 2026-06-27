"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useIncident } from "@/context/incident/useIncident"
import { timeAgo } from "@/lib/utils"
import { getSeverityBadgeClass } from "@/lib/severity"
import { cn } from "@/lib/utils"

export function RecentActivity() {
  const { incidents } = useIncident()

  const events = useMemo(
    () =>
      [...incidents]
        .sort(
          (a, b) =>
            new Date(b.occurDateTime).getTime() -
            new Date(a.occurDateTime).getTime()
        )
        .slice(0, 20),
    [incidents]
  )

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {events.map((incident) => (
              <div
                key={incident.id}
                className="flex items-start justify-between gap-3 rounded-lg border p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge
                      className={cn(
                        "text-xs font-bold uppercase tracking-wide",
                        getSeverityBadgeClass(incident.severity)
                      )}
                    >
                      {incident.severity}
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">
                      {incident.id}
                    </span>
                  </div>
                  <p className="truncate text-sm font-medium">{incident.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {incident.location}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-muted-foreground">
                    {timeAgo(incident.occurDateTime)}
                  </p>
                  <Badge variant="outline" className="mt-1 text-[10px]">
                    {incident.status?.dispatch ?? "PENDING"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
