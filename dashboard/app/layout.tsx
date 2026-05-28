import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "./site-header";

export const metadata: Metadata = {
  title: "Ankit Bhati",
  description: "Request resources from Ankit Hiteshbhai Bhati",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Ankit Bhati",
    description: "Request resources from Ankit Hiteshbhai Bhati",
    images: [{ url: "/LSS-smp.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ankit Bhati",
    description: "Request resources from Ankit Hiteshbhai Bhati",
    images: ["/LSS-smp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className="min-h-dvh bg-[var(--background)] text-[var(--foreground)] antialiased">
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
