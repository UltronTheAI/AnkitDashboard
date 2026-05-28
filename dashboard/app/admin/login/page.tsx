"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconShield } from "@/app/ui/icons";

export default function AdminLoginPage() {
  const [nextPath, setNextPath] = useState("/admin");
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      setNextPath(url.searchParams.get("next") ?? "/admin");
    } catch {}
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!token.trim()) {
      setError("Token is required.");
      return;
    }
    document.cookie = `admin_token=${encodeURIComponent(
      token.trim(),
    )}; Path=/; SameSite=Lax`;
    window.location.href = nextPath;
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <section className="rounded-2xl border border-black/5 bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-black/40">
        <h1 className="text-2xl font-semibold tracking-tight">Admin login</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Enter the admin access token (from your `.env`) to continue.
        </p>
      </section>

      <form
        onSubmit={submit}
        className="grid gap-4 rounded-2xl border border-black/5 bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-black/40"
      >
        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700 dark:text-zinc-300">Access token</span>
          <div className="relative">
            <IconShield className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="h-11 w-full rounded-xl border border-black/10 bg-white pl-10 pr-3 text-zinc-900 outline-none focus:border-zinc-400 dark:border-white/15 dark:bg-black/40 dark:text-zinc-100"
            />
          </div>
        </label>
        {error ? (
          <div className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        ) : null}
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Continue
        </button>
        <Link
          href="/"
          className="text-center text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Back to site
        </Link>
      </form>
    </div>
  );
}
