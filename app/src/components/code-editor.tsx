"use client";
import { useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, indentOnInput, foldGutter, foldKeymap } from "@codemirror/language";
import { oneDark } from "@codemirror/theme-one-dark";

function inferLanguage(filename: string | undefined) {
  if (!filename) return null;
  if (filename.endsWith(".tsx") || filename.endsWith(".ts")) return javascript({ jsx: true, typescript: true });
  if (filename.endsWith(".jsx") || filename.endsWith(".js")) return javascript({ jsx: true });
  if (filename.endsWith(".css")) return css();
  return null;
}

// Custom autocomplete for common React/TS patterns
const reactCompletions = [
  { label: "import", type: "keyword", info: "Import statement" },
  { label: "export", type: "keyword", info: "Export statement" },
  { label: "export default", type: "keyword", info: "Default export" },
  { label: "function", type: "keyword", info: "Function declaration" },
  { label: "const", type: "keyword", info: "Constant declaration" },
  { label: "let", type: "keyword", info: "Variable declaration" },
  { label: "useState", type: "function", info: "React useState hook" },
  { label: "useEffect", type: "function", info: "React useEffect hook" },
  { label: "useRef", type: "function", info: "React useRef hook" },
  { label: "useMemo", type: "function", info: "React useMemo hook" },
  { label: "useCallback", type: "function", info: "React useCallback hook" },
  { label: "useContext", type: "function", info: "React useContext hook" },
  { label: "React.FC", type: "type", info: "React Function Component type" },
  { label: "interface", type: "keyword", info: "TypeScript interface" },
  { label: "type", type: "keyword", info: "TypeScript type alias" },
  { label: "className", type: "property", info: "React className prop" },
  { label: "onClick", type: "property", info: "Click event handler" },
  { label: "onChange", type: "property", info: "Change event handler" },
  { label: "return", type: "keyword", info: "Return statement" },
  { label: "async", type: "keyword", info: "Async function" },
  { label: "await", type: "keyword", info: "Await expression" },
];

const cssCompletions = [
  { label: "display", type: "property" },
  { label: "flex", type: "keyword" },
  { label: "grid", type: "keyword" },
  { label: "flex-direction", type: "property" },
  { label: "justify-content", type: "property" },
  { label: "align-items", type: "property" },
  { label: "padding", type: "property" },
  { label: "margin", type: "property" },
  { label: "border", type: "property" },
  { label: "border-radius", type: "property" },
  { label: "background", type: "property" },
  { label: "color", type: "property" },
  { label: "font-size", type: "property" },
  { label: "font-weight", type: "property" },
  { label: "width", type: "property" },
  { label: "height", type: "property" },
  { label: "position", type: "property" },
  { label: "absolute", type: "keyword" },
  { label: "relative", type: "keyword" },
  { label: "transition", type: "property" },
  { label: "transform", type: "property" },
  { label: "animation", type: "property" },
];

function getCustomCompletions(filename: string | undefined) {
  if (!filename) return [];
  if (filename.endsWith(".css")) return cssCompletions;
  return reactCompletions;
}

const lightTheme = EditorView.theme({
  "&": {
    backgroundColor: "#fafafa",
    color: "#1f2937",
  },
  ".cm-content": {
    caretColor: "#3b82f6",
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "#3b82f6",
  },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
    backgroundColor: "#dbeafe",
  },
  ".cm-activeLine": {
    backgroundColor: "#f3f4f6",
  },
  ".cm-gutters": {
    backgroundColor: "#f9fafb",
    color: "#9ca3af",
    border: "none",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "#e5e7eb",
  },
}, { dark: false });

export function CodeEditor({
  filename,
  value,
  onChange,
}: {
  filename: string | undefined;
  value: string;
  onChange: (code: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { resolvedTheme } = useTheme();

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current) return;
    
    const langExtension = inferLanguage(filename);
    const customCompletions = getCustomCompletions(filename);
    
    const customCompletionSource = (context: any) => {
      const word = context.matchBefore(/\w*/);
      if (!word || (word.from === word.to && !context.explicit)) return null;
      return {
        from: word.from,
        options: customCompletions.filter(c => 
          c.label.toLowerCase().startsWith(word.text.toLowerCase())
        ),
      };
    };

    const extensions = [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      foldGutter(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      bracketMatching(),
      closeBrackets(),
      autocompletion({
        override: [customCompletionSource],
        activateOnTyping: true,
      }),
      rectangularSelection(),
      crosshairCursor(),
      highlightActiveLine(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        indentWithTab,
      ]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          onChange(update.state.doc.toString());
        }
      }),
      resolvedTheme === "dark" ? oneDark : lightTheme,
    ];

    if (langExtension) {
      extensions.push(langExtension);
    }

    const state = EditorState.create({
      doc: value,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [filename, resolvedTheme]); // Re-create on filename or theme change

  // Update content when value prop changes externally
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    
    const currentContent = view.state.doc.toString();
    if (currentContent !== value) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentContent.length,
          insert: value,
        },
      });
    }
  }, [value]);

  return (
    <div className="border border-border overflow-hidden w-full h-full">
      <div 
        ref={editorRef} 
        className="h-full w-full [&_.cm-editor]:h-full [&_.cm-editor]:outline-none [&_.cm-scroller]:overflow-auto [&_.cm-content]:font-mono [&_.cm-content]:text-sm"
      />
    </div>
  );
}
