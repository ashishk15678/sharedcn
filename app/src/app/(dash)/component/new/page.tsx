"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { CodeEditor } from "../../dashboard/builder/components/CodeEditor";
import { useEffect, useReducer, useState, useMemo } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  FileIcon,
  FilesIcon,
  FoldersIcon,
  TrashIcon,
  Settings2Icon,
  ComponentIcon,
  AlertTriangleIcon,
  CheckIcon,
  PlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import * as Babel from "@babel/standalone";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  componentName: z.string().min(1, "Component name is required."),
  description: z.string().min(1, "Description is required."),
  isPublic: z.boolean(),
  type: z.enum(["component", "setup"]),
  tags: z.string().optional(),
  dependencies: z.string().optional(),
  registryDependencies: z.string().optional(),
  installCommand: z.string().optional(),
});

type File = {
  fileName: string;
  content?: string;
};

type Action =
  | { type: "add-file"; name: string }
  | { type: "update-content"; name: string; data: string }
  | { type: "delete-file"; name: string }
  | { type: "set-main-file"; name: string };

const fileReducer = (prevState: File[], action: Action): File[] => {
  switch (action.type) {
    case "add-file": {
      const exists = prevState.find((f) => f.fileName === action.name);
      if (exists) return prevState;

      return [
        ...prevState,
        {
          fileName: action.name,
          content: "",
        },
      ];
    }

    case "update-content": {
      return prevState.map((file) =>
        file.fileName === action.name
          ? { ...file, content: action.data }
          : file,
      );
    }

    case "delete-file": {
      return prevState.filter((file) => file.fileName != action.name);
    }
    default:
      return prevState;
  }
};

