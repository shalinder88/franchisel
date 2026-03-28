"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/brands?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center">
        <svg
          className="absolute left-3 w-3.5 h-3.5 text-muted pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search franchise brands..."
          className="w-56 pl-9 pr-3 py-1.5 text-xs bg-surface border border-border rounded-lg focus:border-accent focus:ring-1 focus:ring-accent outline-none placeholder:text-muted/60 transition-all"
        />
      </div>
    </form>
  );
}
