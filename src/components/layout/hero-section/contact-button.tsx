"use client";

import { Button } from "@/components/ui/button";

export function ContactButton() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        document
          .getElementById("contact")
          ?.scrollIntoView({ behavior: "smooth" })
      }
      className="border-gray-300 dark:border-gray-600 button-radius px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg">
      Get In Touch
    </Button>
  );
}
