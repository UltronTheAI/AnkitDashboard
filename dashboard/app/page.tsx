import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "Request a resource • Ankit Bhati",
  description:
    "Request resources from Ankit. Pick one resource and receive it by email. Daily limit: 5 requests per 24 hours.",
  openGraph: {
    title: "Request a resource • Ankit Bhati",
    description:
      "Request resources from Ankit. Pick one resource and receive it by email. Daily limit: 5 requests per 24 hours.",
    images: [{ url: "/LSS-smp.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Request a resource • Ankit Bhati",
    description:
      "Request resources from Ankit. Pick one resource and receive it by email. Daily limit: 5 requests per 24 hours.",
    images: ["/LSS-smp.png"],
  },
};

export default function Page() {
  return <HomeClient />;
}

