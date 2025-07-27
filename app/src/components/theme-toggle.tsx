"use client";

import * as React from "react";
import { MoonStarIcon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-lg p-2 hover:bg-gray-100 group dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100  font-thin transition-all duration-300"
    >
      {theme == "light" ? (
        <Sun className="h-5 w-5 rotate-0 group-hover:rotate-90 scale-100 transition-all dark:-rotate-90 dark:scale-0 duration-300" />
      ) : (
        <MoonStarIcon className="h-5 w-5 group-hover:rotate-90 transition-all   duration-300" />
      )}{" "}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
