"use client";
import "./globals.css";
import { ReactNode, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ReactGA from "react-ga4";

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
  const TRACKING_ID = "G-NHX0XB1HWG";
  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
    // Send pageview with a custom path
    ReactGA.send({
      hitType: "pageview",
      page: "/landingpage",
      title: "Landing Page",
    });
  }, []);
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
        <Analytics />
      </body>
    </html>
  );
}
