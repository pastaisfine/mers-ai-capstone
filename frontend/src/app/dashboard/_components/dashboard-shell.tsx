"use client"

import { TimeProvider } from "@/context/time/TimeProvider"
import { IncidentProvider } from "@/context/incident/IncidentProvider"
import { SimulatorProvider } from "@/context/simulator/SimulatorProvider"
import { TabProvider } from "@/context/tab/TabProvider"
import { TabName } from "@/types"
import { Navbar } from "./navbar"
import { DashboardTab } from "./tabs/dashboard-tab"
import { OperationsTab } from "./tabs/operations-tab"
import { HistoryTab } from "./tabs/history-tab"
import { SimulationTab } from "./tabs/simulation-tab"
import { useTab } from "@/context/tab/useTab"

function DashboardContent() {
  const { currentTab } = useTab()

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Navbar />

      {/* Mobile tab nav */}
      <MobileTabNav />

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {currentTab === TabName.DASHBOARD && <DashboardTab />}
        {currentTab === TabName.OPERATIONS && <OperationsTab />}
        {currentTab === TabName.HISTORY && <HistoryTab />}
        {currentTab === TabName.SIMULATION && <SimulationTab />}
      </main>
    </div>
  )
}

function MobileTabNav() {
  const { currentTab, setCurrentTab } = useTab()

  return (
    <div className="flex gap-1 overflow-x-auto border-b bg-muted/30 p-2 lg:hidden">
      {[
        { id: TabName.DASHBOARD, label: "Dashboard" },
        { id: TabName.OPERATIONS, label: "Operations" },
        { id: TabName.HISTORY, label: "History" },
        // { id: TabName.SIMULATION, label: "Simulation" },
      ].map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => setCurrentTab(id)}
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase ${
            currentTab === id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export function DashboardShell() {
  return (
    <TimeProvider>
      <IncidentProvider>
        <SimulatorProvider>
          <TabProvider defaultTab={TabName.DASHBOARD}>
            <DashboardContent />
          </TabProvider>
        </SimulatorProvider>
      </IncidentProvider>
    </TimeProvider>
  )
}
