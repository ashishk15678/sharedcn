"use client";

import React, { useEffect, useState, useRef } from "react";
import * as Babel from "@babel/standalone";
import * as LucideReact from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Map of available imports for the preview
const AVAILABLE_IMPORTS: Record<string, any> = {
  react: React,
  "lucide-react": LucideReact,
  "@/components/ui/button": { Button },
  "@/components/ui/input": { Input },
  "@/components/ui/card": { Card, CardContent, CardHeader, CardTitle },
  "@/components/ui/badge": { Badge },
  "@/components/ui/switch": { Switch },
  "@/components/ui/separator": { Separator },
  "@/lib/utils": { cn },
  sonner: { toast },
};

export function LivePreview({ code }: { code: string }) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  // TODO: Replace Function constructor with iframe-based sandboxing for production
  // const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!code) {
      setComponent(null);
      setError(null);
      return;
    }

    try {
      // Security: Basic input validation
      if (code.length > 50000) {
        setError("Code too large. Please keep it under 50KB.");
        return;
      }

      // 1. Transform JSX/TSX to JS with CommonJS modules
      const transformed = Babel.transform(code, {
        presets: ["react", "typescript"],
        filename: "preview.tsx",
      }).code;

      if (!transformed) return;

      // 2. Create a mock require function with strict allowlist
      const require = (moduleName: string) => {
        // Security: Only allow specific, whitelisted imports
        if (AVAILABLE_IMPORTS[moduleName]) {
          return AVAILABLE_IMPORTS[moduleName];
        }
        // Log warning for debugging but don't expose in production
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Module not found in preview: ${moduleName}`);
        }
        return {};
      };

      // 3. Create a mock exports object
      const exports: { default?: React.ComponentType } = {};
      const module = { exports };

      // 4. Evaluate the code
      // SECURITY WARNING: This uses Function constructor which is risky
      // The variable shadowing below provides minimal protection and can be bypassed
      // TODO: CRITICAL - Replace with iframe-based sandboxing for production use
      // See SECURITY_REVIEW.md for detailed recommendations
      const func = new Function(
        "React",
        "require",
        "module",
        "exports",
        `
        "use strict";
        // Note: These shadowing attempts provide minimal security and can be bypassed
        // via globalThis, this, or other techniques. This is NOT a secure sandbox.
        const window = undefined;
        const document = undefined;
        const localStorage = undefined;
        const sessionStorage = undefined;
        const fetch = undefined;
        ${transformed}
        `,
      );

      func(React, require, module, exports);

      // 5. Get the default export
      const DefaultComponent = module.exports.default || exports.default;

      if (DefaultComponent) {
        setComponent(() => DefaultComponent);
        setError(null);
      } else {
        setError(
          "No default export found. Please export your component as default.",
        );
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Preview render error:", err);
      setError(errorMessage);
    }
  }, [code]);

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 dark:bg-red-900/20 text-sm font-mono overflow-auto h-full border">
        <div className="font-bold mb-2">Render Error:</div>
        {error}
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Start typing to see preview...
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto p-8 flex items-center justify-center bg-white dark:bg-zinc-950/50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#333_1px,transparent_1px)]">
      <div className="bg-background border  shadow-sm p-6 min-w-[300px] max-w-full">
        <ErrorBoundary>
          <Component />
        </ErrorBoundary>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 text-sm">
          <div className="font-bold">Runtime Error:</div>
          {this.state.error?.message}
        </div>
      );
    }

    return this.props.children;
  }
}
