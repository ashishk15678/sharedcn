"use client";
import { trpc } from "@/trpc/client";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { ComponentRenderer } from "@/components/component-renderer";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  PackageIcon, 
  ChevronRight,
  PlusIcon, 
  ExternalLink,
  Code2,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ComponentsPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = 
    trpc.components.listPublic.useInfiniteQuery(
      { limit: 12, tag: activeTag || undefined },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        staleTime: 1000 * 60 * 5,
      }
    );

  const allComponents = data?.pages.flatMap((page) => page.items) ?? [];
  const allTags = data?.pages[0]?.tags ?? [];

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Components</h1>
            <p className="text-muted-foreground mt-2">
              Browse community components and add them to your project.
            </p>
          </div>
          <Link href="/component/new">
            <Button className="gap-2">
              <PlusIcon className="w-4 h-4" />
              Create Component
            </Button>
          </Link>
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveTag(null)}
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                !activeTag
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              )}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                  activeTag === tag
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && allComponents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <PackageIcon className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No components found</h2>
            <p className="text-muted-foreground mb-6">
              {activeTag 
                ? `No components with tag "${activeTag}" yet.` 
                : "Be the first to create a public component!"}
            </p>
            <Link href="/component/new">
              <Button>
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Component
              </Button>
            </Link>
          </div>
        )}

        {/* Components Grid */}
        {allComponents.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allComponents.map((component) => (
              <ComponentCard key={component.id} component={component} />
            ))}
          </div>
        )}

        {/* Load More */}
        {hasNextPage && (
          <div className="flex justify-center mt-10">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="gap-2"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Load More
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ComponentCard({ component }: { component: any }) {
  const mainFile = component.files?.find(
    (f: any) => f.filename === component.mainFile
  );
  const previewCode = mainFile?.code || "";
  const [showCode, setShowCode] = useState(false);

  return (
    <article className="group relative flex flex-col rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* Preview */}
      <div className="relative h-48 bg-muted/30 overflow-hidden">
        {previewCode && !showCode ? (
          <div className="w-full h-full flex items-center justify-center p-4 scale-75">
            <ComponentRenderer code={previewCode} />
          </div>
        ) : (
          <pre className="text-xs p-4 overflow-auto h-full bg-zinc-900 text-zinc-300">
            <code>{previewCode.slice(0, 500)}{previewCode.length > 500 ? "..." : ""}</code>
          </pre>
        )}
        
        {/* Toggle button */}
        <button
          onClick={() => setShowCode(!showCode)}
          className="absolute top-2 right-2 p-1.5 rounded-md bg-background/80 backdrop-blur-sm border opacity-0 group-hover:opacity-100 transition-opacity"
          title={showCode ? "Show preview" : "Show code"}
        >
          {showCode ? <Eye className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Info */}
      <div className="flex-1 p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base line-clamp-1">
            {component.alias || "Untitled"}
          </h3>
          {component.type === "setup" && (
            <Badge variant="outline" className="shrink-0 text-xs">Setup</Badge>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
          {component.description || "No description"}
        </p>

        {/* Tags */}
        {component.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {component.tags.slice(0, 3).map((tag: string) => (
              <span 
                key={tag} 
                className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {component.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{component.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t">
          <Link href={`/c/${component.alias?.replace("@", "")}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-1">
              View
              <ExternalLink className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
