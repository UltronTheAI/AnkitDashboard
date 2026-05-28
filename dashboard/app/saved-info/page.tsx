"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import Link from "next/link";

type SavedInfo = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

const KEY = "ankit_saved_info";

function loadInfo(): SavedInfo | null {
  try {
    const raw = localStorage.getItem(KEY);
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

export default function SavedInfoPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const info = loadInfo();
    if (!info) return;
    setFirstName(info.firstName);
    setLastName(info.lastName);
    setPhone(info.phone);
    setEmail(info.email);
  }, []);

  function save() {
    setStatus(null);
    const payload: SavedInfo = { firstName, lastName, phone, email };
    try {
      localStorage.setItem(KEY, JSON.stringify(payload));
      setStatus("Saved to this browser.");
    } catch {
      setStatus("Could not save (storage blocked).");
    }
  }

  function clear() {
    setStatus(null);
    try {
      localStorage.removeItem(KEY);
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setStatus("Cleared.");
    } catch {
      setStatus("Could not clear.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-black/5 bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-black/40">
        <h1 className="text-2xl font-semibold tracking-tight">Saved info</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Stored only in your browser (localStorage). Used to autofill the request
          form on{" "}
          <Link href="/" className="underline underline-offset-4">
            Home
          </Link>
          .
        </p>
      </section>

      <div className="grid gap-6 rounded-2xl border border-black/5 bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-black/40">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-700 dark:text-zinc-300">First name</span>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-11 rounded-xl border border-black/10 bg-white px-3 text-zinc-900 outline-none focus:border-zinc-400 dark:border-white/15 dark:bg-black/40 dark:text-zinc-100"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-700 dark:text-zinc-300">Last name</span>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-11 rounded-xl border border-black/10 bg-white px-3 text-zinc-900 outline-none focus:border-zinc-400 dark:border-white/15 dark:bg-black/40 dark:text-zinc-100"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-700 dark:text-zinc-300">Number</span>
            <input
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 rounded-xl border border-black/10 bg-white px-3 text-zinc-900 outline-none focus:border-zinc-400 dark:border-white/15 dark:bg-black/40 dark:text-zinc-100"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-700 dark:text-zinc-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-xl border border-black/10 bg-white px-3 text-zinc-900 outline-none focus:border-zinc-400 dark:border-white/15 dark:bg-black/40 dark:text-zinc-100"
            />
          </label>
        </div>

        {status ? (
          <div className="rounded-xl bg-black/5 px-3 py-2 text-sm text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
            {status}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={save}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Save
          </button>
          <button
            type="button"
            onClick={clear}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-black/10 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-black/5 dark:border-white/15 dark:bg-black/30 dark:text-zinc-100 dark:hover:bg-white/10"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
