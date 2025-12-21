"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BuilderHeader } from "./components/BuilderHeader";
import { FileExplorer, type BuilderFile } from "./components/FileExplorer";
import { CodeEditor } from "./components/CodeEditor";
import { PreviewPane } from "./components/PreviewPane";
import { buildBundle } from "./bundler";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";

export default function BuilderPage() {
  const params = useSearchParams();
  const router = useRouter();
  const componentId = params.get("componentId");
  const [aiMode, setAiMode] = useState(false);
  const [bundle, setBundle] = useState("");

  const { data: components } = trpc.components.list.useQuery();

  const current = useMemo(() => {
    if (!components || components.length === 0) return null;
    if (componentId)
      return components.find((c: any) => c.id === componentId) || components[0];
    return components[0];
  }, [components, componentId]);

  const [files, setFiles] = useState<BuilderFile[]>([]);

  useEffect(() => {
    if (!current) return;
    const mapped = (current.files || []).map((f: any) => ({
      path: f.filename,
      code: f.code,
    }));
    setFiles(mapped);
  }, [current?.id]);

  const activePath = params.get("file") || current?.mainFile;
  const activeFile = files.find((f) => f.path === activePath);

  function updateActive(code: string) {
    setFiles((prev) =>
      prev.map((f) => (f.path === activePath ? { ...f, code } : f))
    );
  }

  function onRun() {
    if (!current || !current.mainFile) return;
    const b = buildBundle(files, current.mainFile);
    setBundle(b);
  }

  const updateComponentMutation = trpc.components.update.useMutation();
  const generateAIMutation = trpc.ai.generate.useMutation();

  async function onSave() {
    if (!current) return;
    try {
      await updateComponentMutation.mutateAsync({
        id: current.id,
        files: files.map((f) => ({ filename: f.path, code: f.code })),
        mainFile: current.mainFile,
      });
    } catch (err) {
      console.error("save failed", err);
    }
  }

  async function onGenerate(prompt: string) {
    try {
      const data = await generateAIMutation.mutateAsync({ prompt, files });
      if (data?.files) {
        const merged = [...files];
        for (const nf of data.files) {
          const idx = merged.findIndex((f) => f.path === nf.filename);
          if (idx >= 0) merged[idx] = { path: nf.filename, code: nf.code };
          else merged.push({ path: nf.filename, code: nf.code });
        }
        setFiles(merged);
      }
    } catch (err) {
      console.error("generate failed", err);
    }
  }

  if (!current)
    return (
      <div className="p-8 text-zinc-500">
        No components found. Create one first.
      </div>
    );

  return (
    <div className="min-h-screen w-full flex flex-col">
      <BuilderHeader
        onRun={onRun}
        onSave={onSave}
        aiMode={aiMode}
        setAiMode={setAiMode}
      />
      <div className="w-full max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="bg-white/80 border border-zinc-200 rounded-xl p-3 shadow-sm">
            <div className="text-sm font-semibold text-zinc-700 mb-2">
              {current.name || current.alias}
            </div>
            <FileExplorer
              files={files}
              mainFile={current.mainFile}
              onSelect={() => {}}
            />
          </div>
          {aiMode && (
            // lazy import to avoid circular
            <div>
              {/* @ts-ignore */}
              {require("./components/AIPanel").AIPanel({ onGenerate })}
            </div>
          )}
        </div>
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="bg-white/70 border border-zinc-200 rounded-xl p-3 shadow-sm">
            <div className="text-xs text-zinc-500 mb-1 font-mono">
              {activePath}
            </div>
            <CodeEditor
              filename={activePath}
              value={activeFile?.code || ""}
              onChange={updateActive}
            />
          </div>
          <PreviewPane bundle={bundle} />
          <div className="flex items-center justify-end">
            <Button
              onClick={onRun}
              className="bg-black text-white hover:bg-zinc-800"
            >
              Run
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
