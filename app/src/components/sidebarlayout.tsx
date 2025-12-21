import { ThemeToggle } from "@/components/theme-toggle";
import {
  Home,
  Settings,
  Laptop,
  LayoutDashboardIcon,
  ComponentIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { ReactNode, Suspense } from "react";
import { requireAuth } from "@/lib/auth-utils";
import { LogoutButton } from "./auth/logout-button";
import { APP_NAME, USER_IMAGE_FALLBACK } from "@/constants";
import { cn } from "@/lib/utils";

export async function SidebarLayout({ children }: { children: ReactNode }) {
  const topNavLinks = [
    {
      id: 1,
      name: "Home",
      icon: Home,
      link: "/",
    },
    {
      id: 2,
      name: "Settings",
      icon: Settings,
      link: "/settings",
    },
    {
      id: 3,
      name: "Playground",
      icon: Laptop,
      link: "/playground",
    },
    {
      id: 4,
      name: "Dashboard",
      icon: LayoutDashboardIcon,
      link: "/dashboard",
    },
    {
      id: 5,
      name: "Components",
      icon: ComponentIcon,
      link: "/component",
    },
  ];
  const session = (await requireAuth()).user;
  const header = await headers();
  const path = header.get("referer")?.split("/");
  const pathname = path != undefined ? "/" + path[path?.length - 1] : "/";
  console.log({ pathname });
  return (
    <div className="flex flex-1  text-primary border-border">
      <div className="w-1/8 border-r bg-card/30 border-zinc-200 dark:border-zinc-800 px-1 py-4 transition-all group h-full md:flex md:flex-col ">
        <div className="flex items-start w-full  flex-col flex-shrink-0 relative px-1 gap-y-0.5">
          {topNavLinks.map((nav) => {
            const Icon = nav.icon;
            return (
              <div className="w-full">
                <Link href={nav.link} className=" w-full">
                  <button
                    className={cn(
                      "w-full flex  py-2 cursor-pointer rounded-sm transition-all duration-200 group text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800  gap-x-0.5 px-1",
                      pathname == nav.link &&
                        "font-extrabold bg-secondary/20 ring-zinc-300 dark:ring-zinc-600 backdrop-blur-2xl  ring",
                    )}
                  >
                    {/* 1. Icon Container: Stays the same fixed width */}
                    <div className="flex-shrink-0 w-8 flex items-center justify-center">
                      <Icon size={18} />
                    </div>

                    {/* 2. Text Wrapper: Controls the expansion/collapse with max-width/overflow */}
                    <div className="">
                      <p className={cn(" text-sm whitespace-nowrap w-full")}>
                        {nav.name}
                      </p>
                    </div>
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
        <div className="mt-auto pt-4 border-t border-border dark:border-zinc-800 flex flex-col gap-y-1 w-full items-start">
          <Link
            href="/user" // Example link
            className={`
              relative w-full flex items-center p-2 cursor-pointer rounded-md transition-all duration-200 group
              ${
                pathname === "/user"
                  ? "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }
            `}
          >
            <div className="flex-shrink-0 w-8 flex items-center justify-center">
              {session == undefined || session == null ? (
                <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-600  animate-pulse" />
              ) : (
                <Image
                  src={session.image || USER_IMAGE_FALLBACK}
                  height={20}
                  width={20}
                  alt=""
                  className="rounded-full "
                />
              )}{" "}
            </div>
            <p className="absolute flex flex-col left-10 py-2 text-md whitespace-nowrap  duration-200 pointer-events-none">
              {session !== undefined ? (
                session.name
              ) : (
                <span className="animate-pulse text-sm"> Loading ... </span>
              )}
              {session !== undefined && (
                <p className="text-xs -mt-2">{session.email}</p>
              )}{" "}
            </p>
          </Link>

          <LogoutButton />
        </div>
      </div>
      {children}
    </div>
  );
}
