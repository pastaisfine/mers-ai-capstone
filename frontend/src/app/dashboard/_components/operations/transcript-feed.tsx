"use client"

import { useEffect, useRef } from "react"
import { Mic } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { Incident } from "@/types"

interface TranscriptFeedProps {
  incident: Incident
  fillHeight?: boolean
}

export function TranscriptFeed({ incident, fillHeight }: TranscriptFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [incident.transcript])

  const content = (
    <div className="space-y-3 pb-2">
      {incident.transcript.map((line, i) => {
        const speaker = line.speaker.toLowerCase()
        const isCaller = speaker === "caller" || speaker === "[caller]"
        const isOperator = speaker === "operator" || speaker === "[operator]"

        return (
          <div
            key={i}
            className={cn("flex flex-col gap-1", isOperator && "items-end")}
          >
            <span className="text-[10px] font-mono text-muted-foreground">
              [{line.speaker.toUpperCase()}] {line.time}
            </span>
            <div
              className={cn(
                "max-w-[92%] rounded-xl px-3 py-2 text-xs leading-relaxed",
                isCaller && "rounded-tl-sm bg-muted/80",
                isOperator && "rounded-tr-sm bg-primary text-primary-foreground",
                !isCaller && !isOperator && "bg-muted/80"
              )}
            >
              {line.text}
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )

  return (
    <section className={cn("flex flex-col", fillHeight && "h-full min-h-0")}>
      <div className="mb-3 flex shrink-0 items-center gap-2">
        <Mic className="size-3.5 text-primary" />
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Call Transcript
        </h3>
      </div>

      {fillHeight ? (
        <ScrollArea className="min-h-0 flex-1 pr-2">{content}</ScrollArea>
      ) : (
        <ScrollArea className="h-[320px] pr-2">{content}</ScrollArea>
      )}
    </section>
  )
}
