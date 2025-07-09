export default function CLIDocs() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <div className="w-full bg-white/90 rounded-2xl shadow-lg p-8 text-zinc-800 border border-zinc-200">
        <h1 className="text-3xl font-extrabold mb-8 text-zinc-900">
          CLI Usage
        </h1>
        <div className="w-full text-zinc-700 text-sm space-y-4">
          <div>
            <h2 className="font-semibold text-zinc-900 mb-1 text-base">
              Add Components
            </h2>
            <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
              npx resources-hub-cli add &lt;alias1&gt; &lt;alias2&gt;
            </pre>
            <ul className="list-disc ml-6 text-zinc-500">
              <li>
                Creates <span className="font-mono">.jsx</span> files in your{" "}
                <span className="font-mono">components/</span> directory.
              </li>
              <li>Installs required dependencies automatically.</li>
              <li>
                Shows a summary of missing components and failed installs.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
