import { cn } from "@/lib/utils";

interface GridPatternProps {
  className?: string;
  strokeDasharray?: string;
  animate?: boolean;
}

export function GridPattern({
  className,
  strokeDasharray = "0",
  animate = true,
}: GridPatternProps) {
  return (
    <svg
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full stroke-border/30",
        animate &&
          "[mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]",
        className,
      )}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="grid-pattern"
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
          x="50%"
          y="0"
        >
          <path
            d="M0 32V0h32"
            fill="none"
            strokeDasharray={strokeDasharray}
            className={
              animate ? "animate-[grid-fade_8s_ease-in-out_infinite]" : ""
            }
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
}
