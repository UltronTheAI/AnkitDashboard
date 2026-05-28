"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { IconFileDown, IconSearch, IconShield } from "@/app/ui/icons";

type ContentDoc = {
  id: string;
  name: string;
  description: string;
  link: string;
  imageUrl?: string;
  imagePublicId?: string;
  createdAt: string;
  updatedAt: string;
};

type FormDoc = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  contentName: string;
  createdAt: string;
};

function readAdminTokenCookie() {
  const match = document.cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export default function AdminPage() {
  const [tab, setTab] = useState<"content" | "forms">("content");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(readAdminTokenCookie());
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-black/5 bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-black/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Manage content and form submissions.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTab("content")}
              className={
                tab === "content"
                  ? "h-10 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
                  : "h-10 rounded-xl border border-black/10 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-black/5 dark:border-white/15 dark:bg-black/30 dark:text-zinc-100 dark:hover:bg-white/10"
              }
            >
              <span className="inline-flex items-center gap-2">
                <IconShield className="h-4 w-4" />
                Content
              </span>
            </button>
            <button
              type="button"
              onClick={() => setTab("forms")}
              className={
                tab === "forms"
                  ? "h-10 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
                  : "h-10 rounded-xl border border-black/10 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-black/5 dark:border-white/15 dark:bg-black/30 dark:text-zinc-100 dark:hover:bg-white/10"
              }
            >
              <span className="inline-flex items-center gap-2">
                <IconSearch className="h-4 w-4" />
                Forms
              </span>
            </button>
          </div>
        </div>
      </section>

      {tab === "content" ? <ContentAdmin token={token} /> : <FormsAdmin />}
    </div>
  );
}

