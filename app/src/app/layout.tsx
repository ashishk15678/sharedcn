"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { User } from "../../generated/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

function GlobalBreadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  let path = "";
  return (
    <nav className="text-xs text-zinc-400 mb-6 flex items-center space-x-1 select-none px-4 pt-4">
      <Link
        href="/"
        className="hover:underline text-zinc-500 hover:text-zinc-300"
      >
        Home
      </Link>
      {parts.map((part, i) => {
        path += "/" + part;
        const isLast = i === parts.length - 1;
        return (
          <span key={part} className="flex items-center space-x-1">
            <span className="mx-1">/</span>
            {isLast ? (
              <span className="text-zinc-400">{part}</span>
            ) : (
              <Link
                href={path}
                className="hover:underline text-zinc-500 hover:text-zinc-300"
              >
                {part}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // const fetchUser = useQuery({
  //   queryKey: ["user"],
  //   queryFn: async () => {
  //     const user: User = await fetch("/api/user");

  //     if (!user.username || user.username.length < 3) {
  //       redirect("/onboarding");
  //     }
  //   },
  // });

  // export const metadata: Metadata = {
  //   title: "Resources Hub",
  //   description: "A collection of useful resources and components for developers",
  //   keywords: "Resource, startup, tech, build",
  //   openGraph: {
  //     title: "Resources Hub",
  //     description:
  //       "A collection of useful resources and components for developers",
  //     url: "https://resources.ashish.services",
  //     siteName: "Resources Hub",
  //     locale: "en-US",
  //     type: "website",
  //   },
  // };

  return (
    <html lang="en">
      <link rel="icon" href="/logo.png"></link>
      <title>SharedCN</title>
      <meta
        name="description"
        content="Share your components effortlessly , in the easiest manner. It helps people using only cli , and that is it."
      ></meta>
      <body
        className={" bg-gradient-to-b from-black via-zinc-900 to-zinc-950 "}
      >
        <QueryClientProvider client={queryClient}>
          <GlobalBreadcrumbs />
          {children}
          <Toaster position="top-right" richColors />
        </QueryClientProvider>
      </body>
    </html>
  );
}
