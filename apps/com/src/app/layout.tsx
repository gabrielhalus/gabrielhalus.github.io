import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";

import "./globals.css";

export const metadata: Metadata = {
  title: "Gabriel Halus - Fullstack Developer & Systems Architect",
  description:
    "Fullstack developer specializing in TypeScript, React, Next.js, Rust, and modern web technologies. Expert in identity management, backend orchestration, and performance optimization.",
  keywords: [
    "fullstack developer",
    "systems architect",
    "typescript",
    "react",
    "nextjs",
    "rust",
    "nodejs",
  ],
  authors: [{ name: "Gabriel Halus" }],
  creator: "Gabriel Halus",
  openGraph: {
    title: "Gabriel Halus - Fullstack Developer & Systems Architect",
    description:
      "Fullstack developer specializing in modern web technologies and system architecture.",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gabriel Halus - Fullstack Developer & Systems Architect",
    description:
      "Fullstack developer specializing in modern web technologies and system architecture.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
