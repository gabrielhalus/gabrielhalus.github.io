"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="py-12 border-t border-[var(--border-subtle)]">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="font-display text-2xl text-[var(--primary)]">
            G.
          </div>

          {/* Center text */}
          <p className="text-sm text-[var(--secondary)] text-center">
            {t("tagline")}
          </p>

          {/* Copyright */}
          <p className="text-sm text-[var(--secondary)]">
            &copy; {new Date().getFullYear()} Gabriel Halus
          </p>
        </div>
      </div>
    </footer>
  );
}
