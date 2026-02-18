"use client";

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import * as Babel from "@babel/standalone";
import * as LucideReact from "lucide-react";
import { AlertCircle, Loader2 } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import { motion, AnimatePresence } from "framer-motion";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Map of available imports for the preview (shared with live-preview.tsx)
const AVAILABLE_IMPORTS: Record<string, any> = {
  // Core
  react: { ...React, default: React, useState, useEffect, useRef, useMemo, useCallback },
  "lucide-react": LucideReact,
  "framer-motion": { motion, AnimatePresence },
  
  // UI Components
  "@/components/ui/button": { Button },
  "@/components/ui/input": { Input },
  "@/components/ui/textarea": { Textarea },
  "@/components/ui/card": { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter },
  "@/components/ui/badge": { Badge },
  "@/components/ui/switch": { Switch },
  "@/components/ui/separator": { Separator },
  "@/components/ui/label": { Label },
  "@/components/ui/slider": { Slider },
  "@/components/ui/tabs": { Tabs, TabsList, TabsTrigger, TabsContent },
  "@/components/ui/dialog": { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter },
  "@/components/ui/tooltip": { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger },
  "@/components/ui/skeleton": { Skeleton },
  
  // Utilities
  "@/lib/utils": { cn },
  sonner: { toast },
};

interface ComponentRendererProps {
  code: string;
}

function transpileCode(code: string) {
  try {
    const transformed = Babel.transform(code, {
      presets: ["react", "typescript"],
      filename: "component.tsx",
    }).code;
    return transformed;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

function ErrorFallback({ error }: { error: Error; resetErrorBoundary?: () => void }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-sm text-red-500">
      <AlertCircle className="h-6 w-6" />
      <p className="font-medium">Failed to render</p>
      <p className="text-xs text-red-400/80">{error.message}</p>
    </div>
  );
}

export function ComponentRenderer({ code }: ComponentRendererProps) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    try {
      // 1. Transpile TSX/JSX to JS
      const transpiled = transpileCode(code);
      if (!transpiled) return;

      // 2. Create mock require that gracefully handles missing modules
      const mockRequire = (moduleName: string) => {
        if (AVAILABLE_IMPORTS[moduleName]) {
          return AVAILABLE_IMPORTS[moduleName];
        }
        
        // Return a proxy that gracefully handles missing exports
        return new Proxy({}, {
          get(target, prop) {
            if (prop === "__esModule") return true;
            if (prop === "default") return () => null;
            // Return a dummy component for any property access
            return function DummyComponent() {
              return React.createElement("span", {
                style: { 
                  padding: "2px 6px", 
                  border: "1px dashed #f59e0b", 
                  borderRadius: "4px",
                  fontSize: "11px",
                  color: "#f59e0b",
                  background: "#fef3c7"
                }
              }, `[${String(prop)}]`);
            };
          }
        });
      };

      // 3. Create mock exports
      const exports: { default?: any } = {};
      const module = { exports };

      // 4. Execute the code
      const runner = new Function("React", "exports", "module", "require", transpiled);
      runner(React, exports, module, mockRequire);
      
      const DefaultComponent = module.exports.default || exports.default;

      if (DefaultComponent) {
        setComponent(() => DefaultComponent);
        setError(null);
      } else {
        setError("No default export found. Please export a default component.");
      }

    } catch (err: any) {
      setError(err.message);
      setComponent(null);
    }
  }, [code]);

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-red-50/50 p-4 text-sm text-red-500 dark:bg-red-900/10">
        <AlertCircle className="h-4 w-4" />
        <span className="text-xs">{error}</span>
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="flex h-full w-full items-center justify-center text-zinc-400">
         <Loader2 className="animate-spin h-5 w-5" />
      </div>
    );
  }

  // Generate a simple key from code to force ErrorBoundary reset
  const errorBoundaryKey = code ? code.length + '-' + code.charCodeAt(0) : 'empty';

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} key={errorBoundaryKey}>
      <div className="relative h-full w-full overflow-hidden flex items-center justify-center bg-white dark:bg-zinc-950 isolate">
          <Component />
      </div>
    </ErrorBoundary>
  );
}
