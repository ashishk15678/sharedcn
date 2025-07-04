export default function OnboardingDocs() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="max-w-xl w-full px-4 py-10 flex flex-col items-center">
        <h1 className="text-2xl font-bold py-8 mb-4 text-zinc-100 w-full ">
          Onboarding & Auth
        </h1>
        <div className="w-full text-zinc-300 text-sm space-y-4">
          <ul className="list-disc ml-6 text-zinc-400">
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
