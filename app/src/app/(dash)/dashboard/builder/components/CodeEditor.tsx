"use client";
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
  return (
    <div className="border border-zinc-200 rounded-xl overflow-hidden">
      <MonacoEditor
        height="360px"
        language={language}
        theme="vs-dark"
        value={value}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
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
