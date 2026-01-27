"use client";

import { Cloud, Code, Database, Server, Shield, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

const skillCategories = [
  {
    title: "Frontend",
    icon: Code,
    skills: ["React", "Next.js", "Tailwind CSS", "Three.js"],
    featured: true,
  },
  {
    title: "Backend",
    icon: Server,
    skills: ["TypeScript", "Rust", "Java", "Go"],
    featured: true,
  },
  {
    title: "Databases",
    icon: Database,
    skills: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Elasticsearch"],
    featured: false,
  },
  {
    title: "DevOps",
    icon: Cloud,
    skills: ["Docker", "GitHub Actions", "AWS"],
    featured: false,
  },
  {
    title: "Security",
    icon: Shield,
    skills: ["OAuth 2.0", "JWT", "ABAC", "RBAC", "Cryptography"],
    featured: false,
  },
  {
    title: "Tooling",
    icon: Zap,
    skills: ["Bun", "Node.js", "Vite", "Webpack", "ESBuild", "Turborepo"],
    featured: false,
  },
];

export function SkillsSection() {
  const t = useTranslations("skills");

  return (
    <section id="skills" className="section-padding bg-[var(--background-secondary)]">
      <div className="container-wide">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="overline mb-4 block">{t("overline")}</span>
            <h2 className="text-[var(--primary)]">{t("title")}</h2>
          </div>
          <p className="text-[var(--secondary)] max-w-md text-lg">
            {t("description")}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {skillCategories.map((category, index) => {
            const isLarge = category.featured;
            const gridClass = isLarge
              ? "lg:col-span-2 lg:row-span-2"
              : "";

            return (
              <div
                key={category.title}
                className={`${gridClass} p-6 group rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--card-background)]/50 backdrop-blur-sm hover:bg-[var(--card-background)] hover:border-[var(--accent-purple)]/20 hover:shadow-[var(--shadow-md)] transition-all duration-300 min-h-[160px]`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Content */}
                <div className="h-full flex flex-col">
                  {/* Icon and title */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-[var(--highlight)] group-hover:bg-[var(--accent-purple)]/10 transition-colors">
                      <category.icon className="w-5 h-5 text-[var(--secondary)] group-hover:text-[var(--accent-purple)] transition-colors" />
                    </div>
                    <h3 className={`font-medium text-[var(--primary)] ${isLarge ? "text-xl" : "text-lg"}`}>
                      {category.title}
                    </h3>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className={`text-[var(--secondary)] bg-[var(--highlight)]/80 group-hover:bg-[var(--highlight)] px-3 py-1.5 rounded-lg transition-colors ${
                          isLarge ? "text-sm" : "text-xs"
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[var(--secondary)]">
            {t("learning")}{" "}
            <span className="text-[var(--accent-purple)] font-medium">{t("webassembly")}</span> {t("and")}{" "}
            <span className="text-[var(--accent-purple)] font-medium">{t("edge")}</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
