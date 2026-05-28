"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SavedInfo = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

type ContentListItem = {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
};

const SAVED_INFO_KEY = "ankit_saved_info";

function readSavedInfo(): SavedInfo | null {
  try {
    const raw = localStorage.getItem(SAVED_INFO_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedInfo>;
    if (
      typeof parsed.firstName !== "string" ||
      typeof parsed.lastName !== "string" ||
      typeof parsed.phone !== "string" ||
      typeof parsed.email !== "string"
    ) {
      return null;
    }
    return {
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      phone: parsed.phone,
      email: parsed.email,
    };
  } catch {
    return null;
  }
}

export default function Home() {
  const [savedInfo, setSavedInfo] = useState<SavedInfo | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [query, setQuery] = useState("");
  const [loadingContent, setLoadingContent] = useState(false);
  const [content, setContent] = useState<ContentListItem[]>([]);
  const [contentId, setContentId] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<
    { type: "ok"; message: string } | { type: "err"; message: string } | null
  >(null);

  useEffect(() => {
    const info = readSavedInfo();
    setSavedInfo(info);
    if (info) {
      setFirstName(info.firstName);
      setLastName(info.lastName);
      setPhone(info.phone);
      setEmail(info.email);
    }
  }, []);

  const debouncedQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      setLoadingContent(true);
      try {
        const res = await fetch(
          `/api/content/search?q=${encodeURIComponent(debouncedQuery)}`,
        );
        const data = (await res.json()) as { items: ContentListItem[] };
        if (!cancelled) {
          setContent(data.items ?? []);
          if (data.items?.length && !contentId) {
            setContentId(data.items[0].id);
          }
        }
      } catch {
        if (!cancelled) setContent([]);
      } finally {
        if (!cancelled) setLoadingContent(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (!contentId) {
      setStatus({ type: "err", message: "Please select one resource." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          email,
          contentId,
        }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus({
          type: "err",
          message: data.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      setStatus({
        type: "ok",
        message: "Submitted. Check your email for the resource.",
      });
    } catch {
      setStatus({ type: "err", message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-black/5 bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-black/40">
        <h1 className="text-2xl font-semibold tracking-tight">Request a resource</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Fill the form, pick exactly one resource, and you’ll receive it by email.
          {savedInfo ? (
            <>
              {" "}
              (Autofilled from{" "}
              <Link href="/saved-info" className="underline underline-offset-4">
                saved info
              </Link>
              .)
            </>
          ) : (
            <>
              {" "}
              Save your details on{" "}
              <Link href="/saved-info" className="underline underline-offset-4">
                Saved info
              </Link>{" "}
              to autofill next time.
            </>
          )}
        </p>
      </section>

      <form
        onSubmit={submit}
        className="grid gap-6 rounded-2xl border border-black/5 bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-black/40"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-700 dark:text-zinc-300">First name</span>
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-11 rounded-xl border border-black/10 bg-white px-3 text-zinc-900 outline-none ring-0 focus:border-zinc-400 dark:border-white/15 dark:bg-black/40 dark:text-zinc-100"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-700 dark:text-zinc-300">Last name</span>
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-11 rounded-xl border border-black/10 bg-white px-3 text-zinc-900 outline-none ring-0 focus:border-zinc-400 dark:border-white/15 dark:bg-black/40 dark:text-zinc-100"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-700 dark:text-zinc-300">Number</span>
            <input
              required
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 rounded-xl border border-black/10 bg-white px-3 text-zinc-900 outline-none ring-0 focus:border-zinc-400 dark:border-white/15 dark:bg-black/40 dark:text-zinc-100"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-700 dark:text-zinc-300">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-xl border border-black/10 bg-white px-3 text-zinc-900 outline-none ring-0 focus:border-zinc-400 dark:border-white/15 dark:bg-black/40 dark:text-zinc-100"
            />
          </label>
        </div>

        <div className="grid gap-3">
          <div className="flex flex-col gap-1">
            <div className="text-sm font-medium">Choose one resource</div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Search by name/description. Links are hidden until emailed.
            </div>
          </div>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources…"
            className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-zinc-400 dark:border-white/15 dark:bg-black/40 dark:text-zinc-100"
          />

          <div className="grid gap-2">
            {loadingContent ? (
              <div className="text-sm text-zinc-500">Loading…</div>
            ) : content.length ? (
              content.map((item) => (
                <label
                  key={item.id}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-black/10 bg-white/60 p-3 hover:bg-white dark:border-white/15 dark:bg-black/30 dark:hover:bg-black/40"
                >
                  <input
                    type="radio"
                    name="resource"
                    className="mt-1"
                    checked={contentId === item.id}
                    onChange={() => setContentId(item.id)}
                    required
                  />
                  <div className="flex flex-1 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {item.name}
                      </div>
                      <div className="mt-1 max-h-8 overflow-hidden text-xs text-zinc-600 dark:text-zinc-400">
                        {item.description}
                      </div>
                    </div>
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt="Preview"
                        src={item.imageUrl}
                        className="h-12 w-12 shrink-0 rounded-lg border border-black/10 object-cover dark:border-white/15"
                      />
                    ) : (
                      <div className="h-12 w-12 shrink-0 rounded-lg border border-dashed border-black/20 dark:border-white/20" />
                    )}
                  </div>
                </label>
              ))
            ) : (
              <div className="text-sm text-zinc-500">No results.</div>
            )}
          </div>
        </div>

        {status ? (
          <div
            className={
              status.type === "ok"
                ? "rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300"
                : "rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300"
            }
          >
            {status.message}
          </div>
        ) : null}

        <button
          disabled={submitting}
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {submitting ? "Submitting…" : "Submit & email resource"}
        </button>
      </form>

      <section className="text-xs text-zinc-500 dark:text-zinc-400">
        Tip: Update your details anytime on{" "}
        <Link href="/saved-info" className="underline underline-offset-4">
          Saved info
        </Link>
        .
      </section>
    </div>
  );
}
