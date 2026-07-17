"use client"

import { useRef, useState, type ReactNode, type PointerEvent } from "react"
import { GripHorizontal } from "lucide-react"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface DraggableDialogContentProps {
  title: string
  description?: string
  className?: string
  children: ReactNode
}

export function DraggableDialogContent({
  title,
  description,
  className,
  children,
}: DraggableDialogContentProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragRef = useRef({ active: false, startX: 0, startY: 0, originX: 0, originY: 0 })

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active) return
    setOffset({
      x: dragRef.current.originX + (e.clientX - dragRef.current.startX),
      y: dragRef.current.originY + (e.clientY - dragRef.current.startY),
    })
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    dragRef.current.active = false
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  return (
    <DialogContent
      className={cn(className)}
      style={{
        transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
      }}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="flex cursor-grab items-center gap-2 rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 px-3 py-2 active:cursor-grabbing"
      >
        <GripHorizontal className="size-4 shrink-0 text-muted-foreground" />
        <DialogHeader className="flex-1 gap-0.5 text-left">
          <DialogTitle className="text-base">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
      </div>
      {children}
    </DialogContent>
  )
}
