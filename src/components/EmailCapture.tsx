"use client";

import { useState } from "react";

interface EmailCaptureProps {
  title?: string;
  description?: string;
  buttonText?: string;
}

export default function EmailCapture({
  title = "Get franchise intel delivered",
  description = "Weekly FDD deep-dives, red flag alerts, and verified franchisee data — free, no spam.",
  buttonText = "Subscribe",
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");

  return (
    <div className="rounded-2xl border border-border bg-surface-alt p-6 sm:p-8">
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted mb-5 leading-relaxed">{description}</p>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col sm:flex-row gap-3"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          required
        />
        <button
          type="submit"
          className="px-6 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors shrink-0"
        >
          {buttonText}
        </button>
      </form>

      <p className="mt-3 text-[11px] text-muted">
        No spam, ever. Unsubscribe anytime. Read our{" "}
        <a href="/privacy" className="underline hover:text-foreground transition-colors">
          privacy policy
        </a>
        .
      </p>
    </div>
  );
}
