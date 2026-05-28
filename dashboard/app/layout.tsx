import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "./site-header";
import ThemeScript from "./theme-script";

export const metadata: Metadata = {
  title: "Ankit Bhati",
  description: "Request resources from Ankit Hiteshbhai Bhati",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className="min-h-dvh bg-[var(--background)] text-[var(--foreground)] antialiased">
        <ThemeScript />
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
