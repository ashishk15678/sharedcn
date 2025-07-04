import Link from "next/link";

const sections = [
  { id: "installation", label: "Installation" },
  { id: "cli", label: "CLI Usage" },
  { id: "dashboard", label: "Dashboard" },
  { id: "api", label: "API Endpoints" },
  { id: "onboarding", label: "Onboarding & Auth" },
  { id: "tech", label: "Tech Stack" },
];

export default function DocsLanding() {
  return (
    <div className="text-zinc-200 max-w-2xl mx-auto py-8">
      <section className="mb-8 p-6 rounded-xl bg-zinc-900/80 shadow-sm border border-zinc-800">
        <h1 className="text-3xl font-bold text-yellow-300 mb-2">
          Introduction
        </h1>
        <p className="text-zinc-300 text-lg">
          <b>sharedcn</b> is a platform designed to make sharing code snippets
          and reusable components effortless. Whether you want to quickly save,
          share, or reuse small pieces of code or entire UI components, sharedcn
          provides a simple, fast, and collaborative way to do it.
        </p>
      </section>
      <section className="mb-8 p-6 rounded-xl bg-zinc-900/80 shadow-lg border border-zinc-800">
        <h2 className="text-2xl font-bold text-pink-400 mb-2">Why?</h2>
        <p className="text-zinc-300 text-lg">
          I built sharedcn because I was tired of losing useful code snippets
          and wanted a way to quickly share small code blocks and components
          with friends, teammates, or even my future self. It's about speed,
          simplicity, and making code sharing as frictionless as possible.
        </p>
      </section>
    </div>
  );
}
