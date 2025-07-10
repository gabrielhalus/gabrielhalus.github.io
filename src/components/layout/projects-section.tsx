"use client";

import { cn } from "@/lib/utils";
import { OtherString, Prettify } from "@/types/utils";
import { Github, Globe, Newspaper, ShoppingBag } from "lucide-react";
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
    category: "Fullstack" | "Backend" | "Frontend" | OtherString;
    features: (
      | "Authentication"
      | "OAuth 2.0"
      | "ABAC"
      | "RBAC"
      | "CRUD operations"
      | "Analytics"
      | OtherString
    )[];
    anonymized: boolean;
  } & ({ demo?: string; live?: never } | { live?: string; demo?: never })
>;

const projects: Project[] = [
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
    anonymized: false,
  },
  {
    title: "Let’s Go Lego",
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
    anonymized: false,
  },
];

export function ProjectsSection() {
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

        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 max-w-6xl mx-auto space-y-4 [column-fill:_balance]">
          {projects.map((project, index) => (
            <Card
              key={index}
              className={`card-shadow card-radius bg-white dark:bg-gray-800 border-0 transition-card hover:shadow-lg cursor-pointer animate-slide-up animate-stagger-${
                index + 1
              } hover:scale-105 break-inside-avoid mb-4`}>
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-lg transition-all duration-300 ${
                        project.anonymized
                          ? "bg-purple-100 dark:bg-purple-900"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}>
                      <project.icon
                        className={`h-6 w-6 ${
                          project.anonymized
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
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}>
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
                        className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <div
                          className={`w-1 h-1 rounded-full ${
                            project.anonymized
                              ? "bg-purple-400"
                              : "bg-purple-500"
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
                        }`}>
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
                        }`}>
                        +{project.tech.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Demo and Live Links */}
                {!project.anonymized && (
                  <div className="flex gap-2 pt-2">
                    {project.github && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex-1 text-xs button-radius border-gray-200 dark:border-gray-600 transition-all duration-300 hover:scale-105">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer">
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
                        )}>
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer">
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
                        )}>
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer">
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
                    <strong>Note:</strong> Project details have been anonymized
                    due to confidentiality agreements. Technical implementation
                    and results remain accurate.
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
