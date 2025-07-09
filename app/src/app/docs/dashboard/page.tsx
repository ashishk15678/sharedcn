export default function DashboardDocs() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <div className="w-full bg-white/90 rounded-2xl shadow-lg p-8 text-zinc-800 border border-zinc-200">
        <h1 className="text-3xl font-extrabold mb-8 text-zinc-900">
          Dashboard
        </h1>
        <div className="w-full text-zinc-700 text-sm space-y-4">
          <ul className="list-disc ml-6 text-zinc-500">
            <li>Sign in with Google or GitHub (BetterAuth).</li>
            <li>On first sign-in, set a unique username via onboarding.</li>
            <li>
              Deploy new components with a unique alias, description,
              dependencies, and code.
            </li>
            <li>
              View, search, and manage your components in a beautiful dashboard
              UI.
            </li>
            <li>
              All actions use TanStack Query for seamless UX and Sonner for
              notifications.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
