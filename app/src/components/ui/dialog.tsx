import * as React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";

export function Dialog({ open, onOpenChange, children }: any) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </RadixDialog.Root>
  );
}

export function DialogContent({ children, className = "" }: any) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 bg-black/30 z-50" />
      <RadixDialog.Content
        className={`fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl border border-zinc-200 focus:outline-none ${className}`}
      >
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

export function DialogHeader({ children }: any) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children, className = "" }: any) {
  return (
    <RadixDialog.Title className={`text-xl font-bold ${className}`}>
      {children}
    </RadixDialog.Title>
  );
}

export function DialogFooter({ children }: any) {
  return <div className="mt-6">{children}</div>;
}
