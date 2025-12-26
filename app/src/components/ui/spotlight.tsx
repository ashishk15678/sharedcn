import { cn } from "@/lib/utils";

export function Spotlight({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute -inset-px z-0 opacity-0 transition duration-300 group-hover:opacity-100",
        className,
      )}
      style={{
        background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.15), transparent 80%)`,
      }}
    />
  );
}
