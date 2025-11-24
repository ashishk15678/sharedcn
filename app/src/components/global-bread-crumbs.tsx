"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function GlobalBreadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  let path = "";
  return (
    <nav className="text-xs text-zinc-400 absolute bottom-1 right-1 flex items-center space-x-1 select-none px-4 pt-4">
      <Link
        href="/"
        className="hover:underline text-zinc-500 hover:text-zinc-300"
      >
        Home
      </Link>
      {parts.map((part, i) => {
        path += "/" + part;
        const isLast = i === parts.length - 1;
        return (
          <span key={part} className="flex items-center space-x-1">
            <span className="mx-1">/</span>
            {isLast ? (
              <span className="text-zinc-400">{part}</span>
            ) : (
              <Link
                href={path}
                className="hover:underline text-zinc-500 hover:text-zinc-300"
              >
                {part}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
