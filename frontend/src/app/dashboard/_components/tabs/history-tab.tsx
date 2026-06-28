"use client"

import { useMemo, useState } from "react"
import { Download, Eye, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HISTORICAL_REPORTS } from "@/data/historicalReports"
import { getSeverityBadgeClass } from "@/lib/severity"
import { cn } from "@/lib/utils"
import type { ArchivedReport } from "@/types"
import { SeverityType as ReportSeverityType } from "@/models/report"

const PAGE_SIZE = 5

export function HistoryTab() {
  const [search, setSearch] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string[]>([])
  const [typeFilter, setTypeFilter] = useState("")
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<ArchivedReport | null>(null)

  const filtered = useMemo(() => {
    return HISTORICAL_REPORTS.filter((report) => {
      const q = search.toLowerCase()
      const matchesSearch =
        report.title.toLowerCase().includes(q) ||
        report.id.toLowerCase().includes(q) ||
        report.location.toLowerCase().includes(q)
      const matchesSeverity =
        severityFilter.length === 0 ||
        severityFilter.includes(report.severity.toString())
      const matchesType =
        !typeFilter || report.incidentType.toLowerCase().includes(typeFilter.toLowerCase())
      return matchesSearch && matchesSeverity && matchesType
    })
  }, [search, severityFilter, typeFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function toggleSeverity(severity: string) {
    setSeverityFilter((prev) =>
      prev.includes(severity)
        ? prev.filter((s) => s !== severity)
        : [...prev, severity]
    )
    setPage(0)
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search incidents..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(0)
              }}
              className="pl-9"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Severity Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.values(ReportSeverityType).map((sev) => (
                  <DropdownMenuCheckboxItem
                    key={sev}
                    checked={severityFilter.includes(sev)}
                    onCheckedChange={() => toggleSeverity(sev)}
                  >
                    {sev.toUpperCase()}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            placeholder="Incident type..."
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value)
              setPage(0)
            }}
            className="w-40"
          />
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>INC Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Dispatch Time</TableHead>
                <TableHead>Resolution Time</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.map((report) => (
                <TableRow
                  key={report.id}
                  className="cursor-pointer"
                  onClick={() => setSelected(report)}
                >
                  <TableCell className="font-mono text-xs">{report.id}</TableCell>
                  <TableCell className="capitalize">{report.incidentType}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {report.location}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "text-xs font-bold uppercase",
                        getSeverityBadgeClass(report.severity)
                      )}
                    >
                      {report.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {report.createAt.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs">
                    {new Date(
                      report.createAt.getTime() + 45 * 60 * 1000
                    ).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs capitalize">
                    {report.approvedStatus}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelected(report)
                        }}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {page * PAGE_SIZE + 1}–
            {Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-xl">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4 text-sm">
                <div className="flex gap-2">
                  <Badge
                    className={cn(
                      "uppercase",
                      getSeverityBadgeClass(selected.severity)
                    )}
                  >
                    {selected.severity}
                  </Badge>
                  <Badge variant="outline">{selected.id}</Badge>
                </div>
                <p><strong>Location:</strong> {selected.location}</p>
                <p><strong>Caller:</strong> {selected.caller}</p>
                <p><strong>Outcome:</strong> {selected.operatorVerdict}</p>
                <p><strong>Notes:</strong> {selected.notes}</p>
                <div>
                  <strong>Reasoning:</strong>
                  <p className="mt-1 text-muted-foreground">
                    {selected.reasoningReport.content}
                  </p>
                </div>
                <div>
                  <strong>SOP Actions:</strong>
                  <ol className="mt-1 list-decimal pl-5 text-muted-foreground">
                    {selected.sopActions.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
