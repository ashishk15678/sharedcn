export default function OnboardingDocs() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <div className="w-full bg-white/90 rounded-2xl shadow-lg p-8 text-zinc-800 border border-zinc-200">
        <h1 className="text-3xl font-extrabold mb-8 text-zinc-900">
          Onboarding & Auth
        </h1>
        <div className="w-full text-zinc-700 text-sm space-y-4">
          <ul className="list-disc ml-6 text-zinc-500">
            <li>
              First-time users must set a unique username (min 3 chars,
              real-time check).
            </li>
            <li>Username is required to access the dashboard and API.</li>
            <li>
              All authentication is handled by BetterAuth with Google and GitHub
              providers.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
