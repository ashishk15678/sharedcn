"use client";

import type React from "react";

import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  showRadialGradient?: boolean;
}

export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
}: AuroraBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute -top-1/4 left-1/4 h-[800px] w-[800px] rounded-full bg-primary blur-[120px]"
          style={{
            animation: "aurora-1 12s ease-in-out infinite",
            opacity: 0.6,
          }}
        />
        <div
          className="absolute top-1/3 right-1/4 h-[700px] w-[700px] rounded-full bg-chart-2 blur-[140px]"
          style={{
            animation: "aurora-2 15s ease-in-out infinite",
            animationDelay: "2s",
            opacity: 0.5,
          }}
        />
        <div
          className="absolute -bottom-1/4 left-1/2 h-[750px] w-[750px] rounded-full bg-chart-3 blur-[130px]"
          style={{
            animation: "aurora-3 18s ease-in-out infinite",
            animationDelay: "4s",
            opacity: 0.4,
          }}
        />
        {showRadialGradient && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,transparent_0%,hsl(var(--background))_70%)]" />
        )}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
