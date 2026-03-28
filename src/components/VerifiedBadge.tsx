interface VerifiedBadgeProps {
  date: string;
  source?: string;
}

export default function VerifiedBadge({ date, source }: VerifiedBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success-light text-success border border-success/20">
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      <span>Verified {date}</span>
      {source && (
        <>
          <span className="text-success/40">|</span>
          <span>{source}</span>
        </>
      )}
    </span>
  );
}
