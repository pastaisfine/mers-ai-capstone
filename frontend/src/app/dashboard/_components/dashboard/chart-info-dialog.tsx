"use client"

import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface ChartInfoDialogProps {
  title: string
  children: React.ReactNode
}

export function ChartInfoDialog({ title, children }: ChartInfoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <Info className="size-4.5" />
          <span className="sr-only">Why this chart matters</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl lg:text-2xl underline">{title}</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-8 text-left text-base leading-relaxed text-foreground/90 lg:text-lg">
              {children}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
