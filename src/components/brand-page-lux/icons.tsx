// Custom stroke-1.5 icon set for mcd-lux. Kept intentionally small/low-chroma.
import type { SVGProps } from "react"

const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

export type IconName =
  | "territory"
  | "supplier"
  | "capex"
  | "operations"
  | "transfer"
  | "renewal"
  | "termination"
  | "post_term"
  | "royalty"
  | "advertising"
  | "rent"
  | "audit"
  | "flag"
  | "building"
  | "stack"
  | "growth"
  | "pause"
  | "eye"
  | "arrowUp"
  | "arrowDown"
  | "arrowRight"
  | "check"
  | "minus"
  | "info"
  | "shield"
  | "scale"
  | "cursor"
  | "clock"
  | "handshake"

export function Icon({ name, ...rest }: { name: IconName } & SVGProps<SVGSVGElement>) {
  const props = { ...base, ...rest }
  switch (name) {
    case "territory":
      return (
        <svg {...props} aria-hidden>
          <path d="M12 21s-7-6.3-7-12a7 7 0 0 1 14 0c0 5.7-7 12-7 12Z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      )
    case "supplier":
      return (
        <svg {...props} aria-hidden>
          <rect x="3" y="8" width="18" height="12" rx="2" />
          <path d="M7 8V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" />
        </svg>
      )
    case "capex":
      return (
        <svg {...props} aria-hidden>
          <path d="M14.7 6.3a4 4 0 0 1 0 5.6l-1.4 1.4-5.6-5.6L9.1 6.3a4 4 0 0 1 5.6 0Z" />
          <path d="m6 18 4.5-4.5" />
          <path d="m9 15 6 6" />
        </svg>
      )
    case "operations":
      return (
        <svg {...props} aria-hidden>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.5.7.9 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
        </svg>
      )
    case "transfer":
      return (
        <svg {...props} aria-hidden>
          <path d="M17 3l4 4-4 4" />
          <path d="M3 7h18" />
          <path d="M7 21l-4-4 4-4" />
          <path d="M21 17H3" />
        </svg>
      )
    case "renewal":
      return (
        <svg {...props} aria-hidden>
          <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
      )
    case "termination":
      return (
        <svg {...props} aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M5.6 5.6l12.8 12.8" />
        </svg>
      )
    case "post_term":
      return (
        <svg {...props} aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12h8" />
        </svg>
      )
    case "royalty":
      return (
        <svg {...props} aria-hidden>
          <path d="M12 2v20" />
          <path d="M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )
    case "advertising":
      return (
        <svg {...props} aria-hidden>
          <path d="M3 11v4l13 5V6L3 11Z" />
          <path d="M16 8a4 4 0 0 1 0 8" />
        </svg>
      )
    case "rent":
      return (
        <svg {...props} aria-hidden>
          <path d="M3 21V10l9-7 9 7v11" />
          <path d="M9 21v-7h6v7" />
        </svg>
      )
    case "audit":
      return (
        <svg {...props} aria-hidden>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
          <path d="M14 3v5h5" />
          <path d="m10 14 2 2 4-4" />
        </svg>
      )
    case "flag":
      return (
        <svg {...props} aria-hidden>
          <path d="M4 22V4" />
          <path d="M4 4h13l-2 4 2 4H4" />
        </svg>
      )
    case "building":
      return (
        <svg {...props} aria-hidden>
          <rect x="4" y="3" width="16" height="18" rx="1.5" />
          <path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2" />
        </svg>
      )
    case "stack":
      return (
        <svg {...props} aria-hidden>
          <path d="m12 3 9 5-9 5-9-5 9-5Z" />
          <path d="m3 13 9 5 9-5" />
        </svg>
      )
    case "growth":
      return (
        <svg {...props} aria-hidden>
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M21 7h-5" /><path d="M21 7v5" />
        </svg>
      )
    case "pause":
      return (
        <svg {...props} aria-hidden>
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      )
    case "eye":
      return (
        <svg {...props} aria-hidden>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    case "arrowUp":
      return (
        <svg {...props} aria-hidden>
          <path d="M12 19V5" /><path d="m5 12 7-7 7 7" />
        </svg>
      )
    case "arrowDown":
      return (
        <svg {...props} aria-hidden>
          <path d="M12 5v14" /><path d="m19 12-7 7-7-7" />
        </svg>
      )
    case "arrowRight":
      return (
        <svg {...props} aria-hidden>
          <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
        </svg>
      )
    case "check":
      return (
        <svg {...props} aria-hidden>
          <path d="m4 12 5 5L20 6" />
        </svg>
      )
    case "minus":
      return (
        <svg {...props} aria-hidden>
          <path d="M5 12h14" />
        </svg>
      )
    case "info":
      return (
        <svg {...props} aria-hidden>
          <circle cx="12" cy="12" r="9" /><path d="M12 16v-4" /><path d="M12 8h.01" />
        </svg>
      )
    case "shield":
      return (
        <svg {...props} aria-hidden>
          <path d="M12 21s8-4 8-10V5l-8-3-8 3v6c0 6 8 10 8 10Z" />
        </svg>
      )
    case "scale":
      return (
        <svg {...props} aria-hidden>
          <path d="M12 3v18" />
          <path d="M5 7h14" />
          <path d="M8 7l-3 7a3 3 0 0 0 6 0L8 7Z" />
          <path d="M16 7l-3 7a3 3 0 0 0 6 0l-3-7Z" />
        </svg>
      )
    case "cursor":
      return (
        <svg {...props} aria-hidden>
          <path d="M3 3l7 19 2-8 8-2L3 3Z" />
        </svg>
      )
    case "clock":
      return (
        <svg {...props} aria-hidden>
          <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
        </svg>
      )
    case "handshake":
      return (
        <svg {...props} aria-hidden>
          <path d="M11 17 7 13l3-3 4 4" />
          <path d="m13 7 3-3 4 4-6 6" />
          <path d="m21 13-4 4" /><path d="m3 11 4-4" />
        </svg>
      )
  }
}
