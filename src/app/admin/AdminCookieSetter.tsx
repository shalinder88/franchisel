"use client";

import { useEffect } from "react";

/**
 * Sets the admin cookie when the admin layout loads.
 * Since the user already passed Basic Auth to reach /admin,
 * we can safely set the cookie client-side.
 */
export function AdminCookieSetter() {
  useEffect(() => {
    document.cookie = "franchisel_admin=1; path=/; max-age=86400; SameSite=Lax";
  }, []);
  return null;
}
