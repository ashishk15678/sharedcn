export type VFile = { path: string; code: string };

export function buildBundle(files: VFile[], entry: string): string {
  // TODO: Implement Babel transpilation + module graph resolution
  // For now, return a placeholder that renders a basic message
  const safe = (s: string) => s.replace(/<\//g, "<\\/");
  const msg = `Preview not enabled yet for entry: ${entry}`;
  return `
    (function(){
      const root = document.getElementById('root');
      if (!root) return;
      root.innerHTML = '<div style="padding:16px;color:#64748b;font-family:system-ui">${safe(
        msg
      )}</div>';
    })();
  `;
}
