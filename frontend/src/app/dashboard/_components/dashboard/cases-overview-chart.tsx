"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type ChartPeriod = "weekly" | "monthly"

interface CaseDataPoint {
  label: string
  critical: number
  urgent: number
  moderate: number
  resolved: number
}

const WEEKLY_DATA: CaseDataPoint[] = [
  { label: "Mon", critical: 3, urgent: 5, moderate: 6, resolved: 4 },
  { label: "Tue", critical: 2, urgent: 7, moderate: 4, resolved: 6 },
  { label: "Wed", critical: 5, urgent: 4, moderate: 8, resolved: 3 },
  { label: "Thu", critical: 4, urgent: 6, moderate: 5, resolved: 7 },
  { label: "Fri", critical: 6, urgent: 8, moderate: 7, resolved: 5 },
  { label: "Sat", critical: 2, urgent: 3, moderate: 4, resolved: 9 },
  { label: "Sun", critical: 1, urgent: 2, moderate: 3, resolved: 8 },
]

const MONTHLY_DATA: CaseDataPoint[] = [
  { label: "Jan", critical: 18, urgent: 32, moderate: 45, resolved: 52 },
  { label: "Feb", critical: 22, urgent: 28, moderate: 38, resolved: 48 },
  { label: "Mar", critical: 15, urgent: 35, moderate: 42, resolved: 55 },
  { label: "Apr", critical: 24, urgent: 30, moderate: 50, resolved: 61 },
  { label: "May", critical: 20, urgent: 38, moderate: 44, resolved: 58 },
  { label: "Jun", critical: 17, urgent: 29, moderate: 47, resolved: 63 },
  { label: "Jul", critical: 21, urgent: 33, moderate: 41, resolved: 57 },
  { label: "Aug", critical: 19, urgent: 36, moderate: 49, resolved: 60 },
  { label: "Sep", critical: 16, urgent: 31, moderate: 43, resolved: 54 },
  { label: "Oct", critical: 23, urgent: 34, moderate: 46, resolved: 59 },
  { label: "Nov", critical: 14, urgent: 27, moderate: 40, resolved: 51 },
  { label: "Dec", critical: 12, urgent: 25, moderate: 38, resolved: 47 },
]

const SEGMENTS = [
  { key: "critical" as const, label: "Critical", color: "bg-destructive" },
  { key: "urgent"   as const, label: "Urgent",   color: "bg-warning"    },
  { key: "moderate" as const, label: "Moderate", color: "bg-primary"    },
  { key: "resolved" as const, label: "Resolved", color: "bg-secondary"  },
]

function rowTotal(p: CaseDataPoint) {
  return p.critical + p.urgent + p.moderate + p.resolved
}

// Target both data-state="active" (Radix) and data-active (shadcn convenience attr)
const ACTIVE_TAB =
  "data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground " +
  "data-active:bg-secondary data-active:text-secondary-foreground " +
  "dark:data-[state=active]:bg-secondary dark:data-[state=active]:text-secondary-foreground " +
  "dark:data-active:bg-secondary dark:data-active:text-secondary-foreground"

export function CasesOverviewChart() {
  const [period, setPeriod] = useState<ChartPeriod>("weekly")
  const data = period === "weekly" ? WEEKLY_DATA : MONTHLY_DATA

  const summary = useMemo(() => {
    const totals = data.map(rowTotal)
    const sum    = totals.reduce((a, b) => a + b, 0)
    const peak   = Math.max(...totals)
    const peakDay = data[totals.indexOf(peak)]?.label ?? "—"
    return { sum, avg: Math.round(sum / data.length), peak, peakDay }
  }, [data])

  const maxVal = Math.max(...data.map(rowTotal))

  return (
    <Card className="transition-all duration-200 hover:border-secondary hover:shadow-secondary hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
        <div>
          <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Cases Overview
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Incident volume by severity — last {period === "weekly" ? "7 days" : "12 months"}
          </p>
        </div>

        <Tabs value={period} onValueChange={(v) => setPeriod(v as ChartPeriod)}>
          <TabsList className="h-8">
            <TabsTrigger value="weekly"  className={cn("text-xs", ACTIVE_TAB)}>Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className={cn("text-xs", ACTIVE_TAB)}>Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary stat boxes */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border bg-muted/30 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Total Cases
            </p>
            <p className="text-2xl font-bold tabular-nums">{summary.sum}</p>
          </div>
          <div className="rounded-lg border bg-muted/30 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {period === "weekly" ? "Daily Avg" : "Monthly Avg"}
            </p>
            <p className="text-2xl font-bold tabular-nums">{summary.avg}</p>
          </div>
          <div className="rounded-lg border bg-muted/30 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Peak ({summary.peakDay})
            </p>
            <p className="text-2xl font-bold tabular-nums">{summary.peak}</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3">
          {SEGMENTS.map(({ key, label, color }) => (
            <div key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={cn("size-2.5 rounded-sm", color)} />
              {label}
            </div>
          ))}
        </div>

        {/* Bar chart
            Key fix: bars are direct children of the absolute inset-0 flex container
            so height:X% resolves against the concrete 208px parent, not a content-sized flex item. */}
        <div className="relative h-52">
          <div className="absolute inset-0 flex items-end gap-1 sm:gap-1.5">
            {data.map((point) => {
              const t = rowTotal(point)
              const heightPct = maxVal > 0 ? (t / maxVal) * 100 : 0

              return (
                <div
                  key={point.label}
                  className="group/bar relative flex flex-1 cursor-default flex-col-reverse overflow-hidden rounded-t-sm border border-border/40 origin-bottom transition-all duration-200 hover:brightness-110 hover:border-secondary/50 hover:scale-y-[1.03]"
                  style={{ height: `${Math.max(heightPct, 6)}%` }}
                >
                  {/* Hover tooltip */}
                  <div className="pointer-events-none absolute -top-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded border border-border/60 bg-card px-1.5 py-0.5 text-[10px] font-semibold shadow-sm opacity-0 transition-opacity duration-150 group-hover/bar:opacity-100">
                    {t}
                  </div>

                  {SEGMENTS.map(({ key, color }) => {
                    const segVal = point[key]
                    const segPct = t > 0 ? (segVal / t) * 100 : 0
                    if (segVal === 0) return null
                    return (
                      <div
                        key={key}
                        className={cn("w-full", color)}
                        style={{ height: `${segPct}%` }}
                        title={`${key}: ${segVal}`}
                      />
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>

        {/* X-axis labels in a separate row — keeps them out of the bar-height calculation */}
        <div className="flex gap-1 sm:gap-1.5">
          {data.map((point) => (
            <span
              key={point.label}
              className="flex-1 text-center text-[10px] font-medium text-muted-foreground"
            >
              {point.label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
