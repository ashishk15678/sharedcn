"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Code2, Menu, X } from "lucide-react";
import { useState } from "react";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass dark:glass-dark">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-2 shadow-lg transition-all group-hover:scale-110 group-hover:rotate-6">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              ReactBits
            </span>
          </Link>

          <nav className="hidden md:flex md:items-center md:gap-1">
            <Link
              href="#features"
              className="px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-primary/10 rounded-lg"
            >
              Features
            </Link>
            <Link
              href="#marketplace"
              className="px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-primary/10 rounded-lg"
            >
              Components
            </Link>
            <Link
              href="#setups"
              className="px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-primary/10 rounded-lg"
            >
              Setups
            </Link>
            <Link
              href="/docs"
              className="px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-primary/10 rounded-lg"
            >
              Docs
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all rounded-lg hover:bg-muted/50"
          >
            Sign In
          </Link>
          <Button
            asChild
            size="sm"
            className="shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-chart-2 border-0 hover:scale-105 transition-transform"
          >
            <Link href="/dashboard">Dashboard</Link>
          </Button>

          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-all rounded-lg hover:bg-muted/50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t glass dark:glass-dark animate-slide-up-fade">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <Link
              href="#features"
              className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#marketplace"
              className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Components
            </Link>
            <Link
              href="#setups"
              className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Setups
            </Link>
            <Link
              href="/docs"
              className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
