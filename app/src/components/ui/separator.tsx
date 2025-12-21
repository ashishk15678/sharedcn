"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  text,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root> & { text?: string }) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-secondary/30 shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px ",
        className,
        "text-center relative w-full",
      )}
      {...props}
    >
      {text && (
        <div className="w-full text-center absolute z-1 -top-2 text-black/50 text-sm ">
          <p className="block px-2 bg-transparent">{" " + text + " "}</p>
        </div>
      )}
    </SeparatorPrimitive.Root>
  );
}

export { Separator };
