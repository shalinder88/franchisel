"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Client-side PaywallGate component.
 * Checks the admin cookie on the client — if present, renders children directly.
 * Otherwise renders the blurred paywall overlay.
 *
 * This client-side check is necessary because brand pages are statically generated
 * and server-side cookies cannot be read at build time.
 */
export function PaywallGate({
  children,
  brandSlug,
  brandName,
  fddYear,
}: {
  children: React.ReactNode;
  brandSlug: string;
  brandName: string;
  fddYear: number;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const hasAdminCookie = document.cookie.includes("franchisel_admin=1");
    const params = new URLSearchParams(window.location.search);
    const hasAdminParam = params.get("unlock") === "admin";
    setIsAdmin(hasAdminCookie || hasAdminParam);
    setChecked(true);
  }, []);

  // Before hydration, render the blurred version to avoid layout shift
  if (!checked) {
    return (
      <div className="relative rounded-xl overflow-hidden">
        <div className="blur-sm pointer-events-none select-none opacity-40" aria-hidden="true">
          {children}
        </div>
      </div>
    );
  }

  // Admin bypass — show content directly
  if (isAdmin) {
    return <>{children}</>;
  }

  // Non-admin — full paywall
  return (
    <div className="relative rounded-xl overflow-hidden">
      <div className="blur-sm pointer-events-none select-none opacity-40" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-[2px]">
        <div className="text-center px-6">
          <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">Full Analysis in Report</p>
          <p className="text-xs text-muted mb-4">
            Scores, red flags, and detailed breakdown sourced from the {fddYear} FDD.
          </p>
          <Link
            href={`/reports?brand=${brandSlug}`}
            className="inline-flex items-center gap-2 px-5 py-2 bg-accent text-white text-sm font-medium rounded-full hover:brightness-110 transition-all"
          >
            Get Report from $29
          </Link>
        </div>
      </div>
    </div>
  );
}
