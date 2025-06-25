import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="h-screen w-full bg-gradient-to-b from-black via-zinc-950 to-zinc-700 flex items-center justify-center">
      <div className="absolute top-10 px-8 py-4 rounded-3xl text-zinc-500 hover:text-zinc-400 text-xl bg-zinc-900  ring-2 hover:shadow-lg hover:shadow-zinc-800 transition-all ring-zinc-700 flex flex-row space-x-4">
        <div>Dashboard</div>
        <div>My Components</div>
        <div>Deploy New</div>
        <div
          className="cursor-pointer"
          onClick={async () => {
            "use client";
            const { authClient } = await import("@/lib/auth-client");
            await authClient.signOut();
            window.location.href = "/sign-in";
          }}
        >
          Sign Out
        </div>
      </div>
      <div className="p-4 border-4 border-zinc-800 rounded-2xl flex flex-row gap-4 bg-gradient-to-br from-zinc-950 via-zinc-950  to-yellow-500/30 hover:to-yellow-500/40 transition-colors text-zinc-100 w-[700px]">
        <DashboardClient />
      </div>
    </div>
  );
}
