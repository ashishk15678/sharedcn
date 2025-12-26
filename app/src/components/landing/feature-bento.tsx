"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Layout,
  Zap,
  Package,
  Code2,
  ShieldCheck,
  GitBranch,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const features = [
  {
    title: "Component Marketplace",
    description:
      "Discover production-ready React components with Tailwind CSS and Radix UI. Every component is tested, accessible, and customizable.",
    icon: Layout,
    className: "md:col-span-2 lg:row-span-2",
    badge: "150+ Components",
    highlight: true,
    gradient: "from-blue-500/10 via-cyan-500/10 to-blue-500/10",
  },
  {
    title: "One-Command Setups",
    description:
      "Install complete configurations like Better Auth, tRPC, or Prisma instantly.",
    icon: Zap,
    className: "md:col-span-1",
    badge: "50+ Setups",
    gradient: "from-purple-500/10 via-pink-500/10 to-purple-500/10",
  },
  {
    title: "Registry Driven",
    description:
      "Direct integration with your project through our CLI. No complex setup or configuration.",
    icon: Package,
    className: "md:col-span-1",
    badge: "Zero Config",
    gradient: "from-orange-500/10 via-red-500/10 to-orange-500/10",
  },
  {
    title: "Type Safety First",
    description:
      "Full TypeScript support with strict typing for maximum reliability and IntelliSense.",
    icon: Code2,
    className: "md:col-span-1",
    badge: "TypeScript",
    gradient: "from-green-500/10 via-emerald-500/10 to-green-500/10",
  },
  {
    title: "Version Control",
    description:
      "Track component updates and maintain consistency across your entire design system.",
    icon: GitBranch,
    className: "md:col-span-1",
    badge: "Git Ready",
    gradient: "from-indigo-500/10 via-purple-500/10 to-indigo-500/10",
  },
  {
    title: "AI-Powered Search",
    description:
      "Find exactly what you need with semantic search and AI-powered recommendations.",
    icon: Sparkles,
    className: "md:col-span-1 lg:col-span-1",
    badge: "New",
    gradient: "from-pink-500/10 via-rose-500/10 to-pink-500/10",
  },
  {
    title: "Production Ready",
    description:
      "Battle-tested patterns used by teams at top companies. Enterprise-grade security and performance.",
    icon: ShieldCheck,
    className: "md:col-span-1",
    badge: "Enterprise",
    gradient: "from-amber-500/10 via-yellow-500/10 to-amber-500/10",
  },
];

export function FeatureBento() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="features"
      className="relative py-32 bg-background overflow-hidden"
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[100px] animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-chart-2/20 blur-[100px] animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <Badge
            variant="secondary"
            className="mb-6 rounded-full px-4 py-1.5 text-xs font-medium border border-primary/20 bg-primary/10 text-primary"
          >
            Features
          </Badge>
          <h2 className="font-serif text-4xl font-bold tracking-tight md:text-6xl mb-6">
            Everything you need to{" "}
            <span className="gradient-text">build faster</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed md:text-xl">
            Stop wasting time on boilerplate. ReactBits provides the tools and
            components to ship production-ready applications in hours, not
            weeks.
          </p>
        </div>

        <div className="grid auto-rows-fr grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group relative overflow-hidden transition-all duration-500 hover-lift border-border/50 ${
                feature.className
              } ${
                feature.highlight
                  ? "glass dark:glass-dark border-2 border-primary/30"
                  : "glass dark:glass-dark"
              } ${hoveredIndex === index ? "animate-glow-pulse" : ""}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <CardHeader className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-chart-2/20 text-primary ring-2 ring-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:ring-primary/50 backdrop-blur-sm">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-background/50 px-3 py-1 text-xs font-medium backdrop-blur-sm border border-border/50"
                  >
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="mt-6 text-2xl font-bold">
                  {feature.title}
                </CardTitle>
                <CardDescription className="mt-3 leading-relaxed text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              {feature.highlight && (
                <CardContent className="relative z-10">
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Buttons",
                      "Forms",
                      "Cards",
                      "Tables",
                      "Charts",
                      "Modals",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-lg glass dark:glass-dark px-3 py-1.5 text-sm font-medium border border-border/50 hover:border-primary/50 transition-all hover:scale-105 cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
