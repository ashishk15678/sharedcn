export default function InstallationDocs() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <div className="w-full bg-white/90 rounded-2xl shadow-lg p-8 text-zinc-800 border border-zinc-200">
        <h1 className="text-3xl font-extrabold mb-8 text-zinc-900">
          Installation
        </h1>
        <div className="w-full text-zinc-700 text-sm space-y-4">
          <div>
            <h2 className="font-semibold text-zinc-900 mb-1 text-base">
              Install the CLI
            </h2>
            <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
              npm install -g resources-hub-cli
            </pre>
            <p className="text-zinc-500">Or use directly with npx:</p>
            <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
              npx resources-hub-cli add &lt;component-alias&gt;
            </pre>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900 mb-1 text-base">
              Clone & Run the Project
            </h2>
            <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
              git clone &lt;repo-url&gt; cd &lt;repo-folder&gt; npm install npm
              run dev
            </pre>
            <p className="text-zinc-500">
              Open <span className="font-mono">http://localhost:3000</span> in
              your browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
