interface RedFlagBadgeProps {
  severity: "critical" | "warning" | "info";
  count?: number;
}

const config = {
  critical: {
    bg: "bg-danger-light",
    text: "text-danger",
    border: "border-danger/20",
    label: "Critical",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
    ),
  },
  warning: {
    bg: "bg-warning-light",
    text: "text-warning",
    border: "border-warning/20",
    label: "Warning",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.007v.008H12v-.008Zm0-13.5a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" />
      </svg>
    ),
  },
  info: {
    bg: "bg-accent-light",
    text: "text-accent",
    border: "border-accent/20",
    label: "Info",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
      </svg>
    ),
  },
} as const;

export default function RedFlagBadge({ severity, count }: RedFlagBadgeProps) {
  const c = config[severity];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}
    >
      {c.icon}
      {count !== undefined ? count : c.label}
    </span>
  );
}
