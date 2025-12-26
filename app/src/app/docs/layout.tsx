"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const sections = [
  { id: "installation", label: "Installation" },
  { id: "cli", label: "CLI Usage" },
  { id: "dashboard", label: "Dashboard" },
  { id: "api", label: "API Endpoints" },
  { id: "onboarding", label: "Onboarding & Auth" },
  { id: "tech", label: "Tech Stack" },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen w-full flex flex-row bg-gradient-to-b from-zinc-50 to-white">
      {/* Sidebar nav, fixed, flush left, no border radius/shadow */}
      <aside className="hidden md:flex h-screen w-64 bg-zinc-100 border-r border-zinc-300 flex-col py-8 px-4 z-20">
        <Link
          href="/docs"
          className="text-2xl font-extrabold text-zinc-100 tracking-tight mb-8"
        >
          Docs
        </Link>
        <nav className="flex flex-col gap-1">
          {sections.map((s) => (
            <Link
              key={s.id}
              href={`/docs/${s.id}`}
              className="text-zinc-400 hover:text-yellow-400 px-3 py-2 rounded transition-colors font-medium"
              prefetch={true}
            >
              {s.label}
            </Link>
          ))}
        </nav>
      </aside>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-4 right-4 z-30 p-2 rounded-lg bg-zinc-100 ring ring-zinc-300 text-yellow-400 hover:bg-zinc-200 transition"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 right-0 bg-black/40 flex transition-all">
          <div className="bg-zinc-100 w-5/6 max-w-xs h-full shadow-2xl p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between mb-8">
              <span className="text-2xl font-extrabold text-yellow-400">
                Docs
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-zinc-900" />
              </button>
            </div>
            {sections.map((s) => (
              <Link
                key={s.id}
                href={`/docs/${s.id}`}
                className="text-zinc-700 text-lg py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {s.label}
              </Link>
            ))}
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
      {/* Main content area, scrollable, open, with max width and modern card */}
      <main className="flex-1 flex flex-col items-center min-h-screen overflow-y-auto w-full px-2 md:px-0">
        <div className="w-full max-w-4xl px-2 md:px-6 py-12">
          <div className="w-full bg-white/90 rounded-2xl shadow-lg p-4 md:p-8 text-zinc-800 border border-zinc-200">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
