"use client"

import { useEffect, useState } from "react"
import { Search, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { getInitials } from "@/lib/utils"

interface StaffMember {
  id: string
  full_name: string
  role: string
  unit?: string | null
  avatar_url?: string | null
  email?: string | null
}

export function StaffPanel() {
  const [staff, setStaff]           = useState<StaffMember[]>([])
  const [search, setSearch]         = useState("")
  const [loading, setLoading]       = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStaff() {
      try {
        const res  = await fetch("/api/staff")
        const text = await res.text()

        // Guard: if the server returns an empty body (unhandled crash), give a clear message
        if (!text.trim()) {
          const msg = `Server returned HTTP ${res.status} with no body. Check the Next.js server console for errors.`
          console.error("[StaffPanel]", msg)
          setFetchError(msg)
          return
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const json: any = JSON.parse(text)

        if (!res.ok) {
          const msg: string = json?.error ?? `Server error ${res.status}`
          console.error("[StaffPanel]", msg)
          setFetchError(
            msg.includes("SUPABASE_SERVICE_ROLE_KEY")
              ? "Add SUPABASE_SERVICE_ROLE_KEY to your .env.local file. " +
                "Find it in Supabase → Project Settings → API → service_role key."
              : msg
          )
          return
        }

        setStaff(json as StaffMember[])
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Network error"
        console.error("[StaffPanel]", msg)
        setFetchError(msg)
      } finally {
        setLoading(false)
      }
    }

    fetchStaff()
  }, [])

  const filtered = staff.filter((m) => {
    const q = search.toLowerCase()
    return (
      m.full_name?.toLowerCase().includes(q) ||
      m.role?.toLowerCase().includes(q) ||
      m.unit?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q)
    )
  })

  return (
    <Card className="h-full transition-all duration-200 hover:border-secondary hover:shadow-secondary hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            All Staff
          </CardTitle>
          {!loading && !fetchError && (
            <span className="text-[10px] font-medium tabular-nums text-muted-foreground">
              {filtered.length} / {staff.length}
            </span>
          )}
        </div>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, role, or unit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex animate-pulse items-center gap-3">
                <div className="size-9 shrink-0 rounded-full bg-muted" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-2/3 rounded bg-muted" />
                  <div className="h-2.5 w-1/2 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <AlertCircle className="size-6 text-destructive/70" />
            <p className="text-xs font-medium text-destructive">Failed to load staff</p>
            <p className="max-w-[230px] text-[11px] leading-relaxed text-muted-foreground">
              {fetchError}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-xs text-muted-foreground">
            {search ? "No staff match your search." : "No staff found."}
          </p>
        ) : (
          <div className="max-h-[340px] space-y-0.5 overflow-y-auto pr-1">
            {filtered.map((member) => (
              <div
                key={member.id}
                className="group flex cursor-default items-center gap-3 rounded-lg p-2 transition-all duration-150 hover:bg-secondary/10"
              >
                <div className="relative shrink-0">
                  <Avatar className="size-9 transition-all duration-150 group-hover:ring-2 group-hover:ring-secondary/50">
                    <AvatarImage src={member.avatar_url ?? undefined} alt={member.full_name} />
                    <AvatarFallback className="text-xs">
                      {getInitials(member.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-card bg-secondary" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium transition-colors duration-150 group-hover:text-secondary">
                    {member.full_name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {member.role}
                    {member.unit ? ` · ${member.unit}` : ""}
                    {!member.unit && member.email ? ` · ${member.email}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
