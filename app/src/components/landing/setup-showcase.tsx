"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Terminal,
  Layers,
  Database,
  Lock,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

export function SetupsShowcase() {
  const [copied, setCopied] = useState(false);
  const installCommand = "npx reactbits add auth";

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="setups"
      className="relative py-32 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden"
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/3 h-[500px] w-[500px] rounded-full bg-chart-2/30 blur-[120px] animate-float" />
        <div
          className="absolute bottom-0 right-1/3 h-[500px] w-[500px] rounded-full bg-primary/30 blur-[120px] animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1 max-w-2xl">
            <Badge
              variant="secondary"
              className="mb-6 rounded-full px-4 py-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20"
            >
              Configuration Setups
            </Badge>
            <h2 className="font-serif text-4xl font-bold md:text-6xl mb-6 tracking-tight leading-[1.1]">
              Powerful Setups.{" "}
              <span className="gradient-text">Zero Configuration.</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed">
              Skip the manual labor. Our setups provide production-ready
              configurations for the most popular libraries and frameworks. One
              command, complete architectural integration.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Smart Env Generation",
                  icon: Lock,
                  desc: "Auto-scaffolded .env files",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  title: "Middleware Ready",
                  icon: Layers,
                  desc: "Secure headers & protection",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  title: "Auto Migrations",
                  icon: Database,
                  desc: "Database schema sync",
                  color: "from-green-500 to-emerald-500",
                },
                {
                  title: "Type-Safe Hooks",
                  icon: Check,
                  desc: "End-to-end type safety",
                  color: "from-orange-500 to-red-500",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group flex flex-col gap-3 p-5 rounded-xl glass dark:glass-dark border border-border/50 transition-all duration-300 hover:border-primary/30 hover-lift cursor-default"
                >
                  <div
                    className={`h-10 w-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full relative">
            <Card className="p-0 overflow-hidden shadow-2xl border-2 border-primary/20 bg-[#0d1117] text-gray-300 hover-lift">
              {/* Enhanced Window Header */}
              <div className="bg-[#161b22] px-5 py-4 border-b border-[#30363d] flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="h-3.5 w-3.5 rounded-full bg-[#ff5f56] shadow-sm" />
                  <div className="h-3.5 w-3.5 rounded-full bg-[#ffbd2e] shadow-sm" />
                  <div className="h-3.5 w-3.5 rounded-full bg-[#27c93f] shadow-sm" />
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#0d1117] border border-[#30363d]">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-mono text-gray-300 font-medium">
                    auth-setup.config.ts
                  </span>
                </div>
                <div className="w-16" />
              </div>

              {/* Enhanced Code Content with syntax highlighting */}
              <div className="p-8 font-mono text-[13px] leading-loose overflow-x-auto min-h-[320px] bg-gradient-to-br from-[#0d1117] to-[#161b22]">
                <div className="space-y-1">
                  <p className="text-gray-500">
                    <span className="text-gray-600">1</span>
                  </p>
                  <p>
                    <span className="text-gray-600">2</span>{" "}
                    <span className="text-purple-400 font-semibold">
                      import
                    </span>{" "}
                    {"{"} <span className="text-blue-300">auth</span> {"}"}{" "}
                    <span className="text-purple-400 font-semibold">from</span>{" "}
                    <span className="text-green-400">"@/lib/auth"</span>;
                  </p>
                  <p>
                    <span className="text-gray-600">3</span>{" "}
                    <span className="text-purple-400 font-semibold">
                      import
                    </span>{" "}
                    {"{"} <span className="text-blue-300">db</span> {"}"}{" "}
                    <span className="text-purple-400 font-semibold">from</span>{" "}
                    <span className="text-green-400">"@/lib/db"</span>;
                  </p>
                  <p className="text-gray-600">4</p>
                  <p>
                    <span className="text-gray-600">5</span>{" "}
                    <span className="text-purple-400 font-semibold">
                      export const
                    </span>{" "}
                    <span className="text-yellow-300 font-semibold">
                      config
                    </span>{" "}
                    = {"{"}
                  </p>
                  <p className="pl-6">
                    <span className="text-gray-600">6</span>{" "}
                    <span className="text-blue-300">provider</span>:{" "}
                    <span className="text-green-400">"better-auth"</span>,
                  </p>
                  <p className="pl-6">
                    <span className="text-gray-600">7</span>{" "}
                    <span className="text-blue-300">adapter</span>:{" "}
                    <span className="text-yellow-300">db</span>.
                    <span className="text-blue-300">adapter</span>,
                  </p>
                  <p className="pl-6">
                    <span className="text-gray-600">8</span>{" "}
                    <span className="text-blue-300">session</span>: {"{"}
                  </p>
                  <p className="pl-12 text-gray-500 italic">
                    <span className="text-gray-600">9</span> // production-grade
                    security defaults
                  </p>
                  <p className="pl-12">
                    <span className="text-gray-600">10</span>{" "}
                    <span className="text-blue-300">expiresIn</span>:{" "}
                    <span className="text-orange-400">"30d"</span>,
                  </p>
                  <p className="pl-12">
                    <span className="text-gray-600">11</span>{" "}
                    <span className="text-blue-300">updateAge</span>:{" "}
                    <span className="text-orange-400">"24h"</span>,
                  </p>
                  <p className="pl-6">
                    <span className="text-gray-600">12</span> {"}"},
                  </p>
                  <p>
                    <span className="text-gray-600">13</span> {"}"};
                  </p>
                </div>
              </div>

              {/* Enhanced CLI Bar with copy functionality */}
              <div className="bg-[#161b22] p-5 border-t border-[#30363d]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-chart-2/20 flex items-center justify-center text-primary ring-2 ring-primary/30">
                      <Terminal className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                        CLI Command
                      </span>
                      <code className="text-sm text-primary font-bold">
                        {installCommand}
                      </code>
                    </div>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="h-10 px-4 rounded-lg glass dark:glass-dark border border-border/50 hover:border-primary/50 transition-all hover:scale-105 flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-primary">
                          Copied!
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">
                          Copy
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Card>

            <div className="absolute -top-8 -right-8 hidden xl:block animate-slide-up-fade">
              <div className="glass dark:glass-dark rounded-2xl p-5 shadow-2xl w-64 border-2 border-primary/20 hover-lift">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center ring-2 ring-green-500/30">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-foreground">
                      Auth Verified
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Production ready
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-gradient-to-r from-primary/20 to-chart-2/20 rounded-full animate-pulse" />
                  <div
                    className="h-2 w-2/3 bg-gradient-to-r from-chart-2/20 to-primary/20 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="h-2 w-1/2 bg-gradient-to-r from-primary/20 to-chart-2/20 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