function ContentAdmin({ token }: { token: string | null }) {
  const [items, setItems] = useState<ContentDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/content", {
        headers: token ? { authorization: `Bearer ${token}` } : undefined,
      });
      const data = (await res.json()) as { items?: ContentDoc[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to load content.");
      setItems(data.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load content.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      setCreating(true);

      let imageUrl: string | undefined;
      let imagePublicId: string | undefined;
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const up = await fetch("/api/admin/uploads", {
          method: "POST",
          headers: token ? { authorization: `Bearer ${token}` } : undefined,
          body: fd,
        });
        const upData = (await up.json()) as {
          ok?: boolean;
          error?: string;
          url?: string;
          publicId?: string;
        };
        if (!up.ok || !upData.ok || !upData.url || !upData.publicId) {
          throw new Error(upData.error ?? "Image upload failed.");
        }
        imageUrl = upData.url;
        imagePublicId = upData.publicId;
      }

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name,
          description,
          link,
          imageUrl,
          imagePublicId,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Create failed.");
      setName("");
      setDescription("");
      setLink("");
      setImageFile(null);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed.");
    } finally {
      setCreating(false);
    }
  }

  async function update(id: string, patch: Partial<ContentDoc>) {
    setError(null);
    try {
      const res = await fetch(`/api/admin/content/${id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(patch),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Update failed.");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed.");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this content?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/content/${id}`, {
        method: "DELETE",
        headers: token ? { authorization: `Bearer ${token}` } : undefined,
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Delete failed.");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    }
  }

  return (
    <div className="grid gap-6">
      <form
        onSubmit={create}
        className="grid gap-4 rounded-2xl border border-black/5 bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-black/40"
      >
        <div className="text-sm font-medium">Add content</div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-700 dark:text-zinc-300">Name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-xl border border-black/10 bg-white px-3 text-zinc-900 outline-none focus:border-zinc-400 dark:border-white/15 dark:bg-black/40 dark:text-zinc-100"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-700 dark:text-zinc-300">Link</span>
            <input
              required
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="h-11 rounded-xl border border-black/10 bg-white px-3 text-zinc-900 outline-none focus:border-zinc-400 dark:border-white/15 dark:bg-black/40 dark:text-zinc-100"
            />
          </label>
          <label className="grid gap-1 text-sm md:col-span-2">
            <span className="text-zinc-700 dark:text-zinc-300">Description</span>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 rounded-xl border border-black/10 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-zinc-400 dark:border-white/15 dark:bg-black/40 dark:text-zinc-100"
            />
          </label>
          <label className="grid gap-1 text-sm md:col-span-2">
            <span className="text-zinc-700 dark:text-zinc-300">
              Preview image (optional)
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="block w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-zinc-900 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-800 dark:border-white/15 dark:bg-black/40 dark:text-zinc-100 dark:file:bg-white dark:file:text-zinc-900 dark:hover:file:bg-zinc-200"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={creating}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {creating ? "Adding…" : "Add"}
        </button>
        {error ? (
          <div className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        ) : null}
      </form>

      <div className="grid gap-4 rounded-2xl border border-black/5 bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-black/40">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">All content</div>
          <button
            type="button"
            onClick={refresh}
            className="h-10 rounded-xl border border-black/10 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-black/5 dark:border-white/15 dark:bg-black/30 dark:text-zinc-100 dark:hover:bg-white/10"
          >
            Refresh
          </button>
        </div>
        {loading ? (
          <div className="text-sm text-zinc-500">Loading…</div>
        ) : items.length ? (
          <div className="grid gap-3">
            {items.map((it) => (
              <ContentRow
                key={it.id}
                item={it}
                token={token}
                onDelete={() => remove(it.id)}
                onUpdate={(patch) => update(it.id, patch)}
              />
            ))}
          </div>
        ) : (
          <div className="text-sm text-zinc-500">No content yet.</div>
        )}
      </div>
    </div>
  );
}

function ContentRow({
  item,
  token,
  onDelete,
  onUpdate,
}: {
  item: ContentDoc;
  token: string | null;
  onDelete: () => void;
  onUpdate: (patch: Partial<ContentDoc>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [link, setLink] = useState(item.link);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    setName(item.name);
    setDescription(item.description);
    setLink(item.link);
    setImageFile(null);
  }, [item]);

  return (
    <div className="rounded-xl border border-black/10 bg-white/60 p-4 dark:border-white/15 dark:bg-black/30">
      {!editing ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{item.name}</div>
            <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              {item.description}
            </div>
            <div className="mt-2 truncate text-xs text-zinc-500">{item.link}</div>
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt="Preview"
                src={item.imageUrl}
                className="mt-3 h-16 w-16 rounded-lg border border-black/10 object-cover dark:border-white/15"
              />
            ) : null}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="h-9 rounded-lg border border-black/10 bg-white px-3 text-sm hover:bg-black/5 dark:border-white/15 dark:bg-black/30 dark:hover:bg-white/10"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="h-9 rounded-lg border border-red-500/30 bg-red-500/10 px-3 text-sm text-red-700 hover:bg-red-500/15 dark:text-red-300"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-700 dark:text-zinc-300">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-zinc-400 dark:border-white/15 dark:bg-black/40"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-700 dark:text-zinc-300">Link</span>
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-zinc-400 dark:border-white/15 dark:bg-black/40"
              />
            </label>
            <label className="grid gap-1 text-sm md:col-span-2">
              <span className="text-zinc-700 dark:text-zinc-300">Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-20 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-white/15 dark:bg-black/40"
              />
            </label>
            <label className="grid gap-1 text-sm md:col-span-2">
              <span className="text-zinc-700 dark:text-zinc-300">
                Replace preview image (optional)
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="block w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-zinc-900 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-800 dark:border-white/15 dark:bg-black/40 dark:text-zinc-100 dark:file:bg-white dark:file:text-zinc-900 dark:hover:file:bg-zinc-200"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={async () => {
                let nextUrl: string | undefined = item.imageUrl;
                let nextPublicId: string | undefined = item.imagePublicId;
                if (imageFile) {
                  const fd = new FormData();
                  fd.append("file", imageFile);
                  const up = await fetch("/api/admin/uploads", {
                    method: "POST",
                    headers: token ? { authorization: `Bearer ${token}` } : undefined,
                    body: fd,
                  });
                  const upData = (await up.json()) as {
                    ok?: boolean;
                    error?: string;
                    url?: string;
                    publicId?: string;
                  };
                  if (!up.ok || !upData.ok || !upData.url || !upData.publicId) {
                    alert(upData.error ?? "Image upload failed.");
                    return;
                  }
                  nextUrl = upData.url;
                  nextPublicId = upData.publicId;
                }

                onUpdate({
                  name,
                  description,
                  link,
                  imageUrl: nextUrl,
                  imagePublicId: nextPublicId,
                });
                setEditing(false);
              }}
              className="h-9 rounded-lg bg-zinc-900 px-3 text-sm text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="h-9 rounded-lg border border-black/10 bg-white px-3 text-sm hover:bg-black/5 dark:border-white/15 dark:bg-black/30 dark:hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FormsAdmin() {
  const [items, setItems] = useState<FormDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = useMemo(() => readAdminTokenCookie(), []);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/forms", {
        headers: token ? { authorization: `Bearer ${token}` } : undefined,
      });
      const data = (await res.json()) as { items?: FormDoc[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to load forms.");
      setItems(data.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load forms.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this submission?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/forms/${id}`, {
        method: "DELETE",
        headers: token ? { authorization: `Bearer ${token}` } : undefined,
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Delete failed.");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    }
  }

  async function downloadCsv() {
    setError(null);
    try {
      const res = await fetch("/api/admin/forms/export", {
        headers: token ? { authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Export failed.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `forms-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed.");
    }
  }

  return (
    <div className="grid gap-4 rounded-2xl border border-black/5 bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-black/40">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Form submissions</div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={downloadCsv}
            className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <span className="inline-flex items-center gap-2">
              <IconFileDown className="h-4 w-4" />
              Export CSV
            </span>
          </button>
          <button
            type="button"
            onClick={refresh}
            className="h-10 rounded-xl border border-black/10 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-black/5 dark:border-white/15 dark:bg-black/30 dark:text-zinc-100 dark:hover:bg-white/10"
          >
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="text-sm text-zinc-500">Loading…</div>
      ) : items.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-zinc-500">
              <tr>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Phone</th>
                <th className="py-2 pr-4">Resource</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-t border-black/5 dark:border-white/10">
                  <td className="py-2 pr-4 text-xs text-zinc-500">
                    {new Date(it.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 pr-4">
                    {it.firstName} {it.lastName}
                  </td>
                  <td className="py-2 pr-4">{it.email}</td>
                  <td className="py-2 pr-4">{it.phone}</td>
                  <td className="py-2 pr-4">{it.contentName}</td>
                  <td className="py-2 pr-4">
                    <button
                      type="button"
                      onClick={() => remove(it.id)}
                      className="h-8 rounded-lg border border-red-500/30 bg-red-500/10 px-3 text-xs text-red-700 hover:bg-red-500/15 dark:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-sm text-zinc-500">No submissions yet.</div>
      )}
    </div>
  );
}
