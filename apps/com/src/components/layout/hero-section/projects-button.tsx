"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/umami";

export function ProjectsButton() {
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
    <Button
      onClick={handleClick}
      className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 button-radius px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg"
    >
      View My Work
    </Button>
  );
}
