"use client";
import { useEffect, useRef } from "react";

export function PreviewPane({ bundle }: { bundle: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src * data: blob:; style-src 'unsafe-inline';" />
  <style>html,body,#root{height:100%;margin:0;padding:0;font-family:system-ui, sans-serif}</style>
</head>
<body>
  <div id="root"></div>
  <script>
    // Restrict network to GET images only with custom headers
    (function(){
      const allowedImg = (url) => true; // can refine later
      const addHeaders = (init) => {
        const headers = new Headers(init && init.headers || {});
        headers.set('X-SharedCN-Preview', 'true');
        return { ...init, headers };
      };
      const origFetch = window.fetch;
      window.fetch = async function(url, init){
        const method = (init && init.method || 'GET').toUpperCase();
        if(method !== 'GET') throw new Error('Only GET allowed in preview');
        return origFetch(url, addHeaders(init));
      };
      const origOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url){
        if(String(method).toUpperCase() !== 'GET') throw new Error('Only GET allowed in preview');
        return origOpen.apply(this, arguments);
      };
    })();
  </script>
  <script crossorigin>
  ${bundle}
  </script>
</body>
</html>`;

    doc.open();
    doc.write(html);
    doc.close();
  }, [bundle]);

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-scripts"
      className="w-full h-64 border border-yellow-100 rounded-xl shadow bg-white/70"
    />
  );
}
