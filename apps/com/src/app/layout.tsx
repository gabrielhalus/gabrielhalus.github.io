// Root layout - minimal wrapper for locale layouts
// The actual HTML structure is provided by [locale]/layout.tsx

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
