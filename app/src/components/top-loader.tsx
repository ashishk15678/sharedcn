"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * A slim, animated progress bar at the top of the viewport.
 * Triggers on Next.js route changes (detected via usePathname).
 */
export function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPathRef = useRef(pathname);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Detect route change start
  useEffect(() => {
    const fullPath = pathname + (searchParams?.toString() || "");
    const prevFull = prevPathRef.current;

    if (fullPath !== prevFull) {
      // Route changed — animate the bar
      setLoading(true);
      setVisible(true);
      setProgress(0);

      // Incrementally fill the bar
      let current = 0;
      intervalRef.current = setInterval(() => {
        current += Math.random() * 15 + 5;
        if (current > 90) current = 90;
        setProgress(current);
      }, 200);

      // Complete after a short delay (route is already loaded in Next.js App Router)
      timerRef.current = setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setProgress(100);
        setTimeout(() => {
          setLoading(false);
          setTimeout(() => {
            setVisible(false);
            setProgress(0);
          }, 300);
        }, 200);
      }, 500);

      prevPathRef.current = fullPath;
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none"
      style={{ height: "3px" }}
    >
      <div
        className="h-full bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 shadow-sm"
        style={{
          width: `${progress}%`,
          transition: loading
            ? "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            : "width 0.2s ease-out, opacity 0.3s ease-out",
          opacity: loading ? 1 : 0,
        }}
      />
      {/* Glow effect at the tip */}
      {loading && progress > 0 && (
        <div
          className="absolute top-0 h-full w-24 opacity-60"
          style={{
            right: `${100 - progress}%`,
            background:
              "linear-gradient(to right, transparent, rgba(139, 92, 246, 0.4))",
            filter: "blur(4px)",
          }}
        />
      )}
    </div>
  );
}
