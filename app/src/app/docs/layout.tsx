"use client";
import Link from "next/link";

const sections = [
  { id: "installation", label: "Installation" },
  { id: "cli", label: "CLI Usage" },
  { id: "dashboard", label: "Dashboard" },
  { id: "api", label: "API Endpoints" },
  { id: "onboarding", label: "Onboarding & Auth" },
  { id: "tech", label: "Tech Stack" },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full  flex flex-row items-center justify-center bg-zinc-950">
      {/* Sidebar nav, fixed, flush left, no border radius/shadow */}
      <div className="max-w-4xl flex flex-row justify-between items-center  ">
        <aside className="h-screen w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col py-8 px-4 z-20">
          <Link
            href="/docs"
            className="text-2xl font-extrabold text-zinc-100 tracking-tight mb-8"
          >
            Docs
          </Link>
          <nav className="flex flex-col gap-1">
            {sections.map((s) => (
              <Link
                key={s.id}
                href={`/docs/${s.id}`}
                className="text-zinc-400 hover:text-yellow-400 px-3 py-2 rounded transition-colors font-medium"
                prefetch={true}
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </aside>
        {/* Main content area, left-aligned, scrollable, no centering, no border radius/shadow */}
        <main className="flex-1 flex flex-row min-h-screen overflow-y-auto">
          <div className="flex-1 flex flex-col items-start justify-start px-12 py-12 max-w-4xl w-full">
            <div className="w-full text-zinc-100">{children}</div>
          </div>
          {/* Optional: Right TOC placeholder for future */}
          {/* <aside className="hidden xl:block w-64 border-l border-zinc-800 bg-zinc-950/80 px-4 py-8 text-zinc-400">TOC here</aside> */}
        </main>
        {/* TODO: Add responsive sidebar for mobile */}
      </div>
    </div>
  );
}
