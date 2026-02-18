import { BreatheText } from "@/components/breathing-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Terminal,
  Upload,
  Download,
  Zap,
  Layout,
  Code2,
  Inspect,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import Image from "next/image";
import { AppHeader } from "@/components/app-header";
import { SiteHeader } from "@/components/landing/site-header";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-primary font-sans selection:bg-secondary selection:text-primary">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <SiteHeader />
        </div>
      </header>

      <main className="pt-60 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-6 text-center mb-24">
          <Badge
            variant="outline"
            className="mb-6 border-border text-primary/60 py-1 px-4"
          >
            New v2 release
          </Badge>

          <BreatheText text="sharedcn" className="mb-4" />
          <div className="py-20">
            <h1 className="text-4xl md:text-6xl  tracking-tight mb-6 text-balance ">
              The Component Marketplace <br className="hidden md:block" /> for
              the Modern Web.
            </h1>
            <p className="text-lg md:text-xl text-primary/60 max-w-2xl mx-auto mb-10 text-balance">
              Find, download, and install beautiful components with a single CLI
              command. Build your own components and share them with the world.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-2 font-mono text-sm group">
                <Terminal className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
                <span className="text-primary/80">npx sharedcn add button</span>
                <button className="ml-2 p-1 hover:bg-white/10 rounded transition-colors">
                  <Download className="w-4 h-4 text-primary/40" />
                </button>
              </div>
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 font-bold px-8"
              >
                Explore Marketplace
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 mb-32">
          <div className="grid md:grid-cols-3  ">
            <div className="ring ring-border py-4 px-6">
              <div className="bg-white/10 rounded-lg flex flex-row items-center justify-center p-6 gap-x-4 ">
                <Inspect className="w-6 h-6" />
                <h3 className="text-xl font-bold">Instant Installation</h3>
              </div>
              <p className="text-primary/60">
                No more copy-pasting code. Use our CLI to add components
                directly to your project in seconds.
              </p>
            </div>
            <div className="ring ring-border py-4 px-6">
              <div className="bg-white/10 rounded-lg flex flex-row items-center justify-center p-6 gap-x-4 ">
                <Upload className="w-6 h-6" />
                <h3 className="text-xl font-bold ">Creator Dashboard</h3>
              </div>
              <p className="text-primary/60">
                A powerful dashboard for component creators. Manage, version,
                and monetize your UI assets with ease.
              </p>
            </div>{" "}
            <div className="ring ring-border py-4 px-6">
              <div className="bg-white/10 rounded-lg flex flex-row items-center justify-center p-6 gap-x-4 ">
                <Layout className="w-6 h-6" />
                <h3 className="text-xl font-bold ">High Quality UI</h3>
              </div>
              <p className="text-primary/60">
                Every component is vetted for quality, performance, and
                accessibility. Build with confidence.
              </p>
            </div>
          </div>{" "}
        </section>

        {/* Call to Action */}
        <section className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto py-20 px-10 rounded-3xl border border-border bg-gradient-to-b from-secondary to-transparent">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to share your work?
            </h2>
            <p className="text-lg text-primary/60 mb-10 max-w-xl mx-auto">
              Join creators building the future of shared components. Build your
              components , and share them with the world.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-primary text-accent hover:bg-primary/80 font-bold px-10 w-full sm:w-auto"
              >
                Dash Board
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-primary hover:bg-white/10 px-10 w-full sm:w-auto bg-transparent"
              >
                Read the Docs
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <Image src="/shadcn-logo.png" alt="Logo" width={24} height={24} />
            </div>
            <span className="font-bold text-lg tracking-tight">sharedcn</span>
          </div>
          <p className="text-sm text-primary/40">
            © 2025 sharedcn. Built for developers by developers.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://x.com/ashishonsol"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/40 hover:text-primary transition-colors"
            >
              <span className="sr-only">Twitter</span>𝕏
            </a>
            <a
              href="https://github.com/ashishk15678/sharedcn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/40 hover:text-primary transition-colors"
            >
              <span className="sr-only">GitHub</span>GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
