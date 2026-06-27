"use client"

import {
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  ThumbsUp,
  Timer,
  Users,
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
  trend: number
}

function StatCard({ label, value, icon: Icon, iconColor, trend }: StatCardProps) {
  const isUp = trend >= 0

  return (
    <Card>
      <CardContent className="relative p-4">
        <div
          className={cn(
            "absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-muted",
            iconColor
          )}
        >
          <Icon className="size-4" />
        </div>
        <p className="text-3xl font-bold tabular-nums">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        <div className="mt-2 flex items-center gap-1 text-xs">
          {isUp ? (
            <TrendingUp className="size-3 text-secondary" />
          ) : (
            <TrendingDown className="size-3 text-destructive" />
          )}
          <span className={isUp ? "text-secondary" : "text-destructive"}>
            {isUp ? "+" : ""}
            {trend}%
          </span>
          <span className="text-muted-foreground">vs yesterday</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatCards() {
  const { incidents } = useIncident()

  const stats = useMemo(() => {
    const active = incidents.filter((i) => i.severity !== SeverityType.RESOLVED).length
    const completed = incidents.filter((i) => i.severity === SeverityType.RESOLVED).length
    const critical = incidents.filter((i) => i.severity === SeverityType.CRITICAL).length
    const approvalRate = incidents.length
      ? Math.round(((incidents.length - critical * 0.1) / incidents.length) * 100)
      : 0

    return [
      {
        label: "Active Cases",
        value: active,
        icon: AlertTriangle,
        iconColor: "text-destructive",
        trend: 12,
      },
      {
        label: "Completed Cases",
        value: completed,
        icon: CheckCircle2,
        iconColor: "text-secondary",
        trend: 8,
      },
      {
        label: "Approval Rate",
        value: `${approvalRate}%`,
        icon: ThumbsUp,
        iconColor: "text-primary",
        trend: 3,
      },
      {
        label: "Avg Response Time",
        value: "4:32",
        icon: Timer,
        iconColor: "text-warning",
        trend: -5,
      },
      {
        label: "Staff Online",
        value: 6,
        icon: Users,
        iconColor: "text-secondary",
        trend: 0,
      },
      {
        label: "Need Intervention",
        value: critical,
        icon: HeartPulse,
        iconColor: "text-destructive",
        trend: 15,
      },
    ]
  }, [incidents])

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}
