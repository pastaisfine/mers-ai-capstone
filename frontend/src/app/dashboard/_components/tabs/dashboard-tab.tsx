"use client"

import { StatCards } from "../dashboard/stat-cards"
import { RecentActivity } from "../dashboard/recent-activity"
import { StaffPanel } from "../dashboard/staff-panel"
import { CasesOverviewChart } from "../dashboard/cases-overview-chart"

export function DashboardTab() {
  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <StatCards />

        <CasesOverviewChart />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <RecentActivity />
          </div>
          <div className="lg:col-span-2">
            <StaffPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
