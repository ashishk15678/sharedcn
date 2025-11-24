"use client";
import { useMemo } from "react";
import { useUrlState } from "../useUrlState";

export type BuilderFile = { path: string; code: string };

export function FileExplorer({
  files,
  mainFile,
  onSelect,
}: {
  files: BuilderFile[];
  mainFile: string;
  onSelect: (path: string) => void;
}) {
  const { get, set } = useUrlState();
  const active = get("file", mainFile) || mainFile;

  const tree = useMemo(() => {
    const root: any = {};
    for (const f of files) {
      const parts = f.path.split("/");
      let node = root;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!node[part])
          node[part] = i === parts.length - 1 ? { __file: true } : {};
        node = node[part];
      }
    }
    return root;
  }, [files]);

  function render(node: any, prefix: string[] = []) {
    return Object.keys(node).map((key) => {
      const value = node[key];
      const full = [...prefix, key].join("/");
      const isFile = value.__file;
      if (isFile) {
        const isActive = active === full;
        const isMain = mainFile === full;
        return (
          <button
            key={full}
            onClick={() => {
              set("file", full);
              onSelect(full);
            }}
            className={`w-full text-left px-3 py-1.5 rounded-md text-sm font-mono transition ${
              isActive
                ? "bg-yellow-100 text-yellow-900 border border-yellow-200"
                : "hover:bg-zinc-100 text-zinc-700"
            } ${isMain ? "ring-1 ring-yellow-400" : ""}`}
          >
            {key}
            {isMain && (
              <span className="ml-2 text-[10px] text-yellow-600 font-bold">
                (main)
              </span>
            )}
          </button>
        );
      }
      // folder
      return (
        <div key={full} className="pl-2">
          <div className="text-xs uppercase tracking-wider text-zinc-500 py-1">
            {key}
          </div>
          <div className="pl-2 flex flex-col gap-1">
            {render(value, [...prefix, key])}
          </div>
        </div>
      );
    });
  }

  return (
    <div
      className="w-full md:w-56 bg-white/60 border border-zinc-200 rounded-xl shadow-sm p-2 flex flex-col gap-1"
      style={{ backdropFilter: "blur(8px)" }}
    >
      <div className="font-semibold text-zinc-700 mb-2 text-xs uppercase tracking-wider">
        Files
      </div>
      {render(tree)}
    </div>
  );
}
