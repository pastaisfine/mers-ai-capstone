"use client"

import { useState } from "react"
import { Ambulance, ChevronDown, ChevronUp, XCircle, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useIncident } from "@/context/incident/useIncident"
import { useTime } from "@/context/time/useTime"
import type { Incident } from "@/types"

interface DispatchModalProps {
  incident: Incident
}

export function DispatchModal({ incident }: DispatchModalProps) {
  const [expanded, setExpanded] = useState(false)
  const [note, setNote] = useState("")
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const { setIncidents } = useIncident()
  const { currentTimeText } = useTime()

  const isPending = incident.status?.dispatch !== "DISPATCHED"
  const pendingCount = isPending ? 1 : 0

  async function handleApprove() {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/dispatch/approve`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ incident_id: incident.id, note }),
        }
      )
    } catch {
      // Fall back to local state if API unavailable
    }

    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incident.id
          ? {
              ...inc,
              status: { ...inc.status, dispatch: "DISPATCHED" },
              responder: { ...inc.responder, status: "DISPATCHED" },
              timeline: [
                ...inc.timeline,
                {
                  time: currentTimeText,
                  event: `Unit [${inc.responder.name}] dispatched.${note ? ` Note: ${note}` : ""}`,
                },
              ],
            }
          : inc
      )
    )

    toast.success(`✓ ${incident.responder.name} dispatched to ${incident.location}`)
    setExpanded(false)
    setNote("")
  }

  function handleReject() {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incident.id
          ? {
              ...inc,
              status: { ...inc.status, dispatch: "REJECTED" },
              timeline: [
                ...inc.timeline,
                {
                  time: currentTimeText,
                  event: `Dispatch request REJECTED. Reason: ${rejectReason}`,
                },
              ],
            }
          : inc
      )
    )
    toast.warning(`Dispatch request rejected for ${incident.id}`)
    setRejectOpen(false)
    setRejectReason("")
    setExpanded(false)
  }

  if (!isPending && !expanded) return null

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-destructive/40 bg-card/95 px-4 py-2.5 shadow-xl backdrop-blur-sm transition-transform hover:scale-[1.02]"
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-destructive" />
        </span>
        <span className="text-sm font-semibold">
          {pendingCount} Dispatch Request Pending
        </span>
        <ChevronUp className="size-4" />
      </button>
    )
  }

  return (
    <>
      <Card className="absolute bottom-6 left-1/2 z-20 max-h-[70%] w-[96%] max-w-2xl -translate-x-1/2 overflow-hidden rounded-t-xl border shadow-2xl">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b bg-destructive/10 px-4 py-3">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase">
              🚨 Dispatch Request — {incident.id}
            </h3>
            <Button variant="ghost" size="icon-xs" onClick={() => setExpanded(false)}>
              <ChevronDown className="size-4" />
            </Button>
          </div>

          <div className="max-h-[50vh] space-y-4 overflow-y-auto p-4 text-sm">
            <section>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Incident Summary
              </p>
              <p><strong>Type:</strong> {incident.title}</p>
              <p><strong>Location:</strong> {incident.location}</p>
              <p className="font-mono text-xs">
                <strong>GPS:</strong> {incident.coordinates.lat.toFixed(3)}°N,{" "}
                {incident.coordinates.lng.toFixed(3)}°E
              </p>
            </section>

            <Separator />

            <section>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Caller Intel
              </p>
              <p>
                Language: {incident.lang} | Distress Score: {incident.distressScore}
              </p>
              <p>
                Panic Level: {incident.panicLevel.toUpperCase()} | Confidence:{" "}
                {incident.confidence}%
              </p>
              {incident.contradiction && (
                <p className="mt-1 text-xs text-warning">
                  ⚠ {incident.contradiction}
                </p>
              )}
            </section>

            <Separator />

            <section>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Assigned Responder
              </p>
              <p className="flex items-center gap-2">
                <Ambulance className="size-4 text-secondary" />
                {incident.responder.name} — {incident.responder.type}
              </p>
              <p className="text-xs text-muted-foreground">
                Distance: {incident.responder.distance} | ETA: {incident.responder.eta}
                {incident.responder.paramedic && ` | Paramedic: ${incident.responder.paramedic}`}
              </p>
            </section>

            <Separator />

            <section>
              <Label htmlFor="dispatcher-note" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Dispatcher Note (optional)
              </Label>
              <Input
                id="dispatcher-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add dispatch note..."
                className="mt-2"
              />
            </section>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 text-destructive hover:text-destructive"
                onClick={() => setRejectOpen(true)}
              >
                <XCircle className="mr-2 size-4" />
                Reject Request
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleApprove}
              >
                <CheckCircle2 className="mr-2 size-4" />
                Approve & Dispatch
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Dispatch Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting the dispatch request for{" "}
              {incident.id}.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Rejection reason..."
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
