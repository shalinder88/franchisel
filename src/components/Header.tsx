"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoIcon } from "./Logo";
import SearchBar from "./SearchBar";
import WatchlistNavBadge from "./WatchlistNavBadge";

const nav = [
  { href: "/brands", label: "Franchise Directory" },
  { href: "/compare", label: "Compare" },
  { href: "/tools", label: "Tools" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/reports", label: "Reports" },
  { href: "/community", label: "Community" },
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <LogoIcon size={26} />
            <span className="text-base font-bold tracking-tight" aria-label="Franchisel">
              Franchi<span className="text-accent">sel</span>
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:block flex-1 max-w-xs mx-6">
            <SearchBar />
          </div>

          {/* Desktop nav */}
          <div className="hidden xl:flex items-center gap-0.5">
            {nav.map((item) =>
              item.href === "/watchlist" ? (
                <WatchlistNavBadge key={item.href} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 text-[13px] font-medium text-muted hover:text-foreground rounded-md hover:bg-surface transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
            <Link
              href="/brands"
              className="ml-2 px-4 py-1.5 text-[13px] font-semibold bg-accent text-white rounded-lg hover:brightness-110 transition-all"
            >
              Start Research
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="xl:hidden p-1.5 text-muted hover:text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="xl:hidden pb-3 pt-1 space-y-0.5">
            {nav.map((item) =>
              item.href === "/watchlist" ? (
                <div key={item.href} onClick={() => setOpen(false)}>
                  <WatchlistNavBadge />
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-surface rounded-md transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
