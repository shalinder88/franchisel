"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoIcon } from "./Logo";
import SearchBar from "./SearchBar";
import WatchlistNavBadge from "./WatchlistNavBadge";

const nav = [
  { href: "/brands", label: "Franchise Directory" },
  { href: "/compare", label: "Compare" },
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
          <Link href="/" className="flex items-center gap-2">
            <LogoIcon size={28} />
            <span className="text-lg font-bold tracking-tight" aria-label="Franchisel">
              Franchi<span className="text-accent">sel</span>
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:block">
            <SearchBar />
          </div>

          {/* Desktop nav */}
          <div className="hidden xl:flex items-center gap-1.5">
            {nav.map((item) =>
              item.href === "/watchlist" ? (
                <WatchlistNavBadge key={item.href} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3.5 py-1.5 text-[13px] font-medium text-muted hover:text-foreground rounded-md hover:bg-surface transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
            <Link
              href="/reports"
              className="ml-1 px-3 py-1.5 text-[12px] font-bold bg-accent text-white rounded-md hover:brightness-110 transition-all flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
              Get Report
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
