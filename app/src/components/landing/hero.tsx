"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Terminal,
  Copy,
  Check,
  Sparkles,
  Code2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { GridPattern } from "@/components/ui/grid-pattern";
import { useState, useEffect } from "react";

export function Hero() {
  const [copied, setCopied] = useState(false);
  const installCommand = "npx reactbits@latest add";
  const [activeDemo, setActiveDemo] = useState(0);

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const demoComponents = [
    { name: "Button", icon: Sparkles, color: "from-blue-500 to-cyan-500" },
    { name: "Card", icon: Code2, color: "from-purple-500 to-pink-500" },
    { name: "Input", icon: Zap, color: "from-orange-500 to-red-500" },
  ];

  return (
    <AuroraBackground className="relative min-h-screen bg-background">
      <GridPattern />
      <section className="relative z-10 flex min-h-screen items-center py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column - Content */}
            <div className="flex flex-col items-start text-left space-y-8">
              <Badge
                variant="secondary"
                className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm animate-border-glow"
              >
                <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Build faster. Ship smarter.
              </Badge>

              <h1 className="max-w-2xl font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1]">
                React components
                <br />
                <span className="gradient-text">that just work</span>
              </h1>

              <p className="max-w-xl text-balance text-lg text-muted-foreground md:text-xl leading-relaxed">
                Production-ready React components and full-stack setups. Copy,
                paste, ship. No dependencies hell, no setup nightmares.
              </p>

              <div className="flex flex-col items-start gap-6 w-full">
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-base shadow-xl shadow-primary/30 hover-lift bg-gradient-to-r from-primary to-chart-2 border-0"
                    asChild
                  >
                    <Link href="/components">
                      Browse Components <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-base glass dark:glass-dark hover-lift bg-transparent"
                    asChild
                  >
                    <Link href="/setups">View Setups</Link>
                  </Button>
                </div>

                <div className="group relative flex h-14 w-full sm:w-auto items-center gap-3 rounded-xl border border-border/50 glass dark:glass-dark px-6 font-mono text-sm shadow-lg transition-all hover:border-primary/50 hover:shadow-xl">
                  <Terminal className="h-5 w-5 text-primary" />
                  <span className="text-foreground font-medium">
                    {installCommand}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="ml-auto text-muted-foreground transition-all hover:text-foreground hover:scale-110"
                    aria-label="Copy install command"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-primary" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-10 w-10 rounded-full ring-2 ring-background bg-gradient-to-br from-primary/30 to-chart-2/30 backdrop-blur-sm"
                      />
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-foreground">
                      2,500+ developers
                    </div>
                    <div className="text-muted-foreground">
                      building with ReactBits
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block h-12 w-px bg-border" />
                <div className="flex gap-6">
                  <div className="text-sm">
                    <div className="font-bold text-2xl text-foreground">
                      150+
                    </div>
                    <div className="text-muted-foreground">Components</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-bold text-2xl text-foreground">
                      50+
                    </div>
                    <div className="text-muted-foreground">Setups</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Interactive Component Preview */}
            <div className="relative hidden lg:block">
              <div className="relative w-full h-[600px]">
                {/* Floating component cards */}
                {demoComponents.map((component, index) => {
                  const Icon = component.icon;
                  const isActive = activeDemo === index;
                  const offset = (index - 1) * 120;

                  return (
                    <div
                      key={component.name}
                      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out ${
                        isActive
                          ? "scale-110 z-20 opacity-100"
                          : "scale-90 opacity-40"
                      }`}
                      style={{
                        transform: `translate(-50%, calc(-50% + ${offset}px)) scale(${isActive ? 1.1 : 0.9})`,
                      }}
                    >
                      <div className="glass dark:glass-dark rounded-2xl p-8 shadow-2xl hover-lift backdrop-blur-xl border-2 border-white/20 dark:border-white/10 min-w-[320px]">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-12 w-12 rounded-xl bg-gradient-to-br ${component.color} flex items-center justify-center shadow-lg`}
                            >
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-foreground">
                                {component.name}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                Component
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary border-primary/20"
                          >
                            Live
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div
                            className="h-10 bg-muted/50 rounded-lg animate-shimmer"
                            style={{
                              background:
                                "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                              backgroundSize: "200% 100%",
                            }}
                          />
                          <div className="h-8 bg-muted/30 rounded-lg w-3/4" />
                          <div className="h-8 bg-muted/30 rounded-lg w-1/2" />
                        </div>

                        <div className="mt-6 flex gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                          <div
                            className="h-2 w-2 rounded-full bg-chart-2 animate-pulse"
                            style={{ animationDelay: "0.2s" }}
                          />
                          <div
                            className="h-2 w-2 rounded-full bg-chart-3 animate-pulse"
                            style={{ animationDelay: "0.4s" }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Decorative floating elements */}
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-primary/20 blur-3xl animate-float" />
                <div
                  className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-chart-2/20 blur-3xl animate-float"
                  style={{ animationDelay: "2s" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </AuroraBackground>
  );
}
