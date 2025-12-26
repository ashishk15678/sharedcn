import { Suspense } from "react";
import Loader from "./loading";
import { SidebarLayout } from "@/components/sidebarlayout";
import { requireAuth } from "@/lib/auth-utils";
import { AppHeader } from "@/components/app-header";
import { AuroraBackground } from "@/components/hand-component";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  return (
    <>
      <div className="w-full h-screen flex flex-col">
        <AppHeader />
        <SidebarLayout>
          <div className="w-full absolute -z-1 blur-xl right-0 top-0 opacity-30">
            <AuroraBackground />
          </div>

          <Suspense fallback={<Loader />}>
            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-linear-to-b from-white via-zinc-100/60 to-zinc-200 dark:from-zinc-900 dark:via-zinc-800/60 dark:to-zinc-800 h-full w-full rounded-t-3xl ring ring-border ">
              {children}
            </div>
          </Suspense>
        </SidebarLayout>
      </div>
    </>
  );
}
