"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { cn } from "@/lib/utils"

const STAFF = [
  { name: "Khalid Rahman", role: "Senior Dispatcher", status: "active", avatar: "/op-khalid-avatar.png" },
  { name: "Aisha Tan", role: "Dispatch Operator", status: "on_call" },
  { name: "Rizal Ibrahim", role: "EMS Coordinator", status: "active" },
  { name: "Mei Ling", role: "Dispatch Operator", status: "away" },
  { name: "Amir Hassan", role: "Supervisor", status: "active" },
  { name: "Priya Devi", role: "Dispatch Operator", status: "on_call" },
]

const STATUS_DOT: Record<string, string> = {
  active: "bg-secondary",
  on_call: "bg-warning",
  away: "bg-muted-foreground",
}

export function StaffPanel() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Staff Online
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {STAFF.map((member) => (
            <div key={member.name} className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="size-9">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    "absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-card",
                    STATUS_DOT[member.status]
                  )}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{member.name}</p>
                <p className="truncate text-xs text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
