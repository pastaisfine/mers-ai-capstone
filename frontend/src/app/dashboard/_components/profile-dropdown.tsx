"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth/useAuth"
import { supabase } from "@/lib/supabaseClient"
import { getInitials } from "@/lib/utils"
import type { UserProfile } from "@/types"

export function ProfileDropdown() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>({
    full_name: "Operator",
    role: "Dispatcher",
    unit: "Dispatch Unit",
  })

  useEffect(() => {
    async function loadProfile() {
      if (!user) return

      const { data } = await supabase
        .from("profiles")
        .select("avatar_url, full_name, role, unit")
        .eq("id", user.id)
        .maybeSingle()

      if (data) {
        setProfile({
          avatar_url: data.avatar_url ?? undefined,
          full_name: data.full_name ?? user.email?.split("@")[0] ?? "Operator",
          role: data.role ?? "Dispatcher",
          unit: data.unit ?? "Dispatch Unit",
        })
      } else {
        setProfile({
          avatar_url: user.user_metadata?.avatar_url,
          full_name:
            user.user_metadata?.full_name ??
            user.email?.split("@")[0] ??
            "Operator",
          role: user.user_metadata?.role ?? "Dispatcher",
          unit: user.user_metadata?.unit ?? "Dispatch Unit",
        })
      }
    }

    loadProfile()
  }, [user])

  const initials = getInitials(profile.full_name)

  async function handleLogout() {
    await signOut()
    router.push("/authpage")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer ring-2 ring-primary/50 transition-all hover:ring-primary">
          <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{profile.full_name}</p>
              <p className="text-xs text-muted-foreground">{profile.role}</p>
              <p className="text-xs text-muted-foreground">{profile.unit}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem>
          <User className="mr-2 size-4" /> My Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 size-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
