export default function APIDocs() {
  return (
    <div className="min-h-screen flex flex-row">
      {/* <div className="w-64 flex-shrink-0 bg-zinc-900 text-zinc-200 p-4 min-h-screen">
        {/* Sidebar content here (if any) 
      </div> */}
      <div
        className="flex-1 flex flex-col items-center"
        style={{ maxHeight: "100vh", overflowY: "auto", padding: "0 2vw" }}
      >
        <div className="w-full py-10 flex flex-col items-center">
          <h1 className="text-2xl font-bold py-8 mb-4 text-zinc-100 w-full ">
            sharedcn API & CLI Documentation
          </h1>
          <div className="w-full text-zinc-300 text-sm space-y-4">
            <div
              style={{
                background: "#fffbe6",
                color: "#ad8b00",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ffe58f",
                marginBottom: "16px",
                fontSize: "0.95em",
              }}
            >
              <b>⚠️ Note:</b> The CLI <code>setup-auth</code> command is
              currently <b>halted</b>. Please use only the <b>add</b> and{" "}
              <b>push</b> features for now.
              <br />
              <b>Push:</b> Your components will be added but with{" "}
              <code>@public</code> prefix.
            </div>

            <div>
              <h2 className="font-semibold text-zinc-200 mb-1 text-base">
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
              <h2 className="font-semibold text-zinc-200 mb-1 text-base">
                CLI: Push Components (push)
              </h2>
              <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
                {`npx sharedcn push <file1> <file2> ... --name=<name> [--description=...] [--dependent=...]

- Pushes a new component to the server (with @public prefix).
- Example: npx sharedcn push Button.tsx --name=@public/button --description="A button"`}
              </pre>
            </div>

            <div>
              <h2 className="font-semibold text-zinc-200 mb-1 text-base">
                CLI: Setup Auth (halted)
              </h2>
              <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
                {`npx sharedcn setup-auth <token>

- This command is currently halted.`}
              </pre>
            </div>

            <div>
              <h2 className="font-semibold text-zinc-200 mb-1 text-base">
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
              <h2 className="font-semibold text-zinc-200 mb-1 text-base">
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
              <h2 className="font-semibold text-zinc-200 mb-1 text-base">
                API: Check Alias Availability
              </h2>
              <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
                GET /api/components/check-alias?alias=your-alias Returns:{" "}
                ("available" = true / false)
              </pre>
            </div>
            <div>
              <h2 className="font-semibold text-zinc-200 mb-1 text-base">
                API: Get All Components
              </h2>
              <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
                GET /api/components/all Returns: Array of all components
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
