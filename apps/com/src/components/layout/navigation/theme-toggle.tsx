"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="hover:bg-accent transition-colors"
    >
      {theme === "light"
        ? (
            <Moon className="h-5 w-5" />
          )
        : (
            <Sun className="h-5 w-5" />
          )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
