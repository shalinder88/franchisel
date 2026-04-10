"use client"
import type { ReactNode } from "react"

type Props = {
  content: ReactNode
  children: ReactNode
  position?: "top" | "bottom"
}

export default function HoverTooltip({ content, children, position = "top" }: Props) {
  const pos =
    position === "top"
      ? "bottom-full left-1/2 -translate-x-1/2 mb-2"
      : "top-full left-1/2 -translate-x-1/2 mt-2"

  return (
    <span className="relative group/tip inline-flex">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute ${pos} z-30 w-max max-w-[260px]
          rounded-lg border border-border bg-surface px-3 py-2
          text-xs text-foreground/85 leading-relaxed shadow-lg shadow-black/30
          opacity-0 scale-95 group-hover/tip:opacity-100 group-hover/tip:scale-100
          transition-all duration-150 origin-bottom`}
      >
        {content}
      </span>
    </span>
  )
}
