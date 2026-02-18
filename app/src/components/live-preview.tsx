"use client";

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import * as Babel from "@babel/standalone";
import * as LucideReact from "lucide-react";
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

// Map of available imports for the preview
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

// List of supported modules for error messages
const SUPPORTED_MODULES = Object.keys(AVAILABLE_IMPORTS);

export function LivePreview({ code }: { code: string }) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<"transpile" | "runtime" | "import" | null>(null);

  useEffect(() => {
    if (!code || !code.trim()) {
      setComponent(null);
      setError(null);
      setErrorType(null);
      return;
    }

    try {
      // 1. Transform JSX/TSX to JS with CommonJS modules
      const transformed = Babel.transform(code, {
        presets: ["react", "typescript"],
        plugins: ["transform-modules-commonjs"],
        sourceType: "module",
        filename: "index.tsx",
      }).code;

      if (!transformed) {
        setError("Failed to transform code");
        setErrorType("transpile");
        return;
      }

      // Track missing imports for better error messages
      const missingImports: string[] = [];

      // 2. Create a mock require function
      const mockRequire = (moduleName: string) => {
        if (AVAILABLE_IMPORTS[moduleName]) {
          return AVAILABLE_IMPORTS[moduleName];
        }
        
        // Track missing modules but don't crash
        if (!missingImports.includes(moduleName)) {
          missingImports.push(moduleName);
        }
        
        // Return a proxy that gracefully handles missing exports
        return new Proxy({}, {
          get(target, prop) {
            if (prop === "__esModule") return true;
            if (prop === "default") return () => null;
            // Return a dummy component for any property access
            return function DummyComponent(props: any) {
              return React.createElement("div", {
                style: { 
                  padding: "8px", 
                  border: "1px dashed #f59e0b", 
                  borderRadius: "4px",
                  fontSize: "12px",
                  color: "#f59e0b",
                  background: "#fef3c7"
                }
              }, `[${moduleName}/${String(prop)}]`);
            };
          }
        });
      };

      // 3. Create a mock exports object
      const exports: { default?: React.ComponentType } = {};
      const module = { exports };

      // 4. Evaluate the code
      const func = new Function(
        "React",
        "require",
        "module",
        "exports",
        transformed,
      );

      func(React, mockRequire, module, exports);

      // 5. Get the default export
      const DefaultComponent = module.exports.default || exports.default;

      if (DefaultComponent) {
        // Wrap component to catch and show missing imports warning
        if (missingImports.length > 0) {
          const WrappedComponent = () => {
            return React.createElement(
              React.Fragment,
              null,
              React.createElement(
                "div",
                { 
                  style: { 
                    fontSize: "11px", 
                    color: "#f59e0b", 
                    background: "#fef3c7", 
                    padding: "8px 12px", 
                    borderRadius: "6px",
                    marginBottom: "12px",
                    border: "1px solid #fcd34d"
                  } 
                },
                `⚠️ Missing imports: ${missingImports.join(", ")}`
              ),
              React.createElement(DefaultComponent)
            );
          };
          setComponent(() => WrappedComponent);
        } else {
          setComponent(() => DefaultComponent);
        }
        setError(null);
        setErrorType(null);
      } else {
        setError("No default export found. Please export your component as default.");
        setErrorType("runtime");
      }
    } catch (err: any) {
      console.error("Preview render error:", err);
      
      // Determine error type for better messaging
      const message = err.message || "Unknown error";
      if (message.includes("Unexpected token") || message.includes("SyntaxError")) {
        setErrorType("transpile");
        setError(`Syntax Error: ${message}`);
      } else {
        setErrorType("runtime");
        setError(message);
      }
    }
  }, [code]);

  if (error) {
    return (
      <div className="p-4 text-sm font-mono overflow-auto h-full border bg-red-50 dark:bg-red-900/20">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold mb-2">
          <LucideReact.AlertCircle className="w-4 h-4" />
          {errorType === "transpile" ? "Syntax Error" : errorType === "import" ? "Import Error" : "Render Error"}
        </div>
        <pre className="text-red-500 dark:text-red-300 whitespace-pre-wrap text-xs">{error}</pre>
        
        {errorType === "transpile" && (
          <div className="mt-4 text-xs text-muted-foreground">
            <strong>Tip:</strong> Check for missing brackets, quotes, or invalid JSX syntax.
          </div>
        )}
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
        <LucideReact.Code2 className="w-8 h-8 opacity-50" />
        <span>Start typing to see preview...</span>
        <div className="text-xs text-muted-foreground/60 mt-2">
          Supported: {SUPPORTED_MODULES.slice(0, 5).join(", ")}...
        </div>
      </div>
    );
  }

  // Generate key from code to force ErrorBoundary remount on code changes
  const boundaryKey = code ? code.length + '-' + code.charCodeAt(0) : 'empty';

  return (
    <div className="w-full h-full overflow-auto p-8 flex items-center justify-center bg-white dark:bg-zinc-950/50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#333_1px,transparent_1px)]">
      <div className="bg-background border rounded-lg shadow-sm p-6 min-w-[300px] max-w-full">
        <ErrorBoundary key={boundaryKey}>
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

  componentDidUpdate(prevProps: { children: React.ReactNode }) {
    // Reset error when children change (new code)
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 text-sm p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="font-bold flex items-center gap-2 mb-2">
            <LucideReact.AlertTriangle className="w-4 h-4" />
            Runtime Error
          </div>
          <pre className="text-xs whitespace-pre-wrap">{this.state.error?.message}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}
