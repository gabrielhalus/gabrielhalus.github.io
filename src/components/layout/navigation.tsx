"use client";

import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";
import { useEffect, useState } from "react";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 animate-slide-up ${
        scrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
          : "bg-transparent"
      }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-black dark:text-white transition-all duration-300 hover:scale-110">
            Gabriel
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection("home")}
              className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300 hover:scale-110">
              Home
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300 hover:scale-110">
              Projects
            </button>
            <button
              onClick={() => scrollToSection("skills")}
              className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300 hover:scale-110">
              Skills
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300 hover:scale-110">
              Contact
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 transition-all duration-300 hover:scale-110"
              asChild>
              <a
                href="https://github.com/gabrielhalus"
                target="_blank"
                rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 transition-all duration-300 hover:scale-110"
              asChild>
              <a
                href="https://linkedin.com/in/gabrielhalus"
                target="_blank"
                rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
