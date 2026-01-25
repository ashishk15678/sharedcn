"use client";

import React, { useMemo } from "react";
import { ComponentRenderer } from "./component-renderer";
import { cn } from "@/lib/utils";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";

type ComponentEntity = inferRouterOutputs<AppRouter>["components"]["list"][number];

interface ComponentCardProps {
  item: ComponentEntity;
}

export function ComponentCard({ item }: ComponentCardProps) {
  const { previewCode, tags, extras, isSetupCard } = useMemo(() => {
    // Use new schema fields directly
    const tags = item.tags || [];
    const extras = item.dependencies || [];
    
    // Determine Type using new type field
    const isSetupCard = 
        item.type === "setup" || 
        tags.some(t => t.toLowerCase().includes("setup")) || 
        item.alias?.toLowerCase().includes("setup");

    // Build Preview Code
    const files = item.files ?? [];
    const main = files.find((f) => f.filename === item.mainFile) ?? files[0];
    const previewCode = main?.code ?? "";

    return { previewCode, tags, extras, isSetupCard };
  }, [item]);

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-zinc-200/70 bg-white/50 backdrop-blur-lg px-3 py-3 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50",
        isSetupCard && "ring-1 ring-amber-300/40 dark:ring-amber-300/20"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {item.alias || item.description || "Untitled"}
          </h3>
        </div>
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/50">
        {previewCode ? (
             <ComponentRenderer code={previewCode} />
        ) : (
             <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                No code available
             </div>
        )}
      </div>

       <div className="flex min-h-[1.5rem] flex-wrap gap-2 text-xs text-zinc-500">
        {isSetupCard && extras?.length ? (
          <>
            {extras.slice(0, 3).map((pkg) => (
              <span
                key={pkg}
                className="rounded-full bg-amber-100 px-2.5 py-0.5 font-medium text-amber-700 dark:bg-amber-400/20 dark:text-amber-200"
              >
                {pkg}
              </span>
            ))}
             {extras.length > 3 && <span>+{extras.length - 3}</span>}
          </>
        ) : tags.length ? (
          <>
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-2.5 py-0.5 font-medium dark:bg-zinc-800/60"
              >
                {tag}
              </span>
            ))}
             {tags.length > 3 && <span>+{tags.length - 3}</span>}
          </>
        ) : (
            <span className="text-zinc-400 italic">No tags</span>
        )}
      </div>
    </article>
  );
}
