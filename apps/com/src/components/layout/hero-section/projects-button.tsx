"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export function ProjectsButton() {
  return (
    <Button
      onClick={() =>
        document
          .getElementById("projects")
          ?.scrollIntoView({ behavior: "smooth" })
      }
      className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 button-radius px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg">
      View My Work
    </Button>
  );
}
