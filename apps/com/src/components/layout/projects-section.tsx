"use client";

import {
  Github,
  Globe,
  Newspaper,
  Package,
  Pin,
  Server,
  ShoppingBag,
} from "lucide-react";

import type { OtherString, Prettify } from "@/types/utils";

import { trackEvent } from "@/lib/umami";
import { cn } from "@/lib/utils";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type Project = Prettify<
  {
    title: string;
    description: string;
    tech: string[];
    icon: React.ElementType;
    github?: string;
    category: "Fullstack" | "Backend" | "Frontend" | "CLI Tool" | OtherString;
    features: (
      | "Authentication"
      | "OAuth 2.0"
      | "ABAC"
      | "RBAC"
      | "CRUD operations"
      | "Analytics"
      | OtherString
    )[];
    anonymized?: boolean;
    pinned?: true;
  } & ({ demo?: string; live?: never } | { live?: string; demo?: never })
>;

const projects: Project[] = [
  {
    title: "EARL La Drevenne – Farm & Product Showcase",
    description:
    "Showcase site for EARL La Drevenne, a family-run farm in Saint-Gervais (Isère) specializing in raised pork and porcelets. The platform highlights product offerings, facilitates customer engagement, and provides secure access with analytics for real usage insights.",
    tech: ["React", "Supabase", "Turborepo", "Umami"],
    icon: ShoppingBag,
    category: "Fullstack",
    features: [
      "Pricing management",
      "Privacy-focused analytics",
      "Responsive, accessible UI",
    ],
    live: "https://www.drevenne.com",
    pinned: true,
  },
  {
    title: "Digital goods marketplace",
    description:
      "Developed a real-time e-commerce platform for digital goods with <10min delivery SLAs, account verification, and fraud prevention. Designed for high traffic and rapid fulfillment workflows.",
    tech: ["TypeScript", "Next.js", "MongoDB", "Prisma", "Stripe"],
    icon: ShoppingBag,
    category: "Fullstack",
    features: [
      "Authentication",
      "OAuth 2.0",
      "Stripe Integration",
      "RBAC",
      "Fraud Protection",
    ],
    anonymized: true,
    pinned: true,
  },
  {
    title: "Trackr",
    description:
      "A CLI tool for synchronizing and merging modular CodeIgniter + Vue projects. Designed for development and build workflows, Trackr syncs files from multiple repositories into a unified workspace during development, and generates a merged output folder ready to run with Vite (frontend) and CodeIgniter (backend).",
    tech: ["Rust", "Clap", "Notify", "Tokio", "Reqwest", "Vite", "CodeIgniter"],
    icon: Package,
    category: "CLI Tool",
    features: ["CLI", "GitLab API"],
    pinned: true,
  },
  {
    title: "Let's Go Lego",
    description:
      "Built a real-time auction platform for Lego sets, allowing users to list items, place bids, and explore unique collections. Developed as part of a collaborative school project with full WebSocket-based bidding support.",
    tech: ["React", "Node.js", "MongoDB", "Express"],
    icon: ShoppingBag,
    github: "https://github.com/BerriatMagasin/letsgo-lego",
    category: "Fullstack",
    features: [
      "Authentication",
      "Real-time Bidding",
      "WebSocket",
      "RBAC",
      "Concurrency Control",
    ],
  },
  {
    title: "Headless CMS",
    description:
      "Developed a headless CMS API, allowing users to create, manage, and publish content without the need for a traditional frontend. It supports various content types, including pages, blog posts, and media assets, and provides a flexible API for integration with other applications.",
    tech: ["TypeScript", "Express", "MongoDB", "Mongoose"],
    icon: Server,
    github: "https://github.com/gabrielhalus/headless-octopus",
    category: "Backend",
    features: ["Headless CMS", "Content Management", "API"],
  },
  {
    title: "Paperlive",
    description:
      "Designed and implemented a dashboard for PhD students to manage research papers and citations. Built during an internship at Université Grenoble Alpes.",
    tech: ["MongoDB", "Express", "React", "Node.js"],
    icon: Newspaper,
    github: "https://github.com/teovlt/paperlive",
    demo: "https://paperlive.vercel.app/",
    category: "Fullstack",
    features: ["Authentication", "Analytics", "RBAC", "Document Management"],
  },
] as const;

