"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconMoon, IconSun } from "./ui/icons";

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === "dark" || current === "light") setTheme(current);
  }, []);

  function set(next: "light" | "dark") {
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-white/15 dark:bg-black/40 dark:text-zinc-100 dark:hover:bg-black/60"
      onClick={() => set(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <>
          <IconSun className="h-4 w-4" />
          Light
        </>
      ) : (
        <>
          <IconMoon className="h-4 w-4" />
          Dark
        </>
      )}
    </button>
  );
}

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-black/10 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-black/50">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold tracking-tight">
            Ankit Bhati
          </Link>
          <a
            href="https://www.instagram.com/aurankittt__/"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Instagram
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/saved-info"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Saved info
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
