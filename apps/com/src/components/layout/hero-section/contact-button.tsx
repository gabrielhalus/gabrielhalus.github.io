"use client";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/umami";

export function ContactButton() {
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
    <Button
      variant="outline"
      onClick={handleClick}
      className="border-gray-300 dark:border-gray-600 button-radius px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg"
    >
      Get In Touch
    </Button>
  );
}
