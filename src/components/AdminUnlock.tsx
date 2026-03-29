"use client";

import { useEffect, useState } from "react";

/**
 * Client-side admin unlock. When the admin cookie is present,
 * this adds a CSS class to the body that removes all paywall blurs.
 *
 * The cookie is set by visiting /admin (middleware sets it).
 * Also supports ?unlock=admin URL param as fallback.
 */
export function AdminUnlock() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check cookie
    const hasAdminCookie = document.cookie.includes("franchisel_admin=1");
    // Check URL param
    const params = new URLSearchParams(window.location.search);
    const hasAdminParam = params.get("unlock") === "admin";

    if (hasAdminCookie || hasAdminParam) {
      setIsAdmin(true);
      document.documentElement.setAttribute("data-admin", "true");

      // If param was used, set cookie for future page views
      if (hasAdminParam && !hasAdminCookie) {
        document.cookie = "franchisel_admin=1; path=/; max-age=86400; SameSite=Lax";
      }
    }
  }, []);

  if (!isAdmin) return null;

  return (
    <>
      {/* Admin indicator bar */}
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-red-600 text-white text-center text-xs py-1 font-medium">
        ADMIN VIEW — All data ungated
      </div>
      {/* CSS overrides to remove all paywall blurs */}
      <style>{`
        html[data-admin="true"] .blur-sm { filter: none !important; }
        html[data-admin="true"] .pointer-events-none { pointer-events: auto !important; }
        html[data-admin="true"] .select-none { user-select: auto !important; }
        html[data-admin="true"] .opacity-40 { opacity: 1 !important; }
        html[data-admin="true"] .backdrop-blur-\\[2px\\] { backdrop-filter: none !important; }
        html[data-admin="true"] [class*="PaywallGate"] .absolute { display: none !important; }
        html[data-admin="true"] body { padding-top: 28px; }
        /* Hide the paywall overlay (the absolute positioned div inside relative) */
        html[data-admin="true"] .relative.rounded-xl.overflow-hidden > .absolute { display: none !important; }
      `}</style>
    </>
  );
}