export function ProjectsSection() {
  // Sort projects: pinned first, then maintain original order within each group
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.pinned && !b.pinned)
      return -1;
    if (!a.pinned && b.pinned)
      return 1;
    return 0; // Maintain original order within pinned/unpinned groups
  });

  // Helper function to split projects into N columns for row-by-row distribution
  const splitIntoColumns = (
    projects: typeof sortedProjects,
    numColumns: number,
  ) => {
    const columns: (typeof sortedProjects)[] = Array.from(
      { length: numColumns },
      () => [],
    );

    projects.forEach((project, index) => {
      const columnIndex = index % numColumns;
      columns[columnIndex].push(project);
    });

    return columns;
  };

  // Create column distributions for different breakpoints
  const mobileColumns = splitIntoColumns(sortedProjects, 1);
  const tabletColumns = splitIntoColumns(sortedProjects, 2);
  const desktopColumns = splitIntoColumns(sortedProjects, 3);

  // Render project card
  const renderProjectCard = (
    project: (typeof sortedProjects)[0],
    index: number,
  ) => (
    <Card
      key={`${project.title}-${index}`}
      className={`card-shadow card-radius bg-white dark:bg-gray-800 border-0 transition-card hover:shadow-lg cursor-pointer animate-slide-up animate-stagger-${
        index + 1
      } hover:scale-105 ${
        project.pinned ? "ring-2 ring-purple-500/20" : ""
      } mb-6`}
    >
      <CardHeader>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-lg transition-all duration-300 ${
                project.anonymized
                  ? "bg-purple-100 dark:bg-purple-900"
                  : project.pinned
                    ? "bg-purple-100 dark:bg-purple-900"
                    : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              <project.icon
                className={`h-6 w-6 ${
                  project.anonymized
                    ? "text-purple-600 dark:text-purple-400"
                    : project.pinned
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-purple-500"
                }`}
              />
            </div>
            <div>
              <CardTitle className="text-lg font-medium text-black dark:text-white">
                {project.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className={`text-xs border-0 transition-all duration-300 ${
                    project.anonymized
                      ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                      : project.pinned
                        ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {project.pinned && (
                    <Pin className="h-3 w-3 text-purple-500 fill-current" />
                  )}
                  {project.category}
                </Badge>
                {project.anonymized && (
                  <Badge className="text-xs bg-purple-500 text-white border-0">
                    Anonymized
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <CardDescription className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Key Features */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
            Key Features
          </h4>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {project.features.map((feature, featureIndex) => (
              <div
                key={featureIndex}
                className="flex items-center gap-1 text-gray-600 dark:text-gray-400"
              >
                <div
                  className={`w-1 h-1 rounded-full ${
                    project.anonymized ? "bg-purple-400" : "bg-purple-500"
                  }`}
                />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
            Tech Stack
          </h4>
          <div className="flex flex-wrap gap-1">
            {project.tech.slice(0, 4).map((tech, techIndex) => (
              <Badge
                key={techIndex}
                variant="secondary"
                className={`text-xs border-0 transition-all duration-300 ${
                  project.anonymized
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {tech}
              </Badge>
            ))}
            {project.tech.length > 4 && (
              <Badge
                variant="secondary"
                className={`text-xs border-0 ${
                  project.anonymized
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                +
                {project.tech.length - 4}
              </Badge>
            )}
          </div>
        </div>

        {/* Demo and Live Links */}
        {!project.anonymized
          && (project.github || project.demo || project.live) && (
          <div className="flex gap-2 pt-2">
            {project.github && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex-1 text-xs button-radius border-gray-200 dark:border-gray-600 transition-all duration-300 hover:scale-105"
              >
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("project_link_click", {
                      project: project.title,
                      link_type: "github",
                      location: "projects_section",
                    })}
                >
                  <Github className="h-3 w-3 mr-1" />
                  Code
                </a>
              </Button>
            )}
            {project.demo && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className={cn(
                  "text-xs button-radius transition-all duration-300 hover:scale-105",
                  project.github ? "flex-1" : "flex-1",
                  "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 hover:dark:text-black",
                )}
              >
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("project_link_click", {
                      project: project.title,
                      link_type: "demo",
                      location: "projects_section",
                    })}
                >
                  <Globe className="h-3 w-3 mr-1" />
                  Demo
                </a>
              </Button>
            )}
            {project.live && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className={cn(
                  "text-xs button-radius transition-all duration-300 hover:scale-105",
                  project.github ? "flex-1" : "flex-1",
                  "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 hover:dark:text-black",
                )}
              >
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("project_link_click", {
                      project: project.title,
                      link_type: "live",
                      location: "projects_section",
                    })}
                >
                  <Globe className="h-3 w-3 mr-1" />
                  Live
                </a>
              </Button>
            )}
          </div>
        )}

        {/* Anonymization Notice */}
        {project.anonymized && (
          <div className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 p-2 rounded-lg">
            <strong>Note:</strong>
            {" "}
            Project details have been anonymized due to
            confidentiality agreements. Technical implementation and results
            remain accurate.
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <section id="projects" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-3 text-black dark:text-white">
            Featured Projects
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            A selection of my recent work showcasing expertise in full-stack
            development, system architecture, and performance optimization.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Mobile: 1 column */}
          <div className="block md:hidden">
            <div className="flex flex-col gap-6">
              {mobileColumns[0].map((project, index) =>
                renderProjectCard(project, index),
              )}
            </div>
          </div>

          {/* Tablet: 2 columns */}
          <div className="hidden md:block lg:hidden">
            <div className="grid grid-cols-2 gap-6">
              {tabletColumns.map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col">
                  {column.map((project, projectIndex) =>
                    renderProjectCard(project, columnIndex * 2 + projectIndex),
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: 3 columns */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-3 gap-6">
              {desktopColumns.map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col">
                  {column.map((project, projectIndex) =>
                    renderProjectCard(project, columnIndex * 3 + projectIndex),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
