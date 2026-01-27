"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { trackEvent } from "@/lib/umami";

export function ProjectsButton() {
  const t = useTranslations("hero");

  const handleClick = () => {
    trackEvent("button_click", {
      button: "projects",
      location: "hero_section",
    });
    document
      .getElementById("projects")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      className="group btn-primary inline-flex items-center gap-3 cursor-pointer"
    >
      {t("viewWork")}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}
