import * as React from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`block w-full px-3 py-2 border border-zinc-200 rounded-lg bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition ${className}`}
    {...props}
  />
));
Input.displayName = "Input";
