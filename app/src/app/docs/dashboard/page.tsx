export default function DashboardDocs() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="max-w-xl w-full px-4 py-10 flex flex-col items-center">
        <h1 className="text-2xl font-bold py-8 mb-4 text-zinc-100 w-full ">
          Dashboard
        </h1>
        <div className="w-full text-zinc-300 text-sm space-y-4">
          <ul className="list-disc ml-6 text-zinc-400">
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
