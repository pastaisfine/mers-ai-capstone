"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Search, CheckCircle2, XCircle, UserCheck, Zap,
  AlertTriangle, ChevronRight, MapPin, Flame, Heart, Shield, Car, Droplets,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuCheckboxItem,
  DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HISTORICAL_REPORTS } from "@/data/historicalReports"
import { cn } from "@/lib/utils"
import { SeverityType as ReportSeverityType, ApprovalType, IncidentType } from "@/models/report"

const PAGE_SIZE = 10

const SEVERITY_BADGE: Record<string, string> = {
  CRITICAL: "border-destructive/60 bg-destructive/10 text-destructive",
  URGENT:   "border-warning/60   bg-warning/10   text-warning",
  MODERATE: "border-primary/60   bg-primary/10   text-primary",
}

const TYPE_ICON: Record<string, React.ElementType> = {
  [IncidentType.MEDICAL]:  Heart,
  [IncidentType.FIRE]:     Flame,
  [IncidentType.CRIME]:    Shield,
  [IncidentType.ACCIDENT]: Car,
  [IncidentType.FLOOD]:    Droplets,
  [IncidentType.UNKNOWN]:  AlertTriangle,
}

const TYPE_ICON_STYLE: Record<string, string> = {
  [IncidentType.MEDICAL]:  "bg-destructive/20 text-destructive",
  [IncidentType.FIRE]:     "bg-warning/20     text-warning",
  [IncidentType.CRIME]:    "bg-muted          text-muted-foreground",
  [IncidentType.ACCIDENT]: "bg-primary/20     text-primary",
  [IncidentType.FLOOD]:    "bg-primary/15     text-primary",
  [IncidentType.UNKNOWN]:  "bg-muted          text-muted-foreground",
}

function formatResponseTime(seconds?: number | null) {
  if (!seconds) return "—"
  return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m ${seconds % 60}s`
}

// ── Main component ────────────────────────────────────────────────────────────

export function HistoryTab() {
  const router = useRouter()
  const [search, setSearch]           = useState("")
  const [severityFilter, setSeverityFilter] = useState<string[]>([])
  const [typeFilter, setTypeFilter]   = useState("")
  const [page, setPage]               = useState(0)

  const filtered = useMemo(() => {
    return HISTORICAL_REPORTS.filter((r) => {
      const q = search.toLowerCase()
      const matchSearch =
        r.title.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)    ||
        r.location.toLowerCase().includes(q) ||
        r.caller.toLowerCase().includes(q)
      const matchSeverity = severityFilter.length === 0 || severityFilter.includes(r.severity)
      const matchType     = !typeFilter || r.incidentType.toLowerCase().includes(typeFilter.toLowerCase())
      return matchSearch && matchSeverity && matchType
    })
  }, [search, severityFilter, typeFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageData   = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by ID, title, location, caller…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0) }}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {severityFilter.length > 0 ? `Severity (${severityFilter.length})` : "Severity"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.values(ReportSeverityType).map((sev) => (
                <DropdownMenuCheckboxItem
                  key={sev}
                  checked={severityFilter.includes(sev)}
                  onCheckedChange={() => {
                    setSeverityFilter(prev =>
                      prev.includes(sev) ? prev.filter(s => s !== sev) : [...prev, sev]
                    )
                    setPage(0)
                  }}
                >
                  {sev}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Input
            placeholder="Filter type…"
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(0) }}
            className="w-36"
          />
        </div>

        {/* table */}
        <div className="overflow-hidden rounded-xl border border-black transition-all duration-200 hover:shadow-secondary hover:shadow-md dark:border-neutral-700">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                {["ID","Incident","Severity","Caller","Duration","Response","Human?","Outcome","AI Conf.",""].map((h, i) => (
                  <TableHead key={i} className={cn("text-[10px] uppercase tracking-wider", i === 9 && "w-10")}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.map((report) => {
                const isApproved   = report.approvedStatus === ApprovalType.APPROVED
                const hasHuman     = report.humanIntervention?.required
                const TypeIcon     = TYPE_ICON[report.incidentType] ?? AlertTriangle
                const iconStyle    = TYPE_ICON_STYLE[report.incidentType] ?? "bg-muted text-muted-foreground"

                return (
                  <TableRow
                    key={report.id}
                    className="cursor-pointer transition-colors hover:bg-muted/30"
                    onClick={() => router.push(`/dashboard/history/${report.id}`)}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">{report.id}</TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", iconStyle)}>
                          <TypeIcon className="size-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold leading-tight">{report.title}</p>
                          <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                            <MapPin className="size-2.5" />{report.location.split(",")[0]}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest",
                        SEVERITY_BADGE[report.severity] ?? "border-muted bg-muted text-muted-foreground"
                      )}>
                        {report.severity}
                      </span>
                    </TableCell>

                    <TableCell className="text-xs">{report.caller}</TableCell>
                    <TableCell className="font-mono text-xs">{report.callDuration}</TableCell>
                    <TableCell className="font-mono text-xs">{formatResponseTime(report.responseTimeSeconds)}</TableCell>

                    <TableCell>
                      {hasHuman
                        ? <Badge className="bg-warning dark:bg-warning/50 border-2 border-black dark:border-warning text-white text-[10px]"><UserCheck className="mr-1 size-2.5" />Yes</Badge>
                        : <Badge className="bg-secondary dark:bg-secondary/50 border-2 border-black dark:border-secondary text-white text-[10px]"><Zap className="mr-1 size-2.5" />AI Only</Badge>
                      }
                    </TableCell>

                    <TableCell>
                      {isApproved
                        ? <span className="flex items-center gap-1 text-xs font-medium text-secondary"><CheckCircle2 className="size-3.5" />Dispatched</span>
                        : <span className="flex items-center gap-1 text-xs font-medium text-destructive"><XCircle className="size-3.5" />Rejected</span>
                      }
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn("h-full rounded-full", report.dispatchConfindece >= 0.8 ? "bg-secondary" : report.dispatchConfindece >= 0.5 ? "bg-warning" : "bg-destructive")}
                            style={{ width: `${Math.round(report.dispatchConfindece * 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono">{Math.round(report.dispatchConfindece * 100)}%</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                )
              })}
              {pageData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="py-10 text-center text-sm text-muted-foreground">
                    No incidents match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* pagination */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {Math.min(page * PAGE_SIZE + 1, filtered.length)}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} records
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
