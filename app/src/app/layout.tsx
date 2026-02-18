import "./globals.css";
import { ReactNode, Suspense } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { AnalyticsComponent } from "@/components/analytics-component";
import { GlobalBreadcrumbs } from "@/components/global-bread-crumbs";
import { TRPCReactProvider } from "@/trpc/client";
import { APP_IMAGE } from "@/constants";
import { GlobaErrorBoundary } from "@/components/ui/Global-Error-Comp";
import { TopLoader } from "@/components/top-loader";
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <TRPCReactProvider>
      <HydrateClient>
        <html lang="en">
          <link rel="icon" href={APP_IMAGE}></link>
          <title>SharedCN</title>
          <meta
            name="description"
            content="Share your components effortlessly , in the easiest manner. It helps people using only cli , and that is it."
          ></meta>
          <body>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <Suspense>
                <TopLoader />
              </Suspense>
              <ErrorBoundary fallback={<GlobaErrorBoundary />}>
                {children}
              </ErrorBoundary>
              <GlobalBreadcrumbs />
              <Toaster />
            </ThemeProvider>
            <AnalyticsComponent />
          </body>
        </html>
      </HydrateClient>
    </TRPCReactProvider>
  );
}
