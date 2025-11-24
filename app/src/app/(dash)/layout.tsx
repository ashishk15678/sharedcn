import { Suspense } from "react";
import Loader from "./loading";
import { SidebarLayout } from "@/components/sidebarlayout";
import { requireAuth } from "@/lib/auth-utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  return (
    <>
      <SidebarLayout>
        <Suspense fallback={<Loader />}>
          {/* Main Content */}
          <div className="flex-1 overflow-auto ml-18 bg-linear-to-b from-white via-zinc-100/60 to-zinc-200 dark:from-zinc-700 dark:via-zinc-800/60 dark:to-zinc-800 h-screen w-full ">
            {children}
          </div>
        </Suspense>
      </SidebarLayout>
    </>
  );
}
