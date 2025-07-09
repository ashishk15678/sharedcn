"use client";
import {
  Check,
  FileBoxIcon,
  Loader2,
  XCircle,
  Sparkles,
  ThumbsUp,
  Menu,
  X,
} from "lucide-react";
import { components } from "@/components";
import { ReactNode, useState, useRef, useEffect, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { Monaco } from "@monaco-editor/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Dynamically import MonacoEditor for fast load
const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  { ssr: false }
);

export default function Page() {
  const [selectedComponent, setSelectedComponent] = useState<any | null>(null);
  const [comp, setComp] = useState({
    name: "",
    description: "",
    dependent: "",
    code: [{ filename: "Component.tsx", code: "" }],
  });
  const [aliasAvailable, setAliasAvailable] = useState<null | boolean>(null);
  const [checkingAlias, setCheckingAlias] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const queryClient = useQueryClient();
  const debounceRef = useRef<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { mutate: usernameMutation } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/username", {
        method: "POST",
        body: JSON.stringify({ username: username }),
      });
      return await res.json();
    },
  });

  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "loading" | "available" | "taken" | "error" | "success"
  >("idle");
  const [usernameMsg, setUsernameMsg] = useState<string>("");

  // check username in db
  const { data: usernameData, isLoading: isLoadingUsername } = useQuery({
    queryKey: ["username"],
    queryFn: async () => {
      const res = await fetch("/api/username");
      const data = await res.json();
      return data;
    },
  });

  useEffect(() => {
    const t = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["username"] });
    }, 1000);
    // return clearTimeout(t);
  }, [username]);

  const router = useRouter();

  // fetch user token
  const { data: UserToken } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/token", { method: "POST" });
      if (!res.ok) router.push("/sign-in");
      return res.json();
    },
  });

  // Fetch user's components
  const { data: userComponents, isLoading: isLoadingComponents } = useQuery({
    queryKey: ["components"],
    queryFn: async () => {
      const res = await fetch("/api/components");
      if (!res.ok) router.push("/sign-in");
      return res.json();
    },
  });

  // Debounced alias check
  const checkAlias = debounce(async (name: string) => {
    setCheckingAlias(true);
    setAliasAvailable(null);
    if (!name) {
      setCheckingAlias(false);
      setAliasAvailable(null);
      return;
    }
    const alias = name.trim().toLowerCase().replace(/\s+/g, "-");
    const res = await fetch(
      `/api/components/check-alias?alias=${encodeURIComponent(alias)}`
    );
    const data = await res.json();
    setAliasAvailable(data.available);
    setCheckingAlias(false);
  }, 500);

  // Watch name input for alias check
  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setComp((c) => ({ ...c, name: value }));
    setAliasAvailable(null);
    setCheckingAlias(false);
    if (debounceRef.current) debounceRef.current.cancel();
    debounceRef.current = checkAlias;
    checkAlias(value);
  }

  // TanStack mutation for create
  const createMutation = useMutation({
    mutationFn: async (data: typeof comp) => {
      const res = await fetch("/api/components", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create component");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Component created!");
      setSheetOpen(false);
      setComp({
        name: "",
        description: "",
        dependent: "",
        code: [...comp.code, { filename: "Component.tsx", code: "" }],
      });
      setAliasAvailable(null);
      queryClient.invalidateQueries({ queryKey: ["components"] });
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  const canSubmit =
    comp.name &&
    comp.description &&
    Array.isArray(comp.code) &&
    comp.code.length > 0 &&
    comp.code.every((f) => f.filename && f.code) &&
    aliasAvailable === true &&
    !createMutation.isPending;

  // Debounced username check
  const checkUsernameAvailability = useCallback(
    debounce(async (username: string) => {
      if (!username || username.length < 3) {
        setUsernameStatus("idle");
        setUsernameMsg("");
        return;
      }
      setUsernameStatus("loading");
      setUsernameMsg("");
      const res = await fetch(
        `/api/username/check?username=${encodeURIComponent(username)}`
      );
      if (!res.ok) {
        setUsernameStatus("error");
        setUsernameMsg("Error checking username");
        return;
      }
      const data = await res.json();
      if (data.available) {
        setUsernameStatus("available");
        setUsernameMsg("available!");
      } else {
        setUsernameStatus("taken");
        setUsernameMsg("taken");
      }
    }, 500),
    []
  );

  // On input change, debounce check
  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setUsername(value);
    setUsernameStatus("idle");
    setUsernameMsg("");
    checkUsernameAvailability(value);
  }

  // On Enter, if available, set username
  function handleUsernameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (
      e.key === "Enter" &&
      usernameStatus === "available" &&
      username.length >= 3
    ) {
      usernameSetMutation.mutate(username);
    }
  }

  // TanStack Mutation for setting username
  const usernameSetMutation = useMutation({
    mutationFn: async (username: string) => {
      setUsernameStatus("loading");
      setUsernameMsg("");
      const res = await fetch("/api/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      if (!res.ok) {
        setUsernameStatus("error");
        setUsernameMsg("Failed to set username");
        return { success: false };
      }
      setUsernameStatus("success");
      setUsernameMsg("Username set successfully!");
      return await res.json();
    },
  });

  const [activeFileIdx, setActiveFileIdx] = useState(0);

  // Add state for renaming dialog
  const [renameDialog, setRenameDialog] = useState<{
    open: boolean;
    idx: number | null;
  }>({ open: false, idx: null });
  const [renameValue, setRenameValue] = useState("");

  // Add state for file editing dialog
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    idx: number | null;
  }>({ open: false, idx: null });
  const [editFile, setEditFile] = useState<{ filename: string; code: string }>({
    filename: "",
    code: "",
  });

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur border-b border-zinc-200 flex items-center justify-between px-4 md:px-8 h-14">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">S</span>
          </div>
          <span className="text-xl font-bold text-black">SharedCN</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-gray-600 hover:text-black transition-colors"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-black transition-colors"
          >
            Dashboard
          </Link>
          <Button
            onClick={() => (window.location.href = "/login")}
            variant="ghost"
            className="text-gray-600 hover:text-black"
          >
            Login
          </Button>
          <Button
            onClick={() => (window.location.href = "/docs")}
            className="bg-black text-white hover:bg-gray-800"
          >
            Documentation
          </Button>
        </div>
        <button
          className="md:hidden p-2 rounded-lg hover:bg-zinc-100 transition"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-zinc-700" />
        </button>
      </nav>
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex flex-col">
          <div className="bg-white w-5/6 max-w-xs h-full shadow-2xl p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-bold text-black">SharedCN</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-zinc-700" />
              </button>
            </div>
            <Link
              href="/"
              className="text-zinc-700 text-lg py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-zinc-700 text-lg py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                window.location.href = "/login";
              }}
              variant="ghost"
              className="text-zinc-700 text-lg py-2"
            >
              Login
            </Button>
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                window.location.href = "/docs";
              }}
              className="bg-black text-white text-lg py-2"
            >
              Documentation
            </Button>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
      {/* Main dashboard content, responsive */}
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white pt-14">
        <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-6 mb-12 md:h-96">
            {/* Left: List of components */}
            <div className="border border-zinc-200 rounded-xl bg-white w-64 p-4 flex flex-col h-full overflow-y-auto">
              <input
                type="text"
                placeholder="Search components..."
                className="mb-4 px-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-sm"
                disabled
              />
              <ul className="flex-1 overflow-y-auto space-y-1">
                {isLoadingComponents ? (
                  [...Array(5)].map((_, i) => (
                    <li
                      key={i}
                      className="h-6 bg-zinc-100/60 rounded animate-pulse mb-2"
                    />
                  ))
                ) : userComponents && userComponents.length > 0 ? (
                  userComponents.map((component: any, idx: number) => (
                    <li
                      key={component.id}
                      onClick={() => {
                        setSelectedComponent(component);
                        setActiveFileIdx(0);
                      }}
                      className={`cursor-pointer px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedComponent &&
                        selectedComponent.id === component.id
                          ? "bg-yellow-100 text-yellow-800 font-semibold"
                          : "hover:bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {component.name || component.alias}
                    </li>
                  ))
                ) : (
                  <li className="text-zinc-400 text-sm">No components yet.</li>
                )}
              </ul>
            </div>
            {/* Right: Preview box */}
            <div className="flex-1 min-w-0 border border-zinc-200 rounded-xl bg-white p-6 flex flex-col h-full overflow-y-auto">
              {!selectedComponent ? (
                <div className="text-zinc-400 text-center my-16">
                  No component selected.
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xl font-bold text-zinc-900">
                      {selectedComponent.name || selectedComponent.alias}
                    </div>
                    <span className="font-mono text-xs text-zinc-400">
                      ID: {selectedComponent.id}
                    </span>
                  </div>
                  <div className="text-zinc-500 text-sm mb-2">
                    {selectedComponent.description}
                  </div>
                  {/* Install command */}
                  <div className="mb-4 flex items-center gap-2">
                    <span className="bg-zinc-100 text-yellow-800 px-3 py-1 rounded font-mono text-xs select-all">
                      npx sharedcn add{" "}
                      {selectedComponent.name
                        ?.replace(/\s+/g, "-")
                        .toLowerCase() || selectedComponent.alias}
                    </span>
                    <button
                      className="ml-2 px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `npx sharedcn add ${
                            selectedComponent.name
                              ?.replace(/\s+/g, "-")
                              .toLowerCase() || selectedComponent.alias
                          }`
                        )
                      }
                    >
                      Copy
                    </button>
                  </div>
                  {/* Code preview */}
                  <div className="bg-zinc-100 text-zinc-700 rounded-lg p-4 overflow-auto text-xs h-full whitespace-pre-wrap border border-zinc-100 shadow-inner">
                    {Array.isArray(selectedComponent.code) ? (
                      <pre>
                        {selectedComponent.code
                          .map((f: any) => `// ${f.filename}\n${f.code}`)
                          .join("\n\n")}
                      </pre>
                    ) : (
                      <pre>{selectedComponent.code}</pre>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-row w-full items-center space-x-4">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button
                  className={[
                    "flex flex-row rounded-3xl ring ring-zinc-500 gap-2 items-center justify-center relative mt-12",
                    //   "absolute bottom-80 right-80",
                    "bg-zinc-900",
                    "text-zinc-300",
                    "font-bold",
                    "py-2 px-4",
                    "transition-all",
                    "duration-300",
                    "shadow-lg",
                    "hover:shadow-zinc-600/80",
                    "before:content-['']",
                    "before:absolute",
                    "before:inset-0",
                    "before:rounded",
                    "before:blur-md",
                    "before:opacity-70",
                    "before:transition-all",
                    "before:duration-500",
                    "before:z-[-1]",
                    "before:bg-zinc-800",
                    "hover:before:opacity-100",
                    "animate-pulse",
                  ].join(" ")}
                  onClick={() => setSheetOpen(true)}
                >
                  Create new component
                  <FileBoxIcon size={18} />
                </button>
              </SheetTrigger>
              <SheetContent className="flex flex-col bg-gradient-to-b from-black to-zinc-800 text-white border-zinc-700 text-md max-h-none md:max-h-[90vh]">
                <SheetHeader>
                  <SheetTitle className="text-white">
                    Create new component
                  </SheetTitle>
                  <SheetDescription>
                    Create new components from here or your cli.
                  </SheetDescription>
                </SheetHeader>
                <div
                  className="mx-4 flex-1 flex flex-col gap-6 min-h-0"
                  style={{
                    overflowY: "auto",
                    maxHeight: "none",
                    ...(typeof window !== "undefined" && window.innerWidth < 900
                      ? { maxHeight: "100vh", overflowY: "auto" }
                      : {}),
                  }}
                >
                  <div className="flex flex-col  justify-center gap-2">
                    <p className="text-zinc-400">Component name: *</p>
                    <input
                      onChange={handleNameChange}
                      value={comp.name}
                      placeholder="My random component"
                      type="text"
                      className="w-full bg-zinc-800 rounded-md p-2"
                    />
                    {checkingAlias && (
                      <span className="text-xs text-yellow-400 mt-1">
                        Checking availability...
                      </span>
                    )}
                    {aliasAvailable === false && !checkingAlias && (
                      <span className="text-xs text-red-400 mt-1">
                        Alias is already taken.
                      </span>
                    )}
                    {aliasAvailable === true && !checkingAlias && (
                      <span className="text-xs text-green-400 mt-1">
                        Alias is available!
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col  justify-center gap-2">
                    <p className="text-zinc-400">Component description : *</p>
                    <input
                      onChange={(e) =>
                        setComp({ ...comp, description: e.target.value })
                      }
                      placeholder="It just works , that is it."
                      type="text"
                      className="
            w-full bg-zinc-800 rounded-md p-2 text-md"
                    />
                  </div>
                  <div className="flex flex-col  justify-center gap-2">
                    <p className="text-zinc-400">Dependent libraries:</p>
                    <input
                      onChange={(e) =>
                        setComp({ ...comp, dependent: e.target.value })
                      }
                      placeholder="Space seperated library names , eg : node tailwindcss"
                      type="text"
                      className="
            w-full bg-zinc-800 rounded-md p-2"
                    />
                  </div>
                  <div className="flex flex-col  justify-center gap-2">
                    <p className="text-zinc-400">Files: *</p>
                    {/* Tabs row */}
                    <div className="flex flex-row items-center gap-1 mb-2 border-b border-zinc-700 overflow-x-auto">
                      {comp.code.map((file, idx) => (
                        <div
                          key={idx}
                          className={`relative flex items-center px-4 py-1 mr-1 rounded-t-md cursor-pointer select-none transition-all text-sm font-mono
                            ${
                              activeFileIdx === idx
                                ? "bg-zinc-900 border-t-2 border-x border-zinc-700 border-b-0 text-yellow-300 font-bold"
                                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                            }
                          `}
                          onClick={() => setActiveFileIdx(idx)}
                          onDoubleClick={() => {
                            setRenameDialog({ open: true, idx });
                            setRenameValue(file.filename);
                          }}
                        >
                          <span className="truncate max-w-[120px]">
                            {file.filename}
                          </span>
                          {comp.code.length > 1 && (
                            <button
                              className="ml-2 text-zinc-500 hover:text-red-400 focus:outline-none"
                              onClick={(e) => {
                                e.stopPropagation();
                                const newFiles = comp.code.filter(
                                  (_, i) => i !== idx
                                );
                                setComp({ ...comp, code: newFiles });
                                if (activeFileIdx === idx)
                                  setActiveFileIdx(Math.max(0, idx - 1));
                              }}
                              title="Remove file"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      {/* Add file tab */}
                      <button
                        className="ml-2 px-2 py-1 rounded-t-md bg-zinc-800 text-zinc-400 hover:bg-zinc-700 font-bold text-lg flex items-center"
                        onClick={() => {
                          const newFile = {
                            filename: `File${comp.code.length + 1}.ts`,
                            code: "",
                          };
                          setComp({ ...comp, code: [...comp.code, newFile] });
                          setActiveFileIdx(comp.code.length);
                        }}
                        title="Add file"
                      >
                        +
                      </button>
                    </div>
                    {/* Rename dialog */}
                    {renameDialog.open && renameDialog.idx !== null && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl flex flex-col gap-4 min-w-[350px] max-w-[95vw]">
                          <h3 className="text-xl font-bold text-white mb-2">
                            Rename File
                          </h3>
                          <input
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            className="w-full bg-zinc-800 rounded-md p-2 text-sm font-mono"
                            placeholder="Filename"
                          />
                          <div className="flex flex-row gap-2 justify-end mt-2">
                            <button
                              className="px-4 py-2 rounded bg-zinc-700 text-white text-sm"
                              onClick={() =>
                                setRenameDialog({ open: false, idx: null })
                              }
                            >
                              Cancel
                            </button>
                            <button
                              className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
                              onClick={() => {
                                if (
                                  renameDialog.idx !== null &&
                                  renameValue.trim()
                                ) {
                                  const newFiles = [...comp.code];
                                  newFiles[renameDialog.idx] = {
                                    ...newFiles[renameDialog.idx],
                                    filename: renameValue.trim(),
                                  };
                                  setComp({ ...comp, code: newFiles });
                                }
                                setRenameDialog({ open: false, idx: null });
                              }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Code editor for active file */}
                    <div className="flex-1 min-h-[350px] max-h-[60vh]">
                      <MonacoEditor
                        height="350px"
                        defaultLanguage={
                          comp.code[activeFileIdx]?.filename.endsWith(".tsx")
                            ? "typescript"
                            : "javascript"
                        }
                        language={
                          comp.code[activeFileIdx]?.filename.endsWith(".tsx")
                            ? "typescript"
                            : "javascript"
                        }
                        value={comp.code[activeFileIdx]?.code}
                        theme="vs-dark"
                        options={{
                          fontSize: 14,
                          minimap: { enabled: false },
                          wordWrap: "on",
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                        }}
                        onChange={(val: string | undefined) => {
                          const newFiles = [...comp.code];
                          newFiles[activeFileIdx] = {
                            ...newFiles[activeFileIdx],
                            code: val ?? "",
                          };
                          setComp({ ...comp, code: newFiles });
                        }}
                      />
                    </div>
                  </div>
                </div>
                <SheetFooter className="shrink-0 bg-gradient-to-t from-black/80 to-transparent pt-4">
                  <button
                    onClick={() => createMutation.mutate(comp)}
                    className="w-full bg-zinc-500 text-white font-bold py-2 rounded-xl shadow-xl hover:shadow-none transition-all shadow-zinc-600"
                    disabled={!canSubmit}
                  >
                    {createMutation.isPending ? "Submitting..." : "Submit"}
                  </button>
                </SheetFooter>
              </SheetContent>
            </Sheet>{" "}
            <button
              onClick={() => {
                window.navigator.clipboard.writeText(UserToken.token);
                toast.success("Auth Token copied to clipboard");
              }}
              className="bg-zinc-800 px-4 py-2 text-white rounded-2xl ring ring-zinc-700 mt-12"
            >
              Copy Auth token
            </button>
            <div className="px-2 mt-12 flex flex-row items-center gap-2 rounded-xl ring ring-zinc-200">
              {isLoadingUsername ? (
                <Loader2 className="animate-spin text-yellow-400 w-5 h-5" />
              ) : usernameData && usernameData.username ? (
                <>
                  <input
                    type="text"
                    className="w-48 placeholder:text-zinc-600 p-2 text-black outline-none bg-transparent"
                    value={usernameData.username}
                    disabled
                  />
                  <svg
                    className="w-6 h-6 text-green-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path className="tick-animate" d="M5 13l4 4L19 7" />
                  </svg>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    className="w-48 placeholder:text-zinc-600 p-2 text-white outline-none bg-transparent"
                    placeholder="Choose username"
                    value={username}
                    onChange={handleUsernameChange}
                    onKeyDown={handleUsernameKeyDown}
                    minLength={3}
                  />
                  {usernameStatus === "loading" && (
                    <Loader2 className="animate-spin text-yellow-400 w-5 h-5" />
                  )}
                  {usernameStatus === "available" && (
                    <svg
                      className="w-6 h-6 text-green-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path className="tick-animate" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {usernameStatus === "success" && (
                    <svg
                      className="w-6 h-6 text-blue-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path className="tick-animate" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {usernameStatus === "taken" && (
                    <XCircle className="text-red-400 w-5 h-5 x-shake" />
                  )}
                  {usernameStatus === "error" && (
                    <XCircle className="text-red-500 w-5 h-5 x-shake" />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
