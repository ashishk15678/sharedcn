"use client";
import {
  Check,
  FileBoxIcon,
  Loader2,
  XCircle,
  Sparkles,
  ThumbsUp,
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

export default function Page() {
  const [component, setComponent] = useState<ReactNode>();
  const [comp, setComp] = useState({
    name: "",
    description: "",
    dependent: "",
    code: "",
  });
  const [aliasAvailable, setAliasAvailable] = useState<null | boolean>(null);
  const [checkingAlias, setCheckingAlias] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const queryClient = useQueryClient();
  const debounceRef = useRef<any>(null);

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
      setComp({ name: "", description: "", dependent: "", code: "" });
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
    comp.code &&
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

  return (
    <>
      <div
        className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-black via-zinc-900 to-zinc-950 
      "
      >
        <div className="w-full absolute top-2 border-t-2 border-dashed border-zinc-900 bg-zinc-800 m-12" />

        <div className="h-full border-l-2 border-dashed border-zinc-900 bg-zinc-800 m-12" />

        <div className="p-2">
          <div
            className="p-3 border-4 border-zinc-800 rounded-2xl flex flex-row gap-2 bg-gradient-to-bl from-yellow-700/20 hover:from-yellow-700/40 via-zinc-950  to-yellow-500/30 hover:to-yellow-500/80 transition-colors
       text-zinc-100"
          >
            <div className="border border-zinc-800 p-2 rounded-xl bg-zinc-900">
              <input
                type="text"
                placeholder="Components"
                className="text-md  border border-zinc-800 rounded-lg p-1 px-4 bg-zinc-800/60  w-[180px] placeholder:text-zinc-200 text-zinc-200"
              />
              <ul className="mt-4 text-zinc-600 text-md w-full flex flex-col gap-y-1 p-2 ring ring-zinc-800 bg-zinc-800/40 rounded-xl h-[330px] overflow-auto">
                {isLoadingComponents ? (
                  [...Array(5)].map((_, i) => (
                    <li
                      key={i}
                      className="h-6 bg-zinc-800/60 rounded animate-pulse mb-2"
                    />
                  ))
                ) : userComponents && userComponents.length > 0 ? (
                  userComponents.map((component: any) => (
                    <li
                      key={component.id}
                      onClick={() => setComponent(component)}
                      className="hover:translate-x-2 transition-all hover:text-zinc-100 cursor-pointer"
                    >
                      {component.name || component.alias}
                    </li>
                  ))
                ) : (
                  <li className="text-zinc-500">No components yet.</li>
                )}
              </ul>
            </div>
            <div></div>
            <div className="w-[400px]  h-[400px] rounded-xl ring ring-zinc-800 bg-zinc-900 flex  flex-col px-4 py-2">
              {component &&
                typeof component === "object" &&
                "alias" in component && (
                  <div className="text-2xl text-white">
                    {(component as any).alias}
                  </div>
                )}
              {component &&
              typeof component === "object" &&
              "code" in component ? (
                <div className="flex flex-col gap-4 mt-4">
                  {Array.isArray((component as any).code) ? (
                    <>
                      <div className="flex flex-row gap-2 w-full mb-2">
                        {(component as any).code.map(
                          (file: any, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => setActiveFileIdx(idx)}
                              className={`px-3 py-1 rounded-t bg-zinc-800 border-b-2 ${
                                activeFileIdx === idx
                                  ? "border-yellow-400 text-yellow-300"
                                  : "border-transparent text-zinc-400"
                              } font-mono text-xs transition-all`}
                            >
                              {file.filename}
                            </button>
                          )
                        )}
                      </div>
                      <pre className="w-full max-h-64 overflow-auto bg-zinc-900 text-zinc-100 p-2 rounded-b-md whitespace-pre-wrap border border-zinc-800 shadow-md">
                        {(component as any).code[activeFileIdx]?.code}
                      </pre>
                    </>
                  ) : (
                    <pre className="mt-8 text-zinc-100 text-sm w-full h-full overflow-auto whitespace-pre-wrap bg-zinc-800 p-1 rounded-md">
                      {(component as any).code}
                    </pre>
                  )}
                </div>
              ) : (
                <div className="mt-8 text-xl text-zinc-600 mx-8">
                  Go ahead select a component , noone's watching
                </div>
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
              <SheetContent
                className="
            bg-gradient-to-b from-black to-zinc-800 text-white border-zinc-700 text-md"
              >
                <SheetHeader>
                  <SheetTitle className="text-white">
                    Create new component
                  </SheetTitle>
                  <SheetDescription>
                    Create new components from here or your cli.
                  </SheetDescription>
                </SheetHeader>
                <div className="mx-4 flex flex-col gap-6">
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
                    <p className="text-zinc-400">Code: *</p>
                    <textarea
                      onChange={(e) =>
                        setComp({ ...comp, code: e.target.value })
                      }
                      placeholder="Pretty printed code for my component"
                      className="
            w-full bg-zinc-800 rounded-md p-2 resize-none"
                      rows={15}
                    />
                  </div>
                </div>
                <SheetFooter>
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
                    className="w-48 placeholder:text-zinc-600 p-2 text-white outline-none bg-transparent"
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
        <div className="h-full border-l-2 border-dashed border-zinc-900 bg-zinc-800 m-12" />
      </div>
    </>
  );
}
