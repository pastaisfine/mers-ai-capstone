"use client"

import {
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  ThumbsUp,
  Timer,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useIncident } from "@/context/incident/useIncident"
import { SeverityType } from "@/types"
import { useMemo } from "react"

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ElementType
  iconColor: string
  iconBg: string
  accentColor: string
  trend: number
  subtitle?: string
  progress?: number
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  accentColor,
  trend,
  subtitle,
  progress,
}: StatCardProps) {
  const isUp = trend >= 0

  return (
    <Card className="cursor-default overflow-hidden transition-all duration-200 hover:scale-[1.03] hover:border-secondary hover:shadow-secondary hover:shadow-md">
      {/* Colored top accent */}
      {/* <div className={cn("h-[3px] w-full", accentColor)} /> */}

      <CardContent className="px-4">
        <div className="flex justify-between">
          {/* Primary value */}
          <div>
            <p className="text-2xl font-bold leading-none tabular-nums">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
          </div>

          {/* Icon + trend pill */}
          <div className="mb-2 flex items-start justify-between">
            <div className={cn("flex size-11 items-center justify-center rounded-xl", iconBg)}>
              <Icon className={cn("size-6", iconColor)} />
            </div>
          </div>
        </div>

        {/* Optional progress bar (e.g. Approval Rate) */}
        {/* {progress !== undefined && (
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all duration-700", accentColor)}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )} */}

        {/* Footer divider + secondary info */}
        <div className="mt-2 flex items-center justify-center gap-1.5 border-t border-border/40 pt-2">
          <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums",
                isUp
                  ? "bg-secondary/15 text-secondary"
                  : "bg-destructive/15 text-destructive"
              )}
            >
              {isUp ? (
                <TrendingUp className="size-2.5" />
              ) : (
                <TrendingDown className="size-2.5" />
              )}
              {isUp ? "+" : ""}
              {trend}%
            </span>
            <span className="text-[11px] text-muted-foreground">vs yesterday</span>
            {/* {subtitle && (
              <span className="text-[10px] font-medium text-muted-foreground">{subtitle}</span>
            )} */}
        </div>
      </CardContent>
    </Card>
  )
}

export function StatCards() {
  const { incidents } = useIncident()

  const stats = useMemo(() => {
    const active    = incidents.filter((i) => i.severity !== SeverityType.RESOLVED).length
    const completed = incidents.filter((i) => i.severity === SeverityType.RESOLVED).length
    const critical  = incidents.filter((i) => i.severity === SeverityType.CRITICAL).length
    const urgent    = incidents.filter((i) => i.severity === SeverityType.URGENT).length
    const total     = incidents.length
    const approvalRate = total
      ? Math.round(((total - critical * 0.1) / total) * 100)
      : 0

    return [
      {
        label: "Active Cases",
        value: active,
        icon: AlertTriangle,
        iconColor: "text-destructive",
        iconBg: "bg-destructive/15",
        accentColor: "bg-destructive",
        trend: 12,
        subtitle: critical > 0 ? `${critical} critical · ${urgent} urgent` : "None critical",
      },
      {
        label: "Completed Cases",
        value: completed,
        icon: CheckCircle2,
        iconColor: "text-secondary",
        iconBg: "bg-secondary/15",
        accentColor: "bg-secondary",
        trend: 8,
        subtitle: total > 0 ? `${Math.round((completed / total) * 100)}% of total` : "—",
      },
      {
        label: "Approval Rate",
        value: `${approvalRate}%`,
        icon: ThumbsUp,
        iconColor: "text-primary",
        iconBg: "bg-primary/15",
        accentColor: "bg-primary",
        trend: 3,
        progress: approvalRate,
        subtitle: "SLA target 95%",
      },
      {
        label: "Avg Response Time",
        value: "4:32",
        icon: Timer,
        iconColor: "text-warning",
        iconBg: "bg-warning/15",
        accentColor: "bg-warning",
        trend: -5,
        subtitle: "Target: 5:00 min",
      },
      {
        label: "Need Intervention",
        value: critical,
        icon: HeartPulse,
        iconColor: "text-destructive",
        iconBg: "bg-destructive/15",
        accentColor: "bg-destructive",
        trend: 15,
        subtitle: critical > 0 ? "Immediate action needed" : "All clear",
      },
    ]
  }, [incidents])

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}
