export default function TechDocs() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <div className="w-full bg-white/90 rounded-2xl shadow-lg p-8 text-zinc-800 border border-zinc-200">
        <h1 className="text-3xl font-extrabold mb-8 text-zinc-900">
          Tech Stack
        </h1>
        <div className="w-full text-zinc-700 text-sm space-y-4">
          <ul className="list-disc ml-6 text-zinc-500">
            <li>Next.js (App Router)</li>
            <li>Prisma ORM</li>
            <li>BetterAuth (Google & GitHub)</li>
            <li>TanStack Query</li>
            <li>Sonner (toasts)</li>
            <li>Chalk (CLI colors)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
