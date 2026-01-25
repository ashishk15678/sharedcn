"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { BsBoxSeam } from "react-icons/bs";
import { ExternalLink, PlusIcon, PlusSquareIcon } from "lucide-react";
import type { inferRouterOutputs } from "@trpc/server";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";

type ComponentEntity =
  inferRouterOutputs<AppRouter>["components"]["list"][number];

export default function EntityPage({
  title,
  description,
  type,
}: {
  title: string;
  description?: string;
  type: "components" | "setups";
}) {
  const utils = trpc.useContext();
  useEffect(() => {
    utils.components.list.prefetch();
  }, [utils]);

  const { data, isLoading } = trpc.components.list.useQuery(undefined, {
    staleTime: 1000 * 60,
  });

  const items = useMemo(() => {
    const list = data ?? [];
    return list.filter((item) =>
      type === "setups" ? isSetup(item) : !isSetup(item),
    );
  }, [data, type]);

  const renderCard = (item: ComponentEntity) => {
    const preview = buildPreview(item);
    // Use new schema fields directly instead of parsing deprecated dependent
    const tags = item.tags || [];
    const extras = item.dependencies || [];
    const isSetupCard = isSetup(item);

    return (
      <article
        key={item.id}
        className={cn(
          "flex h-full w-full flex-col gap-4 rounded-xl border border-zinc-200/70  backdrop-blur-lg px-3 py-2 transition hover:border-zinc-300 dark:border-zinc-800 ",
          isSetupCard && "ring-1 ring-amber-300/40 dark:ring-amber-300/20",
        )}
        style={{ aspectRatio: items.length > 3 ? "3 / 1" : undefined }}
      >
        <div className="flex  items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {item.alias || item.description || "Untitled"}
            </h3>

            <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
              {item.description || "No description provided."}
            </p>
          </div>
        </div>

        {preview.markup ? (
          <div className="rounded-2xl border border-zinc-100 bg-white/90 p-4 text-sm text-zinc-800 shadow-inner dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100">
            <div dangerouslySetInnerHTML={{ __html: preview.markup }} />
          </div>
        ) : (
          <CodeBlock code={preview.code} />
        )}

        {isSetupCard && extras?.length ? (
          <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
            {extras.map((pkg) => (
              <span
                key={pkg}
                className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-700 dark:bg-amber-400/20 dark:text-amber-200"
              >
                {pkg}
              </span>
            ))}
          </div>
        ) : tags.length ? (
          <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-3 py-1 font-medium dark:bg-zinc-800/60"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </article>
    );
  };

  const content = (() => {
    if (isLoading) return <ShowcaseSkeleton />;
    if (!items.length) {
      return (
        <EntityEmpty
          title={`No ${type} yet`}
          description={
            type === "setups"
              ? "Bundle scripts, packages, and files into one-click automation."
              : "Build sharable UI blocks without leaving the browser."
          }
          newLink={
            type === "setups" ? "/component/new?mode=setup" : "/component/new"
          }
        />
      );
    }
    if (items.length > 3) {
      return <MarqueeRow items={items}>{renderCard}</MarqueeRow>;
    }
    return (
      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map(renderCard)}
      </div>
    );
  })();

  return (
    <section className="p-6 md:p-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>
      {content}
    </section>
  );
}

export function EntityComponent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function EntityEmpty({
  title,
  description,
  newLink,
}: {
  title: string;
  description?: string;
  newLink?: string;
}) {
  return (
    <div className="mt-6 flex w-full items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 p-10 text-center dark:border-zinc-800 backdrop-blur-2xl bg-card/30 ">
      <div className="flex flex-col items-center gap-4">
        <BsBoxSeam size={38} className="text-zinc-400" />
        <div>
          <p className=" text-lg font-semibold text-zinc-800 dark:text-zinc-100">
            {title}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        </div>
        {newLink && (
          <Link href={newLink}>
            <Button
              variant="outline"
              className="gap-2 w-full min-w-sm hover:shadow-md ease-in text-sm font-semibold "
            >
              Create
              <PlusIcon className="size-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

function ShowcaseSkeleton() {
  return (
    <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={idx}
          className="h-64 rounded-3xl border border-zinc-200/70 bg-white/80 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50"
        >
          <div className="h-full w-full animate-pulse rounded-3xl bg-zinc-100 dark:bg-zinc-800/50" />
        </div>
      ))}
    </div>
  );
}

function MarqueeRow({
  items,
  children,
}: {
  items: ComponentEntity[];
  children: (item: ComponentEntity) => React.ReactNode;
}) {
  const loop = [...items, ...items];

  return (
    <div className="mt-6 overflow-hidden">
      <div className="marquee-track">
        {loop.map((item, idx) => (
          <div className="marquee-card" key={`${item.id}-${idx}`}>
            {children(item)}
          </div>
        ))}
      </div>
      <style jsx>{`
        .marquee-track {
          display: flex;
          gap: 1.5rem;
          width: max-content;
          animation: marquee 28s linear infinite;
        }
        .marquee-card {
          flex: 0 0 340px;
          max-width: 380px;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="max-h-44 overflow-auto rounded-2xl bg-secondary p-4 text-xs text-primary shadow-inner dark:bg-zinc-900">
      <code>{code.trim() || "/* No code available */"}</code>
    </pre>
  );
}

function buildPreview(component: ComponentEntity) {
  const files = component.files ?? [];
  const main =
    files.find((f) => f.filename === component.mainFile) ?? files[0] ?? null;
  if (!main) return { code: "", markup: "" };
  const snippet = main.code ?? "";
  const markup = extractMarkup(snippet);
  return { code: snippet.slice(0, 600), markup };
}

function extractMarkup(code: string) {
  const match = code.match(/return\s*\(([\s\S]*?)[)]\s*;?/);
  if (!match) return "";
  let html = match[1]
    .replace(/<>/g, "")
    .replace(/<\/>/g, "")
    .replace(/className=/g, "class=")
    .replace(/<script/gi, "&lt;script");
  return html.trim();
}

type DependentMeta = {
  type?: "component" | "setup";
  tags?: string[];
  packages?: string[];
  commands?: string[];
};

function parseDependentMeta(value: any): DependentMeta {
  if (!value) return {};
  if (Array.isArray(value)) return { tags: value };
  if (typeof value === "object") return value as DependentMeta;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return {};
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      trimmed.startsWith("[")
    ) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return { tags: parsed };
        return parsed as DependentMeta;
      } catch {
        // ignore
      }
    }
    return {
      tags: trimmed
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };
  }
  return {};
}

function isSetup(component: ComponentEntity) {
  // Use the new type field directly
  if (component.type === "setup") return true;
  // Fallback for legacy data: check tags
  if (
    component.tags?.some((tag: string) => tag.toLowerCase().includes("setup"))
  ) {
    return true;
  }
  return component.alias?.toLowerCase().includes("setup") ?? false;
}
