"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted hover:text-foreground hover:border-foreground transition-all"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.75 19.5a.75.75 0 001.5 0V13.5a42.415 42.415 0 010-4.5m0 4.5L6.72 13.83m10.56 0L17.25 19.5a.75.75 0 001.5 0V13.5a42.415 42.415 0 000-4.5m0 4.5l.03-.001" />
      </svg>
      Print / Export
    </button>
  );
}
