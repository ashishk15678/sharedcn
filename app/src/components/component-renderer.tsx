"use client";

import React, { useMemo, useState, useEffect } from "react";
import * as Babel from "@babel/standalone";
import { AlertCircle, Loader2 } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

interface ComponentRendererProps {
  code: string;
}

function transpileCode(code: string) {
  try {
    const transformed = Babel.transform(code, {
      presets: ["react"],
      filename: "component.tsx",
    }).code;
    return transformed;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

function ErrorFallback({ error, resetErrorBoundary }: any) {
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

      // 2. Wrap in a way that we can extract the component
      let safeCode = transpiled;
      
      // Very basic module system mock
      const exports: { default?: any } = {};
      const module = { exports };
      const require = (name: string) => {
         if(name === 'react') return React;
         // Add more mocks if needed
         return null;
      }

      // We wrap the code in a function to execute it
      const runner = new Function("React", "exports", "module", "require", safeCode);
      
      runner(React, exports, module, require);
      
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

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="relative h-full w-full overflow-hidden flex items-center justify-center bg-white dark:bg-zinc-950 isolate">
          <Component />
      </div>
    </ErrorBoundary>
  );
}
