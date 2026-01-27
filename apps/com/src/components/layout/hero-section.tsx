"use client";

import { ArrowDown, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { ContactButton } from "./hero-section/contact-button";
import { ProjectsButton } from "./hero-section/projects-button";
import { Roles } from "./hero-section/roles";

export function HeroSection() {
  const t = useTranslations("hero");

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center relative overflow-hidden"
    >
      {/* Background gradient orb */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-purple-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="container-wide relative z-10 pt-32 pb-20">
        {/* Overline */}
        <div className="animate-in delay-1">
          <span className="overline inline-flex items-center gap-2 mb-8">
            <Sparkles className="w-3 h-3 text-[var(--accent-purple)]" />
            {t("available")}
          </span>
        </div>

        {/* Main headline - Editorial style */}
        <div className="max-w-5xl">
          <h1 className="text-[var(--primary)] mb-6 animate-in delay-2">
            <span className="block">Gabriel</span>
            <span className="block text-[var(--secondary)] italic">Halus</span>
          </h1>

          {/* Dynamic role */}
          <div className="animate-in delay-3">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-12 h-[2px] bg-[var(--accent-purple)]" />
              <span className="text-xl md:text-2xl text-[var(--secondary)] font-light tracking-tight">
                <Roles />
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-[var(--secondary)] max-w-xl leading-relaxed mb-12 animate-in delay-4">
            {t("description")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 animate-in delay-5">
            <ProjectsButton />
            <ContactButton />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mt-20 animate-in delay-6">
          <div className="space-y-1">
            <div className="font-display text-4xl md:text-5xl text-[var(--primary)]">
              5+
            </div>
            <div className="text-sm text-[var(--secondary)]">
              {t("yearsExp")}
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-display text-4xl md:text-5xl text-[var(--primary)]">
              20+
            </div>
            <div className="text-sm text-[var(--secondary)]">
              {t("projectsDelivered")}
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-display text-4xl md:text-5xl text-[var(--primary)]">
              ∞
            </div>
            <div className="text-sm text-[var(--secondary)]">
              {t("coffeeConsumed")}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToProjects}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--secondary)] hover:text-[var(--primary)] transition-colors cursor-pointer animate-in delay-7"
      >
        <span className="text-xs uppercase tracking-widest">{t("scroll")}</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
}
