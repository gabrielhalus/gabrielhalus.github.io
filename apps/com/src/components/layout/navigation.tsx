"use client";

import { Globe, Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import type { Locale } from "@/i18n/config";
import { localeNames } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/routing";
import { trackEvent } from "@/lib/umami";

const navLinkIds = ["home", "projects", "skills", "blog", "contact"] as const;

export function Navigation() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = navLinkIds.map((id) => ({
    id,
    label: t(id),
  }));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);

      const sections = navLinkIds.map((id) => document.getElementById(id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navLinkIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    trackEvent("navigation_click", {
      section: sectionId,
      location: "navigation",
    });
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const switchLocale = (newLocale: Locale) => {
    trackEvent("language_switch", {
      from: locale,
      to: newLocale,
    });
    router.replace(pathname, { locale: newLocale });
  };

  const otherLocale: Locale = locale === "fr" ? "en" : "fr";

  return (
    <>
      {/* Floating pill navigation (after scroll) */}
      <nav
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ${
          scrolled
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="card-glass px-2 py-2 flex items-center gap-1">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer ${
                  activeSection === link.id
                    ? "bg-[var(--primary)] text-[var(--background)]"
                    : "text-[var(--secondary)] hover:text-[var(--primary)] hover:bg-[var(--highlight)]"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Language & Social links in pill */}
          <div className="hidden md:flex items-center gap-1 ml-2 pl-2 border-l border-[var(--border-subtle)]">
            <button
              onClick={() => switchLocale(otherLocale)}
              className="p-2 text-[var(--secondary)] hover:text-[var(--primary)] transition-colors rounded-full hover:bg-[var(--highlight)] cursor-pointer text-xs font-medium uppercase"
              title={localeNames[otherLocale]}
            >
              {otherLocale.toUpperCase()}
            </button>
          </div>

          {/* Mobile menu button in pill */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[var(--secondary)] hover:text-[var(--primary)] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Initial navigation (before scroll) */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="container-wide py-10 flex items-center justify-between">
          <div className="font-display text-2xl text-[var(--primary)]">G.</div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-sm text-[var(--secondary)] hover:text-[var(--primary)] transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Language switcher & Mobile menu button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => switchLocale(otherLocale)}
              className="flex items-center gap-1.5 text-[var(--secondary)] hover:text-[var(--primary)] transition-colors cursor-pointer text-sm"
              title={localeNames[otherLocale]}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{otherLocale.toUpperCase()}</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -mr-2 text-[var(--secondary)] hover:text-[var(--primary)] transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-50 bg-[var(--background)] transition-all duration-500 md:hidden ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, index) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="font-display text-4xl text-[var(--primary)] hover:text-[var(--accent-purple)] transition-colors cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {link.label}
            </button>
          ))}

          {/* Language switcher */}
          <button
            onClick={() => {
              switchLocale(otherLocale);
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 text-[var(--secondary)] hover:text-[var(--primary)] transition-colors cursor-pointer mt-4"
          >
            <Globe className="w-5 h-5" />
            <span>{localeNames[otherLocale]}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2 text-[var(--secondary)] hover:text-[var(--primary)] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
    </>
  );
}
