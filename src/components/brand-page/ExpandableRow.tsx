"use client"
import { useState, type ReactNode } from "react"

type Props = {
  severity?: "neutral" | "caution" | "high"
  title: string
  subtitle?: string
  badge?: string
  badgeColor?: string
  children: ReactNode
  defaultOpen?: boolean
}

const DOT: Record<string, string> = {
  high: "bg-danger",
  caution: "bg-warning",
  neutral: "bg-accent/60",
}

export default function ExpandableRow({
  severity,
  title,
  subtitle,
  badge,
  badgeColor,
  children,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="group/row">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-surface-alt transition-all duration-200"
      >
        {severity && (
          <span
            aria-hidden
            className={`h-2.5 w-2.5 rounded-full shrink-0 ${DOT[severity] ?? DOT.neutral}`}
          />
        )}
        <span className="text-sm font-semibold text-foreground flex-1 min-w-0">
          {title}
        </span>
        {subtitle && (
          <span className="hidden sm:block text-xs text-muted truncate max-w-[40%]">
            {subtitle}
          </span>
        )}
        {badge && (
          <span
            className={`text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded ${
              badgeColor ?? "text-muted"
            }`}
          >
            {badge}
          </span>
        )}
        <svg
          className={`w-4 h-4 text-muted shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5 pt-1">{children}</div>
      </div>
    </div>
  )
}
