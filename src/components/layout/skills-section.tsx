"use client";

import { Code, Database, Server, Cloud, Shield, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const skillCategories = [
  {
    title: "Frontend Frameworks",
    icon: Code,
    skills: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    title: "Backend Languages",
    icon: Server,
    skills: ["TypeScript", "Rust", "Java", "Go"],
  },
  {
    title: "Databases & Caches",
    icon: Database,
    skills: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Elasticsearch"],
  },
  {
    title: "DevOps & Cloud",
    icon: Cloud,
    skills: ["Docker", "Kubernetes", "AWS", "GitHub Actions"],
  },
  {
    title: "Security & IAM",
    icon: Shield,
    skills: ["OAuth 2.0", "JWT", "ABAC", "RBAC", "Cryptography"],
  },
  {
    title: "Build Tools & Runtime",
    icon: Zap,
    skills: ["Bun", "Node.js", "Vite", "Webpack", "ESBuild"],
  },
];

export function SkillsSection() {
  return (
    <section id="skills" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-3 text-black dark:text-white">
            Technical Skills
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Comprehensive expertise across modern web technologies, system
            architecture, and performance optimization.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {skillCategories.map((category, index) => (
            <Card
              key={index}
              className={`card-shadow card-radius bg-white dark:bg-gray-800 border-0 transition-card hover:shadow-lg animate-fade-in animate-stagger-${
                (index % 6) + 1
              } hover:scale-105`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-300 hover:bg-purple-100 dark:hover:bg-purple-900">
                    <category.icon className="h-4 w-4 text-purple-500" />
                  </div>
                  <CardTitle className="text-base font-medium">
                    {category.title}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <Badge
                      key={skillIndex}
                      variant="secondary"
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
