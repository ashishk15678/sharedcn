"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const usernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(32, "Username must be under 32 characters")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers or dashes only"),
});

export default function SettingsPage() {
  const {
    data: usernameData,
    isLoading: usernameLoading,
    refetch: refetchUsername,
  } = trpc.username.get.useQuery();
  const usernameMutation = trpc.username.set.useMutation({
    onSuccess: () => {
      toast.success("Username saved");
      refetchUsername();
    },
    onError: (error) => {
      toast.error(error.message || "Unable to save username");
    },
  });

  const tokenMutation = trpc.user.getToken.useMutation({
    onSuccess: (data) => {
      setToken(data.token);
      toast.success("Auth token generated");
    },
    onError: () => {
      toast.error("Unable to generate token");
    },
  });

  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { data: sessionsData = [], isLoading: sessionsLoading } =
    trpc.user.sessions.useQuery();

  const usernameForm = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: "",
    },
  });

  useEffect(() => {
    usernameForm.reset({
      username: usernameData?.username ?? "",
    });
  }, [usernameData?.username, usernameForm]);

  const canEditUsername = !usernameData?.username;

  async function onSubmit(values: z.infer<typeof usernameSchema>) {
    if (!canEditUsername) return;
    await usernameMutation.mutateAsync({ username: values.username });
  }

  function maskToken(value: string) {
    if (!value) return "";
    if (value.length <= 8) return value;
    return `${value.slice(0, 4)}••••${value.slice(-4)}`;
  }

  async function handleCopyToken() {
    try {
      if (!token) {
        const data = await tokenMutation.mutateAsync();
        setToken(data.token);
        await navigator.clipboard.writeText(data.token as unknown as string);
      } else {
        await navigator.clipboard.writeText(token);
      }
      setCopied(true);
      toast.success("Token copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error(error);
      toast.error("Unable to copy token");
    }
  }

  const formattedSessions = useMemo(() => {
    return sessionsData.map((session) => ({
      ...session,
      client: parseClient(session.userAgent),
      lastSeen: formatRelativeTime(session.updatedAt),
    }));
  }, [sessionsData]);

  return (
    <div className="">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 md:px-6">
        <section className="rounded-3xl  py-8   backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Manage your SharedCN account
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 ">
                Update your profile, username, and developer token.
              </p>
            </div>
            <Button
              size={"lg"}
              variant="outline"
              className="gap-x-2  px-6 shadow-none bg-transparent hover:bg-transparent group opacity-50 hover:opacity-100 hover:shadow-xs"
              onClick={() => refetchUsername()}
            >
              <RefreshCw className="size-3 group-hover:rotate-90 transition-all duration-300" />
              Refresh
            </Button>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="h-full shadow-none bg-card/50">
            <CardHeader>
              <div className="flex flex-col gap-1.5">
                <CardTitle>Username</CardTitle>
                <CardDescription>
                  Your public handle across SharedCN. Usernames are permanent.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...usernameForm}>
                <form
                  onSubmit={usernameForm.handleSubmit(onSubmit)}
                  className="space-y-3"
                >
                  <FormField
                    control={usernameForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                          {usernameLoading
                            ? "Loading username..."
                            : usernameData?.username
                              ? "Username (locked)"
                              : "Choose a username"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your-handle"
                            disabled={!canEditUsername || usernameLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className={cn(
                      "w-full",
                      (!canEditUsername || usernameMutation.isPending) &&
                        "cursor-not-allowed",
                    )}
                    disabled={!canEditUsername || usernameMutation.isPending}
                    variant={"outline"}
                  >
                    {usernameMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        Saving...
                      </span>
                    ) : canEditUsername ? (
                      "Save username"
                    ) : (
                      "Username locked"
                    )}
                  </Button>
                  {!canEditUsername && (
                    <p className="text-xs text-zinc-500">
                      Reach out to support if you need to change your username.
                    </p>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="h-full shadow-none bg-card/50">
            <CardHeader>
              <div className="flex flex-col gap-1.5">
                <CardTitle>Developer token</CardTitle>
                <CardDescription>
                  Generate or copy your CLI token to authenticate the SharedCN
                  CLI.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/60">
                <p className=" font-mono text-sm text-zinc-900 dark:text-zinc-100">
                  {token ? maskToken(token) : "Generate to reveal your token"}
                </p>
              </div>
              <div className="flex flex-col gap-2 md:flex-row">
                <Button
                  type="button"
                  className="flex-1"
                  disabled={tokenMutation.isPending}
                  onClick={() => tokenMutation.mutate()}
                  variant={"secondary"}
                >
                  {tokenMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Generating...
                    </span>
                  ) : (
                    "Generate token"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 gap-2"
                  disabled={tokenMutation.isPending && !token}
                  onClick={handleCopyToken}
                >
                  <Copy className="size-4" />
                  {copied ? "Copied" : "Copy token"}
                </Button>
              </div>
              <p className="text-xs text-zinc-500">
                Keep this token secret. Use{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[0.7rem] dark:bg-zinc-800">
                  npx sharedcn setup-auth &lt;token&gt;
                </code>{" "}
                to authenticate the CLI.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-none bg-card/50">
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Session management and alert preferences are coming soon.
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-4 flex  w-full ">
            <div className="rounded-2xl border border-zinc-200/70 bg-card/50 p-4 dark:border-zinc-800 w-full">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Recent sessions
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Powered by BetterAuth. These are the most recent devices that
                have accessed your account.
              </p>
              <div className="mt-4 space-y-1  overflow-y-auto">
                {sessionsLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="h-12 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800"
                      />
                    ))}
                  </div>
                ) : formattedSessions.length > 0 ? (
                  formattedSessions.map((session, idx) => (
                    <div
                      key={session.id}
                      className="rounded-2xl   px-3 py-1 text-sm  flex flex-row items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-zinc-800 dark:text-zinc-100">
                          {idx + 1} : {session.client.device}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {session.client.browser} • {session.client.os}
                        </p>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
                          {session.ipAddress || "IP unknown"}
                        </span>
                        <span>{session.lastSeen}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-zinc-200 p-4 text-sm text-zinc-500 dark:border-zinc-800">
                    No sessions recorded yet. Log in from another device to see
                    it listed here.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-zinc-500">
              Need something else? Ping @ashishonsol on X or open an issue on
              https://github.com/ashishk15678/sharedcn .
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

type ClientInfo = {
  browser: string;
  os: string;
  device: string;
};

function parseClient(userAgent?: string | null): ClientInfo {
  if (!userAgent)
    return {
      browser: "Unknown browser",
      os: "Unknown OS",
      device: "Unknown device",
    };
  const ua = userAgent.toLowerCase();

  const browser = ua.includes("chrome")
    ? "Chrome"
    : ua.includes("safari")
      ? "Safari"
      : ua.includes("firefox")
        ? "Firefox"
        : "Unknown browser";

  const os = ua.includes("mac")
    ? "macOS"
    : ua.includes("win")
      ? "Windows"
      : ua.includes("linux")
        ? "Linux"
        : ua.includes("iphone") || ua.includes("ipad")
          ? "iOS"
          : ua.includes("android")
            ? "Android"
            : "Unknown OS";

  const device = ua.includes("mobile")
    ? "Mobile"
    : ua.includes("tablet")
      ? "Tablet"
      : "Desktop";

  return { browser, os, device };
}

function formatRelativeTime(date: string | Date): string {
  const target = new Date(date);
  const diffMs = target.getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const absSec = Math.abs(diffSec);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absSec < 60) return rtf.format(Math.round(diffSec), "second");
  const diffMin = Math.round(diffSec / 60);
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute");
  const diffHr = Math.round(diffMin / 60);
  if (Math.abs(diffHr) < 24) return rtf.format(diffHr, "hour");
  const diffDay = Math.round(diffHr / 24);
  return rtf.format(diffDay, "day");
}
