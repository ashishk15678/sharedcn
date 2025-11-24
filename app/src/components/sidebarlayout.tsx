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
import { APP_NAME } from "@/constants";

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
      link: "/components",
    },
  ];
  const session = (await requireAuth()).user;
  const header = await headers();
  const pathname = header.get("x-invoke-path") || "/";

  return (
    <div className="flex flex-1 min-h-screen bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="hidden absolute z-1  md:w-18 hover:w-56 border-r dark:bg-zinc-900 bg-white border-zinc-200 dark:border-zinc-800 px-2 py-4 transition-all group h-screen md:flex md:flex-col ">
        <div className="flex items-start w-full justify-center gap-y-2 flex-col flex-shrink-0 relative">
          <div>
            <Link href={"/"} className="w-full">
              <button className="w-full flex items-center p-2 cursor-pointer rounded-md transition-all duration-200 group text-zinc-600 dark:text-zinc-400">
                {/* 1. Icon Container: Stays the same fixed width */}
                <div className="flex-shrink-0 w-8 flex items-center justify-center">
                  <Image
                    src={"/shadcn-logo.png"}
                    width={32}
                    height={32}
                    className="rounded-full"
                    alt=""
                  />
                </div>

                {/* 2. Text Wrapper: Controls the expansion/collapse with max-width/overflow */}
                <div className="overflow-hidden transition-all duration-200 ease-in-out max-w-0 group-hover:max-w-xs">
                  <p className="ml-2 text-md whitespace-nowrap font-bold text-2xl track-wider">
                    {APP_NAME}
                  </p>
                </div>
              </button>
            </Link>
          </div>
          {topNavLinks.map((nav) => {
            const Icon = nav.icon;
            return (
              <div>
                <Link href={nav.link} className=" w-full">
                  <button className="w-full flex items-center p-2 cursor-pointer rounded-md transition-all duration-200 group text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex-row gap-x-4">
                    {/* 1. Icon Container: Stays the same fixed width */}
                    <div className="flex-shrink-0 w-8 flex items-center justify-center">
                      <Icon size={20} />
                    </div>

                    {/* 2. Text Wrapper: Controls the expansion/collapse with max-width/overflow */}
                    <div className="overflow-hidden transition-all duration-200 ease-in-out w-0 group-hover:w-full ">
                      <p className=" text-md whitespace-nowrap w-full">
                        {nav.name}
                      </p>
                    </div>
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
        <div className="mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-y-1 w-full items-start">
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
                  src={""}
                  height={20}
                  width={20}
                  alt=""
                  className="rounded-full "
                />
              )}{" "}
            </div>
            <p className="absolute flex flex-col left-10 py-2 text-md whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:block transition-opacity duration-200 pointer-events-none">
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
      {/* Theme Toggle */}
      <div className="absolute z-99 top-2 right-2">
        <ThemeToggle />
      </div>
    </div>
  );
}
