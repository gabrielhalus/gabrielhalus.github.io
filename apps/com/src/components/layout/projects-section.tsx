"use client";

import {
  ArrowUpRight,
  Github,
  Globe,
  Newspaper,
  Package,
  Pin,
  Server,
  ShoppingBag,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Project } from "@/lib/content";

import { trackEvent } from "@/lib/umami";

const iconMap: Record<string, React.ElementType> = {
  "shopping-bag": ShoppingBag,
  package: Package,
  server: Server,
  newspaper: Newspaper,
  globe: Globe,
};

type ProjectsSectionProps = {
  projects: Project[];
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const t = useTranslations("projects");

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Kinetic scrolling
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animationRef = useRef<number | undefined>(undefined);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current)
      return;

    // Cancel any ongoing momentum
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);

    lastXRef.current = e.pageX;
    lastTimeRef.current = Date.now();
    velocityRef.current = 0;
  };

  const handleMouseUp = useCallback(() => {
    if (!isDragging)
      return;
    setIsDragging(false);

    // Start momentum scrolling
    const momentum = () => {
      if (!scrollRef.current)
        return;

      // Apply friction
      velocityRef.current *= 0.95;

      // Stop when velocity is very low
      if (Math.abs(velocityRef.current) < 0.5) {
        velocityRef.current = 0;
        return;
      }

      scrollRef.current.scrollLeft -= velocityRef.current;
      animationRef.current = requestAnimationFrame(momentum);
    };

    if (Math.abs(velocityRef.current) > 1) {
      animationRef.current = requestAnimationFrame(momentum);
    }
  }, [isDragging]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current)
      return;
    e.preventDefault();

    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    scrollRef.current.scrollLeft = scrollLeft - walk;

    // Calculate velocity for momentum
    const now = Date.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      velocityRef.current = (e.pageX - lastXRef.current) / dt * 15;
    }
    lastXRef.current = e.pageX;
    lastTimeRef.current = now;
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <section id="projects" className="section-padding">
      {/* Section header */}
      <div className="container-wide mb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="overline mb-4 block">{t("overline")}</span>
            <h2 className="text-[var(--primary)]">{t("title")}</h2>
          </div>
          <p className="text-[var(--secondary)] max-w-md text-lg">
            {t("description")}
          </p>
        </div>
      </div>

      {/* Horizontal scroll projects with drag */}
      <div className="relative">
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`flex gap-6 overflow-x-auto pb-4 pt-8 px-[max(24px,calc((100vw-1400px)/2+24px))] scrollbar-hide ${
            isDragging ? "cursor-grabbing select-none" : "cursor-grab"
          }`}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {projects.map((project, index) => {
            const IconComponent = iconMap[project.icon] || Package;

            return (
              <article
                key={project.slug}
                className={`group relative w-[380px] md:w-[440px] flex-shrink-0 card-elevated p-6 transition-all duration-300 hover:shadow-[var(--shadow-glow)] ${
                  project.pinned ? "ring-1 ring-[var(--accent-purple)]/20" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Pinned indicator */}
                {project.pinned && (
                  <div className="absolute -top-3 left-6 pill pill-accent text-xs">
                    <Pin className="w-3 h-3" />
                    {t("featured")}
                  </div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between mb-4 mt-2">
                  <div className={`p-3 rounded-2xl transition-colors ${
                    project.pinned || project.anonymized
                      ? "bg-[var(--accent-purple)]/10"
                      : "bg-[var(--highlight)]"
                  }`}
                  >
                    <IconComponent className={`w-6 h-6 ${
                      project.pinned || project.anonymized
                        ? "text-[var(--accent-purple)]"
                        : "text-[var(--primary)]"
                    }`}
                    />
                  </div>
                  <span className="text-xs text-[var(--secondary)] font-medium uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-medium text-[var(--primary)] mb-3 line-accent">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-[var(--secondary)] text-sm leading-relaxed mb-6 line-clamp-3">
                  {project.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.features.slice(0, 3).map((feature) => (
                    <span key={feature} className="pill text-xs">
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1 mb-6">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs text-[var(--secondary)] bg-[var(--highlight)] px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                {!project.anonymized && (project.github || project.demo || project.live) && (
                  <div className="flex gap-3 mt-auto pt-4 border-t border-[var(--border-subtle)]">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackEvent("project_link_click", {
                            project: project.title,
                            link_type: "github",
                          })}
                        className="flex items-center gap-2 text-sm text-[var(--secondary)] hover:text-[var(--primary)] transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        {t("code")}
                      </a>
                    )}
                    {(project.demo || project.live) && (
                      <a
                        href={project.demo || project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackEvent("project_link_click", {
                            project: project.title,
                            link_type: project.demo ? "demo" : "live",
                          })}
                        className="flex items-center gap-2 text-sm text-[var(--primary)] font-medium group/link"
                      >
                        <Globe className="w-4 h-4" />
                        {project.live ? t("visit") : t("demo")}
                        <ArrowUpRight className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </a>
                    )}
                  </div>
                )}

                {/* Anonymized notice */}
                {project.anonymized && (
                  <div className="mt-auto pt-4 border-t border-[var(--border-subtle)]">
                    <p className="text-xs text-[var(--accent-purple)]">
                      {t("anonymizedNotice")}
                    </p>
                  </div>
                )}
              </article>
            );
          })}

          {/* End spacer */}
          <div className="w-6 flex-shrink-0" />
        </div>

        {/* Gradient fades */}
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[var(--background)] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[var(--background)] to-transparent pointer-events-none" />
      </div>

      {/* Scroll hint */}
      <div className="container-wide mt-8">
        <p className="text-xs text-[var(--secondary)] text-center md:text-left">
          {t("scrollHint")}
        </p>
      </div>
    </section>
  );
}
