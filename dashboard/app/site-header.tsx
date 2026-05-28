import Link from "next/link";

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
        </div>
      </div>
    </header>
  );
}
