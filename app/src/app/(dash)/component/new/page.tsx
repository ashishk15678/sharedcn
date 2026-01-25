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
import { CodeEditor } from "@/components/code-editor";
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
  ChevronRightIcon,
  ChevronLeftIcon,
  EyeIcon,
  Code2Icon,
  RocketIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import * as Babel from "@babel/standalone";
import { motion, AnimatePresence } from "framer-motion";
import { LivePreview } from "@/components/live-preview";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

const STEPS = [
  { id: 1, name: "Details", icon: Settings2Icon },
  { id: 2, name: "Code", icon: Code2Icon },
  { id: 3, name: "Review", icon: RocketIcon },
];

export default function Page() {
  const router = useRouter();
  const [step, setStep] = useState(1);
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
  const componentName = form.watch("componentName");

  const [files, changeFiles] = useReducer(fileReducer, [
    {
      fileName: "index.tsx",
      content:
        'import React from \'react\';\nimport { Button } from \'@/components/ui/button\';\n\nexport default function Component() {\n  return (\n    <div className="p-4 border rounded-lg shadow-sm">\n      <h2 className="text-lg font-bold mb-2">Hello World</h2>\n      <p className="text-gray-500 mb-4">This is a preview of your component.</p>\n      <Button>Click Me</Button>\n    </div>\n  );\n}',
    },
  ]);
  const [selectedFile, setSelectedFile] = useState<File>(files[0]);
  const [mainFile, setMainFile] = useState<string>(files[0]?.fileName || "");
  const [creatingNewFile, setCreatingNewFile] = useState(false);

  // Initialize main file when files change
  useEffect(() => {
    if (files.length > 0 && !files.find((f) => f.fileName === mainFile)) {
      setMainFile(files[0].fileName);
      setSelectedFile(files[0]);
    }
  }, [files, mainFile]);

  const handleNext = async () => {
    if (step === 1) {
      const valid = await form.trigger([
        "componentName",
        "description",
        "type",
      ]);
      if (valid) {
        setStep(2);
      }
    } else if (step === 2) {
      if (files.length === 0) {
        toast.error("Please add at least one file");
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const username = usernameData?.username || "user";

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
        type: values.type,
        tags: tagsList,
        dependencies: dependenciesList,
        registryDependencies: registryList,
        installCommand: values.installCommand || undefined,
        isPublic: values.isPublic,
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

  // Effect to add default files based on type
  useEffect(() => {
    if (files.length === 0) {
      if (creationType === "component") {
        // Logic handled by default useReducer
      } else if (creationType === "setup") {
        changeFiles({
          type: "add-file",
          name: "src/utils/setup.ts",
        });
        // Set main
        setTimeout(() => {
          setMainFile("src/utils/setup.ts");
        }, 0);
      }
    }
  }, [creationType, files.length]);

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
    <div className="w-full h-full  bg-background text-foreground flex flex-col">
      <div
        className={cn(
          `flex-1 container  mx-auto py-8 px-6 transition-all duration-300`,
          step == 1 && "max-w-xl",
          step == 2 && "max-w-7xl",
          step == 3 && "max-w-xl",
        )}
      >
        <div
          className="
          border border-border w-full  flex flex-col rounded-3xl flex-1  shadow-sm"
        >
          <div className="py-2 px-4 bg-secondary/50  overflow-hidden bg-clip-border">
            <h1 className="text-xl font-bold line-clamp-1">
              New {creationType === "setup" ? "Setup" : "Component"}
            </h1>

            <div className="flex items-center">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-full border-2 text-sm font-bold transition-colors",
                      step === s.id
                        ? "border-border bg-background shadow-xl text-muted-foreground"
                        : step > s.id
                          ? "border-primary bg-secondary text-muted-foreground"
                          : " text-muted-foreground",
                    )}
                  >
                    {step > s.id ? <CheckIcon className="w-4 h-4" /> : s.id}
                  </div>
                  <span
                    className={cn(
                      "ml-2 text-sm font-medium hidden sm:block",
                      step === s.id
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {s.name}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div className="w-8 h-[2px] mx-4 bg-muted hidden sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="w-full h-0.5 bg-border inline" />
          <div className="p-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="h-full flex flex-col w-full"
              >
                {/* STEP 1: Details */}
                {step === 1 && (
                  <div className="max-w-xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-6  w-full rounded-xl">
                      <div className="mb-6 ">
                        <h2 className="text-xl ">Component Details</h2>
                        <p className="text-muted-foreground">
                          Tell us about what you are building.
                        </p>
                      </div>

                      {/* Type Selection */}
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem className="space-y-4">
                            <FormLabel className="text-base font-semibold">
                              Type
                            </FormLabel>
                            <FormControl>
                              <div className="grid grid-cols-2 gap-4">
                                <div
                                  className={cn(
                                    "cursor-pointer rounded-xl border-2 px-4 py-1 transition-all  hover:bg-muted/50 flex flex-col gap-1 items-center text-center",
                                    field.value === "component"
                                      ? "border-border bg-secondary"
                                      : "border-muted",
                                  )}
                                  onClick={() => field.onChange("component")}
                                >
                                  <div className="flex flex-row gap-x-2 items-center justify-center">
                                    <ComponentIcon
                                      className={
                                        field.value === "component"
                                          ? "text-primary"
                                          : "text-muted-foreground"
                                      }
                                      size={18}
                                    />
                                    <span className="font-semibold">
                                      Component
                                    </span>
                                  </div>
                                </div>
                                <div
                                  className={cn(
                                    "cursor-pointer rounded-xl border-2 px-4 py-1 transition-all  hover:bg-muted/50 flex flex-col gap-1 items-center text-center",
                                    field.value === "setup"
                                      ? "border-border bg-secondary"
                                      : "border-muted",
                                  )}
                                  onClick={() => field.onChange("setup")}
                                >
                                  <div className="flex flex-row gap-x-2 items-center justify-center">
                                    <Settings2Icon
                                      className={
                                        field.value === "setup"
                                          ? "text-primary"
                                          : "text-muted-foreground"
                                      }
                                      size={18}
                                    />
                                    <span className="font-semibold">Setup</span>
                                  </div>
                                </div>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="componentName"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <div className="flex rounded-md shadow-sm ring-offset-background">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                                  {usernameData?.username
                                    ? `@${usernameData.username}/`
                                    : "user/"}
                                </span>
                                <Input
                                  placeholder="my-component"
                                  className="rounded-l-none"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            {!usernameData?.username && (
                              <FormDescription className="text-destructive">
                                Please set username in settings.
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
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your component..."
                                className="resize-none h-24"
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
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="react, ui, dark-mode"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Comma separated keywords.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-1">
                        <FormField
                          name="isPublic"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-xl border px-4 py-1">
                              <div className="">
                                <FormLabel className="text-base">
                                  Public
                                </FormLabel>
                                <FormDescription className="text-sm">
                                  Visible to everyone
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
                    </div>

                    <div className="flex pt-4 w-full">
                      <Button
                        type="button"
                        variant={"secondary"}
                        onClick={handleNext}
                        className="w-auto md:w-full gap-2"
                      >
                        Next Step <ChevronRightIcon size={16} />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Editor */}
                {step === 2 && (
                  <div className="h-[calc(100vh-14rem)] flex flex-col gap-4 animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl  flex items-center gap-2">
                        Code & Preview
                      </h2>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={handleBack}
                          className="rounded-2xl"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handleNext}
                          variant={"outline"}
                          className="rounded-2xl "
                        >
                          Next: Review
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-hidden">
                      {/* LEFT: Editor */}
                      <div className="flex flex-col border rounded-xl overflow-hidden bg-zinc-100 dark:bg-[#1e1e1e] shadow-md h-full">
                        {/* Toolbar */}
                        <div className="h-10 border-b border-zinc-200 dark:border-[#333] bg-zinc-100 dark:bg-[#252526] flex items-center justify-between px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-muted-foreground uppercase">
                              Explorer
                            </span>
                            <div className="h-4 w-[1px] bg-border mx-1" />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-xs gap-1"
                              onClick={() => setCreatingNewFile(true)}
                              type="button"
                            >
                              <PlusIcon size={12} /> New File
                            </Button>
                          </div>
                          <span className="text-xs text-muted-foreground mono">
                            {files.length} files
                          </span>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                          {/* File Tree */}
                          <div className="w-48 border-r border-zinc-200 dark:border-[#333] bg-zinc-50 dark:bg-[#252526] flex flex-col">
                            <div className="flex-1 overflow-y-auto p-2">
                              <FileTree
                                files={files}
                                selectedFile={selectedFile}
                                mainFile={mainFile}
                                onSelect={setSelectedFile}
                                onSetMain={setMainFile}
                                onDelete={(name) => {
                                  if (files.length > 1) {
                                    changeFiles({ type: "delete-file", name });
                                    // Adjust selection if needed
                                    if (selectedFile.fileName === name) {
                                      const remaining = files.filter(
                                        (f) => f.fileName !== name,
                                      );
                                      if (remaining.length > 0)
                                        setSelectedFile(remaining[0]);
                                    }
                                  }
                                }}
                              />
                              {creatingNewFile && (
                                <div className="mt-2 px-2">
                                  <input
                                    autoFocus
                                    type="text"
                                    className="w-full text-xs p-1 border rounded bg-background"
                                    placeholder="Name..."
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        const val =
                                          e.currentTarget.value.trim();
                                        if (
                                          val &&
                                          !files.find((f) => f.fileName === val)
                                        ) {
                                          changeFiles({
                                            type: "add-file",
                                            name: val,
                                          });
                                          setSelectedFile({
                                            fileName: val,
                                            content: "",
                                          });
                                          setCreatingNewFile(false);
                                        } else {
                                          toast.error(
                                            "Invalid or duplicate file name",
                                          );
                                        }
                                      } else if (e.key === "Escape")
                                        setCreatingNewFile(false);
                                    }}
                                    onBlur={() => setCreatingNewFile(false)}
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Monaco */}
                          <div className="flex-1 flex flex-col min-w-0">
                            <div className="h-8 border-b border-zinc-200 dark:border-[#333] flex items-center px-4 justify-between bg-zinc-100 dark:bg-[#1e1e1e]">
                              <span className="text-xs font-mono">
                                {selectedFile?.fileName}{" "}
                                {mainFile === selectedFile?.fileName && (
                                  <span className="ml-2 text-[10px] bg-blue-500/20 text-blue-500 px-1 rounded">
                                    Main
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className="flex-1 relative">
                              {selectedFile && (
                                <CodeEditor
                                  filename={selectedFile.fileName}
                                  value={selectedFile.content || ""}
                                  onChange={(data) =>
                                    changeFiles({
                                      type: "update-content",
                                      name: selectedFile.fileName,
                                      data,
                                    })
                                  }
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT: Preview */}
                      <div className="flex flex-col border rounded-xl overflow-hidden bg-background shadow-md h-full">
                        <div className="h-10 border-b flex items-center px-4 bg-muted/40">
                          <EyeIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span className="font-semibold text-sm">Preview</span>
                        </div>
                        <div className="flex-1 relative">
                          {/* Always preview the Main File */}
                          <LivePreview
                            code={
                              files.find((f) => f.fileName === mainFile)
                                ?.content || ""
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Review */}
                {step === 3 && (
                  <div className="max-w-3xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <div className="text-center mb-8">
                      <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <RocketIcon className="w-8 h-8 text-primary" />
                      </div>
                      <h2 className="text-3xl font-bold">Ready to Launch?</h2>
                      <p className="text-muted-foreground mt-2">
                        Review your component details before publishing.
                      </p>
                    </div>

                    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                      <div className="p-6 grid gap-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">
                              Name
                            </h3>
                            <p className="font-mono text-lg">{componentName}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">
                              Type
                            </h3>
                            <Badge variant="outline" className="capitalize">
                              {creationType}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Description
                          </h3>
                          <p className="text-sm">
                            {form.getValues("description")}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Files ({files.length})
                          </h3>
                          <div className="flex gap-2 flex-wrap">
                            {files.map((f) => (
                              <Badge
                                key={f.fileName}
                                variant="secondary"
                                className="font-mono"
                              >
                                {f.fileName}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 border-t flex justify-end gap-3">
                        <Button
                          variant="ghost"
                          onClick={handleBack}
                          type="button"
                        >
                          Back to Code
                        </Button>
                        <Button
                          type="submit"
                          className="px-8 font-bold"
                          disabled={createComponentMutation.isPending}
                        >
                          {createComponentMutation.isPending
                            ? "Publishing..."
                            : "Publish Component"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components

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
  return (
    <>
      {Object.values(nodes).map((node) => (
        <div key={node.fullPath}>
          {node.type === "folder" ? (
            // Folder
            <div className="pl-2">
              <div
                className="flex items-center gap-1.5 py-1 px-2 text-xs text-muted-foreground font-medium select-none"
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
              >
                <FoldersIcon className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                {node.name}
              </div>
              <RecursiveTree
                nodes={node.children}
                depth={depth + 1}
                selectedFile={selectedFile}
                mainFile={mainFile}
                onSelect={onSelect}
                onSetMain={onSetMain}
                onDelete={onDelete}
              />
            </div>
          ) : (
            // File
            <div
              className={cn(
                "group flex items-center justify-between py-1 text-xs cursor-pointer transition-colors rounded-sm mx-1",
                selectedFile.fileName === node.file!.fileName
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800",
              )}
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
              onClick={() => onSelect(node.file!)}
            >
              <div className="flex items-center gap-1.5 overflow-hidden">
                <FileIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{node.name}</span>
              </div>

              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                {mainFile === node.file!.fileName ? (
                  <span
                    className="text-[9px] text-blue-500 font-bold px-1"
                    title="Main Entry file"
                  >
                    M
                  </span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetMain(node.file!.fileName);
                    }}
                    className="text-zinc-400 hover:text-blue-500"
                    title="Set as Main"
                  >
                    <Settings2Icon size={10} />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(node.file!.fileName);
                  }}
                  className="text-zinc-400 hover:text-red-500"
                  title="Delete"
                >
                  <TrashIcon size={10} />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
