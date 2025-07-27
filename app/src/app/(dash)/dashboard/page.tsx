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
import { unstable_ViewTransition as ViewTransition } from "react";
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
    mainFile: "Component.tsx",
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
      if (!res.ok) router.push("/login");
      return res.json();
    },
  });

  // Fetch user's components
  const { data: userComponents, isLoading: isLoadingComponents } = useQuery({
    queryKey: ["components"],
    queryFn: async () => {
      const res = await fetch("/api/components");
      if (!res.ok) router.push("/login");
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
      // Prepare files and mainFile for API
      const files = data.code.map((f) => ({
        filename: f.filename,
        code: f.code,
      }));
      const mainFile = data.mainFile;
      const res = await fetch("/api/components", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          dependent: data.dependent,
          files,
          mainFile,
        }),
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
        mainFile: "Component.tsx",
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

  // Add state for selected file in the preview
  const [activeFile, setActiveFile] = useState<string | null>(null);

  return (
    <>
      <div></div>
    </>
  );
}