export default function Page() {
  const router = useRouter();
  const { data: usernameData, isLoading: usernameLoading } =
    trpc.username.get.useQuery();
  const createComponentMutation = trpc.components.create.useMutation({
    onSuccess: (data) => {
      toast.success("Created successfully!");
      router.push(`/dashboard`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create");
    },
  });

  const form = useForm<z.Infer<typeof formSchema>>({
    defaultValues: {
      componentName: "",
      description: "",
      isPublic: true,
      type: "component",
      tags: "",
      dependencies: "",
      registryDependencies: "",
      installCommand: "",
    },
    resolver: zodResolver(formSchema),
  });

  const creationType = form.watch("type");

  const [files, changeFiles] = useReducer(fileReducer, [
    {
      fileName: "index.tsx",
      content:
        "export default function Component() {\n  return <div>Hello World</div>;\n}",
    },
  ]);
  const [selectedFile, setSelectedFile] = useState<File>(files[0]);
  const [mainFile, setMainFile] = useState<string>(files[0]?.fileName || "");
  const [creatingNewFile, setCreatingNewFile] = useState(false);

  useEffect(() => {
    if (creationType === "component" && files.length === 0) {
      changeFiles({
        type: "add-file",
        name: "index.tsx",
      });
    } else if (creationType === "setup" && files.length === 0) {
      // Maybe add a default util or config file for setup?
      // For now keeping it empty or user decides.
      // Actually let's prompt a relevant file.
      changeFiles({
        type: "add-file",
        name: "src/utils/setup.ts",
      });
    }
  }, [creationType]);

  useEffect(() => {
    if (files.length > 0 && !files.find((f) => f.fileName === mainFile)) {
      setMainFile(files[0].fileName);
      setSelectedFile(files[0]);
    }
  }, [files, mainFile]);

  const componentName = form.watch("componentName");
  const username = usernameData?.username || "user";
  const normalizedName = componentName
    ? componentName.trim().toLowerCase().replace(/\s+/g, "-")
    : "";
  const finalAlias = username
    ? `@${username}/${normalizedName}`
    : normalizedName;

  async function onSubmit(values: z.Infer<typeof formSchema>) {
    if (!usernameData?.username) {
      toast.error("Please set your username first in settings");
      router.push("/settings");
      return;
    }

    if (files.length === 0) {
      toast.error("Please add at least one file");
      return;
    }

    if (!mainFile || !files.find((f) => f.fileName === mainFile)) {
      toast.error("Please select a main file");
      return;
    }

    // Validate all files have content
    const emptyFiles = files.filter(
      (f) => !f.content || f.content.trim() === "",
    );
    if (emptyFiles.length > 0) {
      toast.error(
        `Please add content to: ${emptyFiles.map((f) => f.fileName).join(", ")}`,
      );
      return;
    }

    // Type-specific Validation
    if (values.type === "component") {
      // 1. Extension validation
      const allowed = [".js", ".ts", ".jsx", ".tsx", ".css", ".html"];
      const invalidFiles = files.filter(
        (f) => !allowed.some((ext) => f.fileName.endsWith(ext)),
      );
      if (invalidFiles.length > 0) {
        toast.error(
          `Invalid file types for component. Only ${allowed.join(", ")} are allowed.`,
        );
        return;
      }

      // 2. Babel Validation
      try {
        files.forEach((file) => {
          if (
            file.fileName.endsWith(".tsx") ||
            file.fileName.endsWith(".jsx")
          ) {
            Babel.transform(file.content || "", {
              presets: ["react"],
              filename: file.fileName,
            });
          }
        });
      } catch (err: any) {
        console.error("Babel validation error:", err);
        toast.error(`Syntax error in component: ${err.message}`);
        return;
      }

      const mainFileContent =
        files.find((f) => f.fileName === mainFile)?.content || "";
      if (!mainFileContent.includes("export default")) {
        toast.warning("Main file should usually have a default export.");
      }
    }

    try {
      const tagsList = values.tags
        ? values.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      const dependenciesList = values.dependencies
        ? values.dependencies
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      const registryList = values.registryDependencies
        ? values.registryDependencies
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      await createComponentMutation.mutateAsync({
        name: values.componentName,
        description: values.description,
        dependent: {
          type: values.type,
          tags: tagsList,
          dependencies: dependenciesList,
          registryDependencies: registryList,
          installCommand: values.installCommand,
        },
        files: files.map((f) => ({
          filename: f.fileName,
          code: f.content || "",
        })),
        mainFile: mainFile,
      });
    } catch (error) {
      // Error handled by onError
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && creatingNewFile) {
        setCreatingNewFile(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [creatingNewFile]);

  return (
    <div className="w-full h-full">
      <div className="container max-h-screen py-10 pl-6 max-w-7xl ml-auto ">
        <div className="mb-10">
          <p className="text-2xl font-extrabold tracking-tight mb-2 bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Create New {creationType === "setup" ? "Setup" : "Component"}
          </p>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Build and share your UI components or configuration setups with the
            world. Start by choosing a type below.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            {/* Left Column: Meta Info */}
            <div className="lg:col-span-4 space-y-8">
              {/* Type Selection Cards */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-base font-semibold">
                      What are you building?
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-row gap-2">
                        <div
                          className={cn(
                            "cursor-pointer rounded-2xl border-2 px-4 py-2 transition-all hover:border-border/50 hover:bg-muted/50 ",
                            field.value === "setup"
                              ? "border-border shadow-inner "
                              : "border-muted",
                          )}
                          onClick={() => field.onChange("setup")}
                        >
                          <div className="flex items-center gap-x-2">
                            <div
                              className={cn(
                                "p-1 rounded-lg flex items-center ",
                                field.value === "setup"
                                  ? " text-primary-foreground"
                                  : "text-muted-foreground",
                              )}
                            >
                              <ComponentIcon
                                size={18}
                                className={`${field.value === "setup" ? "text-green-500" : "text-muted-foreground"}`}
                              />
                            </div>
                            <span
                              className={`${field.value === "setup" ? "text-green-500" : "text-muted-foreground"} + "font-semibold text-lg"`}
                            >
                              Setups
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Configuration files or boiler plate code.
                          </p>
                        </div>

                        <div className="flex flex-row ">
                          <div
                            className={cn(
                              "cursor-pointer rounded-3xl border-2 py-2 px-4 transition-all hover:border-border/50 hover:bg-muted/50 ",
                              field.value === "component"
                                ? "border-border  shadow-inner"
                                : "border-muted",
                            )}
                            onClick={() => field.onChange("component")}
                          >
                            <div className="flex items-center gap-x-2">
                              <div
                                className={cn(
                                  "p-1 rounded-lg flex items-center ",
                                  field.value === "component"
                                    ? " text-primary-foreground"
                                    : "text-muted-foreground",
                                )}
                              >
                                <ComponentIcon
                                  size={18}
                                  className={`${field.value === "component" ? "text-green-500" : "text-muted-foreground"}`}
                                />
                              </div>
                              <span
                                className={`${field.value === "component" ? "text-green-500" : "text-muted-foreground"} + "font-semibold text-lg"`}
                              >
                                Component
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Reusable UI elements like Buttons, Cards.
                            </p>
                          </div>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="space-y-6 bg-card/50 border rounded-xl p-6 shadow-sm">
                <FormField
                  name="componentName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Name</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground text-sm font-mono border-r pr-2 my-2 bg-muted/50 rounded-l-md">
                            {usernameData?.username
                              ? `@${usernameData.username}/`
                              : "user/"}
                          </div>
                          <Input
                            placeholder={
                              creationType === "setup"
                                ? "trpc-setup"
                                : "my-component"
                            }
                            className="pl-[calc(var(--prefix-width,80px))] font-mono transition-all focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary"
                            style={
                              {
                                "--prefix-width": `${
                                  (usernameData?.username?.length || 4) * 9 + 40
                                }px`,
                              } as React.CSSProperties
                            }
                            disabled={
                              !usernameData?.username && !usernameLoading
                            }
                            {...field}
                          />
                        </div>
                      </FormControl>
                      {!usernameData?.username && !usernameLoading && (
                        <FormDescription className="text-destructive text-xs">
                          Set username in settings first.
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What does this component do?"
                          className="min-h-[120px] resize-none focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="tags"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Tags</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="react, ui, button (comma separated)"
                          className="focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Keywords to help others find your component.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {creationType === "setup" && (
                  <>
                    <FormField
                      name="dependencies"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            NPM Dependencies
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="zod, react-hook-form (comma separated)"
                              className="font-mono text-xs focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Packages to be installed.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="registryDependencies"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Registry Dependencies
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="utils, button (comma separated)"
                              className="font-mono text-xs focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Expected local components.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="installCommand"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Install Command
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="npm install my-package"
                              className="font-mono text-xs focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Custom command to run after installation.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormField
                  name="isPublic"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/20">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-medium">
                          Public Visibility
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Anyone can view and use this component.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col justify-start pt-4 gap-y-4">
                <Button
                  variant="secondary"
                  className="w-full text-muted-foreground mr-2 hover:border hover:border-border"
                  onClick={() => router.back()}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  type="submit"
                  className="w-full font-bold shadow-lg shadow-primary/20 transition-all "
                  disabled={createComponentMutation.isPending}
                >
                  {createComponentMutation.isPending
                    ? "Creating..."
                    : `Create ${creationType === "setup" ? "Setup" : "Component"}`}
                </Button>
              </div>
            </div>

            {/* Right Column: Editor */}
            <div className="lg:col-span-8 flex flex-col h-[calc(100vh-12rem)] min-h-[800px] border rounded-xl overflow-hidden shadow-md bg-zinc-100 dark:bg-[#1e1e1e]">
              {/* Toolbar */}
              <div className="h-12 border-b border-zinc-100  dark:border-[#333] bg-zinc-100 dark:bg-[#252526] flex items-center justify-between px-4 select-none">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#888] uppercase tracking-wider">
                    File Explorer
                  </span>
                  <div className="h-4 w-[1px] bg-[#333] mx-2" />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs text-[#888] hover:text-white hover:bg-[#333] gap-1"
                    onClick={() => setCreatingNewFile(true)}
                  >
                    <PlusIcon size={12} /> New File
                  </Button>
                </div>

                <div className="text-xs text-[#666] font-mono">
                  {files.length} file{files.length !== 1 ? "s" : ""}
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {/* File List Sidebar */}
                <div className="w-64 bg-zinc-100 dark:bg-[#252526] border-r border-[#333] flex flex-col">
                  <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                    <FileTree
                      files={files}
                      selectedFile={selectedFile}
                      mainFile={mainFile}
                      onSelect={setSelectedFile}
                      onSetMain={(name) => {
                        setMainFile(name);
                        toast.success(`Set ${name} as main`);
                      }}
                      onDelete={(name) => {
                        if (files.length > 1) {
                          changeFiles({ type: "delete-file", name });
                          if (selectedFile.fileName === name) {
                            const remaining = files.filter(
                              (f) => f.fileName !== name,
                            );
                            setSelectedFile(remaining[0] || files[0]);
                          }
                          if (mainFile === name) {
                            const remaining = files.filter(
                              (f) => f.fileName !== name,
                            );
                            setMainFile(remaining[0]?.fileName || "");
                          }
                        }
                      }}
                    />

                    {creatingNewFile && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="px-1 pt-2"
                      >
                        <input
                          type="text"
                          autoFocus
                          placeholder={
                            creationType === "setup"
                              ? "src/lib/utils.ts"
                              : "Button.tsx"
                          }
                          className="w-full bg-zinc-100 dark:bg-[#1e1e1e] text-zinc-900 dark:text-white border border-blue-500 rounded px-2 py-1 text-sm font-mono focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              let val = e.currentTarget.value.trim();
                              // Basic sanitization
                              val = val.replace(/^\/+/, ""); // remove leading slash

                              if (val.includes("..")) {
                                toast.error("Invalid path");
                                return;
                              }

                              if (val) {
                                // Check if exists
                                if (files.find((f) => f.fileName === val)) {
                                  toast.error("File already exists");
                                  return;
                                }
                                changeFiles({ type: "add-file", name: val });
                                setSelectedFile({ fileName: val, content: "" });
                                setCreatingNewFile(false);
                              }
                            } else if (e.key === "Escape") {
                              setCreatingNewFile(false);
                            }
                          }}
                          onBlur={() => setCreatingNewFile(false)}
                        />
                        <p className="text-[10px] text-zinc-500 mt-1 px-1">
                          Enter full path (e.g. lib/utils.ts)
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 flex flex-col bg-zinc-100 dark:bg-[#1e1e1e]">
                  {selectedFile && (
                    <>
                      <div className="h-9 border-b border-zinc-400 dark:border-[#333] flex items-center px-4 justify-between bg-zinc-200 dark:bg-[#1e1e1e]">
                        <span className="text-sm text-primary font-mono flex items-center gap-2">
                          {selectedFile.fileName}
                          {mainFile === selectedFile.fileName && (
                            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full font-sans font-bold">
                              MAIN
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex-1 relative">
                        <CodeEditor
                          filename={selectedFile.fileName}
                          value={selectedFile.content || ""}
                          onChange={(data) => {
                            changeFiles({
                              type: "update-content",
                              name: selectedFile.fileName,
                              data,
                            });
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

type TreeNode = {
  name: string;
  fullPath: string;
  type: "file" | "folder";
  children: Record<string, TreeNode>;
  file?: File;
};

function buildFileTree(files: File[]) {
  const root: Record<string, TreeNode> = {};

  files.forEach((file) => {
    const parts = file.fileName.split("/");
    let current = root;

    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = {
          name: part,
          fullPath: parts.slice(0, index + 1).join("/"),
          type: index === parts.length - 1 ? "file" : "folder",
          children: {},
          file: index === parts.length - 1 ? file : undefined,
        };
      }
      current = current[part].children;
    });
  });

  return root;
}

function FileTree({
  files,
  selectedFile,
  mainFile,
  onSelect,
  onSetMain,
  onDelete,
}: {
  files: File[];
  selectedFile: File;
  mainFile: string;
  onSelect: (file: File) => void;
  onSetMain: (name: string) => void;
  onDelete: (name: string) => void;
}) {
  const tree = useMemo(() => buildFileTree(files), [files]);

  return (
    <div className="flex flex-col gap-0.5">
      <RecursiveTree
        nodes={tree}
        depth={0}
        selectedFile={selectedFile}
        mainFile={mainFile}
        onSelect={onSelect}
        onSetMain={onSetMain}
        onDelete={onDelete}
      />
    </div>
  );
}

function RecursiveTree({
  nodes,
  depth,
  selectedFile,
  mainFile,
  onSelect,
  onSetMain,
  onDelete,
}: {
  nodes: Record<string, TreeNode>;
  depth: number;
  selectedFile: File;
  mainFile: string;
  onSelect: (file: File) => void;
  onSetMain: (name: string) => void;
  onDelete: (name: string) => void;
}) {
  // Sort folders first, then files
  const sortedKeys = Object.keys(nodes).sort((a, b) => {
    const nodeA = nodes[a];
    const nodeB = nodes[b];
    if (nodeA.type === nodeB.type) return a.localeCompare(b);
    return nodeA.type === "folder" ? -1 : 1;
  });

  return (
    <>
      {sortedKeys.map((key) => {
        const node = nodes[key];
        return (
          <FileTreeNode
            key={node.fullPath}
            node={node}
            depth={depth}
            selectedFile={selectedFile}
            mainFile={mainFile}
            onSelect={onSelect}
            onSetMain={onSetMain}
            onDelete={onDelete}
          />
        );
      })}
    </>
  );
}

function FileTreeNode({
  node,
  depth,
  selectedFile,
  mainFile,
  onSelect,
  onSetMain,
  onDelete,
}: {
  node: TreeNode;
  depth: number;
  selectedFile: File;
  mainFile: string;
  onSelect: (file: File) => void;
  onSetMain: (name: string) => void;
  onDelete: (name: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const isSelected =
    node.type === "file" && selectedFile.fileName === node.fullPath;
  const isMain = node.type === "file" && mainFile === node.fullPath;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1.5 py-1 px-2 rounded-md cursor-pointer text-sm select-none transition-colors border border-transparent",
          isSelected
            ? "bg-zinc-200 dark:bg-[#37373d] text-zinc-900 dark:text-white"
            : "text-zinc-500 dark:text-[#ccc] hover:bg-zinc-100 dark:hover:bg-[#2a2d2e] hover:text-zinc-900 dark:hover:text-white",
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => {
          if (node.type === "folder") {
            setIsOpen(!isOpen);
          } else if (node.file) {
            onSelect(node.file);
          }
        }}
      >
        {node.type === "folder" ? (
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-zinc-400">
              {isOpen ? (
                <FoldersIcon size={14} className="text-yellow-500/80" />
              ) : (
                <FoldersIcon size={14} className="text-yellow-500" />
              )}
            </span>
            <span className="truncate font-medium">{node.name}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between flex-1 min-w-0 group">
            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
              {node.name.endsWith("tsx") || node.name.endsWith("jsx") ? (
                <ComponentIcon size={14} className="text-blue-400 shrink-0" />
              ) : (
                <FileIcon size={14} className="text-zinc-500 shrink-0" />
              )}
              <span
                className={cn(
                  "truncate",
                  isMain && "font-bold text-blue-500 dark:text-blue-400",
                )}
              >
                {node.name}
              </span>
            </div>

            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              {!isMain && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetMain(node.fullPath);
                  }}
                  className="p-1 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded text-zinc-400 hover:text-blue-500"
                  title="Set as Main"
                >
                  ★
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(node.fullPath);
                }}
                className="p-1 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded text-zinc-400 hover:text-red-500"
              >
                <TrashIcon size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

      {node.type === "folder" && isOpen && (
        <RecursiveTree
          nodes={node.children}
          depth={depth + 1}
          selectedFile={selectedFile}
          mainFile={mainFile}
          onSelect={onSelect}
          onSetMain={onSetMain}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
