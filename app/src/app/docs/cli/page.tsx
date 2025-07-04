export default function CLIDocs() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="max-w-xl w-full px-4 py-10 flex flex-col items-center">
        <h1 className="text-2xl font-bold py-8 mb-4 text-zinc-100 w-full ">
          CLI Usage
        </h1>
        <div className="w-full text-zinc-300 text-sm space-y-4">
          <div>
            <h2 className="font-semibold text-zinc-200 mb-1 text-base">
              Add Components
            </h2>
            <pre className="bg-zinc-900 rounded p-3 text-zinc-100 text-xs mb-1">
              npx resources-hub-cli add &lt;alias1&gt; &lt;alias2&gt;
            </pre>
            <ul className="list-disc ml-6 text-zinc-400">
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
