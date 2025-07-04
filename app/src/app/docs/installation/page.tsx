export default function InstallationDocs() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="max-w-xl w-full px-4 py-10 flex flex-col items-center">
        <h1 className="text-2xl font-bold py-8 mb-4 text-zinc-100 w-full ">
          Installation
        </h1>
        <div className="w-full text-zinc-300 text-sm space-y-4">
          <div>
            <h2 className="font-semibold text-zinc-200 mb-1 text-base">
              Install the CLI
            </h2>
            <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
              npm install -g resources-hub-cli
            </pre>
            <p className="text-zinc-400">Or use directly with npx:</p>
            <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
              npx resources-hub-cli add &lt;component-alias&gt;
            </pre>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-200 mb-1 text-base">
              Clone & Run the Project
            </h2>
            <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
              git clone &lt;repo-url&gt; cd &lt;repo-folder&gt; npm install npm
              run dev
            </pre>
            <p className="text-zinc-400">
              Open <span className="font-mono">http://localhost:3000</span> in
              your browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
