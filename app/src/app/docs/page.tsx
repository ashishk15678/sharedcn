export default function DocsLanding() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <div className="w-full bg-white/90 rounded-2xl shadow-lg p-8 text-zinc-800 border border-zinc-200">
        <section className="mb-12 text-center">
          <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            Docs
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-zinc-900 leading-tight">
            Welcome to SharedCN Documentation
          </h1>
          <h2 className="text-2xl md:text-3xl font-light text-gray-400 italic mb-8 leading-tight">
            Everything you need to share, install, and manage components.
          </h2>
        </section>
        <section className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 border border-zinc-100 shadow">
          <h3 className="text-2xl font-bold text-pink-500 mb-2">
            What is SharedCN?
          </h3>
          <p className="text-zinc-700 text-lg">
            <b>SharedCN</b> is a platform designed to make sharing code snippets
            and reusable components effortless. Whether you want to quickly
            save, share, or reuse small pieces of code or entire UI components,
            SharedCN provides a simple, fast, and collaborative way to do it.
          </p>
        </section>
        <section className="mb-12 p-8 rounded-2xl bg-white border border-zinc-100 shadow">
          <h3 className="text-2xl font-bold text-blue-500 mb-2">
            Why SharedCN?
          </h3>
          <p className="text-zinc-700 text-lg">
            I built SharedCN because I was tired of losing useful code snippets
            and wanted a way to quickly share small code blocks and components
            with friends, teammates, or even my future self. It's about speed,
            simplicity, and making code sharing as frictionless as possible.
          </p>
        </section>
      </div>
    </div>
  );
}
