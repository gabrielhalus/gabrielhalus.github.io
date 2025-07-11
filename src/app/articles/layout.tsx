import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import React from "react";

export default function ArticleLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {children}
      <Footer />
    </div>
  );
}
