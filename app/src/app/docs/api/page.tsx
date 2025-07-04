export default function APIDocs() {
  return (
    <div className="min-h-screen flex flex-col items-center  ">
      <div className="max-w-xl w-full px-4 py-10 flex flex-col items-center">
        <h1 className="text-2xl font-bold py-8 mb-4 text-zinc-100 w-full ">
          API Endpoints
        </h1>
        <div className="w-full text-zinc-300 text-sm space-y-4">
          <div>
            <h2 className="font-semibold text-zinc-200 mb-1 text-base">
              Add Components
            </h2>
            <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
              POST /api/components/add Body: ["alias1", "alias2", ...]
            </pre>
            <p className="text-zinc-400">
              Returns: Array of found components or{" "}
              <code className="font-mono">{`{{ alias, error: "doesnot exist" }}`}</code>
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-200 mb-1 text-base">
              Create Component
            </h2>
            <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
              POST /api/components Body:{" "}
              {`{{ name, description, dependent, code }}`}
            </pre>
            <p className="text-zinc-400">
              Requires authentication. Adds a new component for the user.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-200 mb-1 text-base">
              Get Components
            </h2>
            <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
              GET /api/components
            </pre>
            <p className="text-zinc-400">
              Returns: All components for the signed-in user.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-200 mb-1 text-base">
              Check Alias
            </h2>
            <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
              GET /api/components/check-alias?alias=your-alias
            </pre>
            <p className="text-zinc-400">
              Returns:{" "}
              <code className="font-mono">{`{{ available: true/false }}`}</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
