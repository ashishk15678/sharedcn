export default function APIDocs() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <div className="w-full bg-white/90 rounded-2xl shadow-lg p-8 text-zinc-800 border border-zinc-200">
        <h1 className="text-3xl font-extrabold mb-8 text-zinc-900">
          sharedcn API & CLI Documentation
        </h1>
        <div className="w-full text-zinc-700 text-sm space-y-4">
          <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-lg border border-yellow-200 mb-6 text-base">
            <b>⚠️ Note:</b> The CLI <code>setup-auth</code> command is currently{" "}
            <b>halted</b>. Please use only the <b>add</b> and <b>push</b>{" "}
            features for now.
            <br />
            <b>Push:</b> Your components will be added but with{" "}
            <code>@public</code> prefix.
          </div>
          {/* All the rest of the API/CLI docs content, as in the original file, should be preserved here. */}
          <div>
            <h2 className="font-semibold text-zinc-900 mb-1 text-base">
              CLI: Fetch Components by Alias (add)
            </h2>
            <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
              {`npx sharedcn add <alias1> <alias2> ...

- Fetches one or more components by alias.
- Writes code to components/custom/<alias>/
- Installs dependencies automatically.
- Shows missing components and failed installs.`}
            </pre>
            <b>Example:</b>
            <pre className="bg-zinc-900 rounded p-2 text-zinc-100 text-xs mt-2">
              {`npx sharedcn add @public/button @public/card`}
            </pre>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900 mb-1 text-base">
              CLI: Push Components (push)
            </h2>
            <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
              {`npx sharedcn push <file1> <file2> ... --name=<name> [--description=...] [--dependent=...]

- Pushes a new component to the server (with @public prefix).
- Example: npx sharedcn push Button.tsx --name=@public/button --description="A button"`}
            </pre>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900 mb-1 text-base">
              CLI: Setup Auth (halted)
            </h2>
            <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
              {`npx sharedcn setup-auth <token>

- This command is currently halted.`}
            </pre>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900 mb-1 text-base">
              API: Fetch Components by Alias
            </h2>
            <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
              {`POST /api/components/fetch
Body: ["alias1", "alias2", ...]

Returns: Array of components or { alias, error: "doesnot exist" } for missing ones.`}
            </pre>
            <b>Example:</b>
            <pre className="bg-zinc-900 rounded p-2 text-zinc-100 text-xs mt-2">
              {`curl -X POST https://yourdomain.com/api/components/fetch \
  -H "Content-Type: application/json" \
  -d '["@public/button", "@public/card"]'
`}
            </pre>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900 mb-1 text-base">
              API: Push Component (with @public prefix)
            </h2>
            <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
              {`POST /api/components/add
Body: { name, description, dependent, code }

- Adds a new component with @public prefix.
- Returns the created component or error.`}
            </pre>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900 mb-1 text-base">
              API: Check Alias Availability
            </h2>
            <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
              {`GET /api/components/check-alias?alias=your-alias Returns: ("available" = true / false)`}
            </pre>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900 mb-1 text-base">
              API: Get All Components
            </h2>
            <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
              {`GET /api/components/all Returns: Array of all components`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
