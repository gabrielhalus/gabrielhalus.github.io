"use client";

import { useTranslations } from "next-intl";

import { trackEvent } from "@/lib/umami";

export function ContactButton() {
  const t = useTranslations("hero");

  const handleClick = () => {
    trackEvent("button_click", {
      button: "contact",
      location: "hero_section",
    });
    document
      .getElementById("contact")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      className="btn-ghost cursor-pointer"
    >
      {t("getInTouch")}
    </button>
  );
}
