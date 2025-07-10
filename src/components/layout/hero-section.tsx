import { Code, Server, Zap } from "lucide-react";
import { ContactButton } from "./hero-section/contact-button";
import { ProjectsButton } from "./hero-section/projects-button";
import { Roles } from "./hero-section/roles";

export function HeroSection() {
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
              <Roles />
            </span>
          </div>

          <p className="text-base text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed animate-slide-up animate-stagger-2">
            Fullstack developer crafting performant and reliable software with
            expertise in TypeScript, React, Node.js, and Rust.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8 animate-slide-up animate-stagger-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg transition-card hover:shadow-lg hover:scale-105">
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
            <ProjectsButton />
            <ContactButton />
          </div>
        </div>
      </div>
    </section>
  );
}
