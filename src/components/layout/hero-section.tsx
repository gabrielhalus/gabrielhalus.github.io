"use client";

import { Code, Server, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export function HeroSection() {
  const roles = ["Fullstack Developer", "System Architech", "OSS Enthusiast"];

  const [currentRole, setCurrentRole] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [roles.length]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center relative pt-16 pb-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <h1 className="text-6xl font-bold mb-4 text-black dark:text-white animate-slide-up">
            Gabriel Halus
          </h1>

          <div className="h-8 mb-6 flex items-center justify-center animate-slide-up animate-stagger-1">
            <span className="text-lg text-gray-600 dark:text-gray-400 transition-all duration-500">
              {roles[currentRole]}
            </span>
          </div>

          <p className="text-base text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed animate-slide-up animate-stagger-2">
            Fullstack developer crafting performant and reliable software with
            expertise in TypeScript, React, Node.js, and Rust.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8 animate-slide-up animate-stagger-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg transition-card hover:shadow-lg">
              <Code className="w-4 h-4 text-purple-500" />
              <span className="text-sm">Frontend & Backend</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg transition-card hover:shadow-lg hover:scale-105">
              <Server className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Systems Architecture</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg transition-card hover:shadow-lg hover:scale-105">
              <Zap className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Performance Optimization</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up animate-stagger-4">
            <Button
              onClick={() => scrollTo("projects")}
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 button-radius px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              View My Work
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollTo("contact")}
              className="border-gray-300 dark:border-gray-600 button-radius px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Get In Touch
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
