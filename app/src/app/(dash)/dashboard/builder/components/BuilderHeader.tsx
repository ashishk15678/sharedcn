"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export function BuilderHeader({
  onRun,
  onSave,
  aiMode,
  setAiMode,
}: {
  onRun: () => void;
  onSave: () => void;
  aiMode: boolean;
  setAiMode: (v: boolean) => void;
}) {
  useEffect(() => {
    document.body.style.background = "linear-gradient(180deg, #fafafa, #fff)";
  }, []);

  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-zinc-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600" />
        <div className="font-extrabold text-lg">SharedCN Builder</div>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-zinc-600 mr-2">AI Mode</label>
        <input
          type="checkbox"
          checked={aiMode}
          onChange={(e) => setAiMode(e.target.checked)}
          className="accent-yellow-500"
        />
        <Button
          onClick={onRun}
          className="bg-black text-white hover:bg-zinc-800"
        >
          Run
        </Button>
        <Button onClick={onSave} variant="outline" className="border-zinc-300">
          Save
        </Button>
      </div>
    </div>
  );
}
