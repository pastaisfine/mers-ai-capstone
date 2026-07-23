"use client"

import { TodayStatCards, AllTimeStatCards } from "../dashboard/stat-cards"
import { DispatchOutcomeChart } from "../dashboard/dispatch-outcome-chart"
import { ResponsePipelineChart } from "../dashboard/response-pipeline-chart"
import { EscalationChart } from "../dashboard/escalation-chart"

export function DashboardTab() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4 lg:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <TodayStatCards />
        <AllTimeStatCards />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <DispatchOutcomeChart />
          <ResponsePipelineChart />
        </div>

        <EscalationChart />
      </div>
    </div>
  )
}
