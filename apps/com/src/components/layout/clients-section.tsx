"use client";

import { useTranslations } from "next-intl";

import type { Client } from "@/lib/content";

interface ClientsSectionProps {
  clients: Client[];
}

export function ClientsSection({ clients }: ClientsSectionProps) {
  const t = useTranslations("clients");

  return (
    <section className="py-20 border-y border-[var(--border-subtle)]">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="overline text-[var(--secondary)]">
            {t("title")}
          </span>
        </div>

        {/* Clients grid */}
        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
          {clients.map((client) => (
            <div
              key={client.slug}
              className="group flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity duration-300"
            >
              {/* Logo placeholder - stylized abbreviation */}
              <div className="w-12 h-12 rounded-xl bg-[var(--highlight)] flex items-center justify-center group-hover:bg-[var(--accent-purple)]/10 transition-colors">
                <span className="font-display text-lg text-[var(--secondary)] group-hover:text-[var(--accent-purple)] transition-colors">
                  {client.abbreviation}
                </span>
              </div>
              <span className="text-sm font-medium text-[var(--secondary)] group-hover:text-[var(--primary)] transition-colors hidden md:block">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
