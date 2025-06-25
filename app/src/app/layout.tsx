"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

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

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="top-right" richColors />
        </QueryClientProvider>
      </body>
    </html>
  );
}
