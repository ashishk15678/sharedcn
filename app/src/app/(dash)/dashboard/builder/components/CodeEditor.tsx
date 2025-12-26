"use client";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

function inferLanguage(filename: string | undefined) {
  if (!filename) return "plaintext";
  if (filename.endsWith(".tsx")) return "typescript";
  if (filename.endsWith(".ts")) return "typescript";
  if (filename.endsWith(".jsx")) return "javascript";
  if (filename.endsWith(".js")) return "javascript";
  if (filename.endsWith(".css")) return "css";
  return "plaintext";
}

export function CodeEditor({
  filename,
  value,
  onChange,
}: {
  filename: string | undefined;
  value: string;
  onChange: (code: string) => void;
}) {
  const language = inferLanguage(filename);
  const { theme } = useTheme();
  return (
    <div className="border border-border  overflow-hidden w-full h-full">
      <MonacoEditor
        height="100%"
        language={language}
        theme={cn(theme == "light" ? "vs-light" : "vs-dark")}
        value={value}
        options={{
          fontSize: 14,
          minimap: { enabled: true },
          wordWrap: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          fontFamily:
            'Fira Mono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          smoothScrolling: true,
          cursorBlinking: "smooth",
          renderLineHighlight: "all",
          renderWhitespace: "all",
        }}
        onChange={(val) => onChange(val || "")}
      />
    </div>
  );
}
