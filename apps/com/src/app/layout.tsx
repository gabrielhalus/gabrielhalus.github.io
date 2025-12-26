import type { Metadata } from "next";

import Script from "next/script";

import "./globals.css";

import { Toaster } from "sonner";

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
        <Script defer src="https://umami.gabrielhalus.com/script.js" data-website-id="2a84d9ed-7e67-461a-92d8-f423c604dc31" />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
