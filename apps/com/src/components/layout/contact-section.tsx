"use client";

import { ArrowUpRight, Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { trackEvent } from "@/lib/umami";

export function ContactSection() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="section-padding bg-[var(--background-secondary)]">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Text */}
          <div>
            <span className="overline mb-4 block">{t("overline")}</span>
            <h2 className="text-[var(--primary)] mb-6">
              {t("title")}<br />
              <span className="italic text-[var(--secondary)]">{t("titleHighlight")}</span>
            </h2>
            <p className="text-[var(--secondary)] text-lg max-w-md mb-8">
              {t("description")}
            </p>

            {/* Social links */}
            <div className="flex gap-4">
              <a
                href="https://github.com/gabrielhalus"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("external_link_click", {
                    link: "github",
                    location: "contact_section",
                  })
                }
                className="group flex items-center gap-2 btn-ghost"
              >
                <Github className="w-4 h-4" />
                GitHub
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="https://linkedin.com/in/gabrielhalus"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("external_link_click", {
                    link: "linkedin",
                    location: "contact_section",
                  })
                }
                className="group flex items-center gap-2 btn-ghost"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          {/* Right side - Contact cards */}
          <div className="space-y-4">
            {/* Email card */}
            <a
              href="mailto:gabrielhalus@gmail.com"
              onClick={() =>
                trackEvent("contact_click", {
                  method: "email",
                  location: "contact_section",
                })
              }
              className="group block card-elevated p-6 hover-glow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-[var(--accent-purple)]/10 group-hover:bg-[var(--accent-purple)]/20 transition-colors">
                    <Mail className="w-6 h-6 text-[var(--accent-purple)]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--primary)] mb-1">{t("email")}</h3>
                    <p className="text-[var(--secondary)] text-sm">gabrielhalus@gmail.com</p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-[var(--secondary)] group-hover:text-[var(--primary)] transition-colors" />
              </div>
            </a>

            {/* WhatsApp card */}
            <a
              href="https://wa.me/789038887?text=Hello%20Gabriel,%20I%20would%20like%20to%20discuss%20a%20project%20with%20you."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("contact_click", {
                  method: "whatsapp",
                  location: "contact_section",
                })
              }
              className="group block card-elevated p-6 hover-glow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-[var(--accent-purple)]/10 group-hover:bg-[var(--accent-purple)]/20 transition-colors">
                    <MessageCircle className="w-6 h-6 text-[var(--accent-purple)]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--primary)] mb-1">{t("quickChat")}</h3>
                    <p className="text-[var(--secondary)] text-sm">{t("available")}</p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-[var(--secondary)] group-hover:text-[var(--primary)] transition-colors" />
              </div>
            </a>

            {/* Response time note */}
            <p className="text-xs text-[var(--secondary)] text-center pt-4">
              {t("responseTime")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
