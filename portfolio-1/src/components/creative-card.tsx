import type React from "react"
import { cn } from "@/lib/utils"

interface CreativeCardProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "tilted" | "torn" | "highlighted"
  hover?: boolean
}

export function CreativeCard({ children, className, variant = "default", hover = true }: CreativeCardProps) {
  const variants = {
    default: "bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl",
    tilted: "bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl transform rotate-1 hover:rotate-0",
    torn: "bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl relative before:absolute before:top-0 before:right-0 before:w-4 before:h-4 before:bg-orange-500/20 before:transform before:rotate-45 before:-translate-y-2 before:translate-x-2",
    highlighted:
      "bg-black/40 backdrop-blur-xl border border-orange-500/30 rounded-2xl relative before:absolute before:top-2 before:left-2 before:w-8 before:h-1 before:bg-orange-500 before:rounded-full before:opacity-60",
  }

  return (
    <div
      className={cn(
        variants[variant],
        hover && "hover:bg-black/60 hover:border-white/20 hover:scale-[1.02] transition-all duration-300",
        className,
      )}
    >
      {children}
    </div>
  )
}
