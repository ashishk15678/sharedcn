import "./globals.css";
import { ReactNode, useEffect } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { AnalyticsComponent } from "@/components/analytics-component";
import { GlobalBreadcrumbs } from "@/components/global-bread-crumbs";
import { TRPCReactProvider } from "@/trpc/client";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <TRPCReactProvider>
      <HydrateClient>
        <html lang="en">
          <link rel="icon" href="/logo.png"></link>
          <title>SharedCN</title>
          <meta
            name="description"
            content="Share your components effortlessly , in the easiest manner. It helps people using only cli , and that is it."
          ></meta>
          <body className={""}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <ErrorBoundary fallback={<>Some error occured</>}>
                {children}
              </ErrorBoundary>
              <GlobalBreadcrumbs />
              <Toaster position="top-right" richColors />
            </ThemeProvider>
            <AnalyticsComponent />
          </body>
        </html>
      </HydrateClient>
    </TRPCReactProvider>
  );
}
