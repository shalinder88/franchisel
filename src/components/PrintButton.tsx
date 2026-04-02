"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted hover:text-foreground hover:border-foreground transition-all"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.75 19.817m.465-6.024c.24.07.48.14.72.213m-1.185-.333c-.48-.07-.96-.14-1.44-.213m16.88.32a42.4 42.4 0 0 0-10.56 0m10.56 0L17.25 19.817M17.25 10.5H6.75m10.5 0v-2.25a.75.75 0 0 0-.75-.75H7.5a.75.75 0 0 0-.75.75v2.25m10.5 0v2.25a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V10.5" />
      </svg>
      Print / Save PDF
    </button>
  );
}
