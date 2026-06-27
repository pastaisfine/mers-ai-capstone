"use client"

import { useEffect, useState, type ReactNode } from "react"
import { TimeContext } from "./useTime"

function formatUtcPlus8(): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kuala_Lumpur",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date())
}

export function TimeProvider({ children }: { children: ReactNode }) {
  const [currentTimeText, setCurrentTimeText] = useState(formatUtcPlus8)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeText(formatUtcPlus8())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return <TimeContext value={{ currentTimeText }}>{children}</TimeContext>
}
