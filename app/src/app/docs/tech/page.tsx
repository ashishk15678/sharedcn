export default function TechDocs() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="max-w-xl w-full px-4 py-10 flex flex-col items-center">
        <h1 className="text-2xl font-bold py-8 mb-4 text-zinc-100 w-full ">
          Tech Stack
        </h1>
        <div className="w-full text-zinc-300 text-sm space-y-4">
          <ul className="list-disc ml-6 text-zinc-400">
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
