import Link from "next/link";
import { IconBookmark, IconInstagram } from "./ui/icons";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-black/10 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-black/50">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold tracking-tight">
            Ankit Bhati
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://www.instagram.com/aurankittt__/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            title="Instagram"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/60 text-zinc-700 hover:bg-white hover:text-zinc-900 dark:border-white/15 dark:bg-black/30 dark:text-zinc-300 dark:hover:bg-black/50 dark:hover:text-white"
          >
            <IconInstagram className="h-5 w-5" />
          </a>
          <Link
            href="/saved-info"
            aria-label="Saved info"
            title="Saved info"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/60 text-zinc-700 hover:bg-white hover:text-zinc-900 dark:border-white/15 dark:bg-black/30 dark:text-zinc-300 dark:hover:bg-black/50 dark:hover:text-white"
          >
            <IconBookmark className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
