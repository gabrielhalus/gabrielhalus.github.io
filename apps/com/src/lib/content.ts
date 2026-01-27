import fs from "fs";
import path from "path";

import matter from "gray-matter";

import type { Locale } from "@/i18n/config";

const contentDirectory = path.join(process.cwd(), "src/content");

// Types
export interface Project {
  slug: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  tech: string[];
  features: string[];
  github?: string;
  demo?: string;
  live?: string;
  anonymized?: boolean;
  pinned?: boolean;
  order: number;
}

export interface Testimonial {
  slug: string;
  quote: string;
  author: string;
  company: string;
  role: string;
  order: number;
}

export interface Client {
  slug: string;
  name: string;
  abbreviation: string;
  order: number;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readingTime: string;
  category: string;
  tags: string[];
  pinned?: boolean;
  order: number;
}

// Generic markdown loader
function getMarkdownFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }
  return fs.readdirSync(directory).filter((file) => file.endsWith(".md"));
}

function parseMarkdownFile<T>(filePath: string): T & { slug: string } {
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContents);
  const slug = path.basename(filePath, ".md");

  return {
    slug,
    ...data,
  } as T & { slug: string };
}

function parseMarkdownFileWithContent<T>(
  filePath: string
): T & { slug: string; content: string } {
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const slug = path.basename(filePath, ".md");

  return {
    slug,
    content,
    ...data,
  } as T & { slug: string; content: string };
}

// Projects
export function getProjects(locale: Locale): Project[] {
  const projectsDir = path.join(contentDirectory, "projects", locale);
  const files = getMarkdownFiles(projectsDir);

  const projects = files.map((file) =>
    parseMarkdownFile<Omit<Project, "slug">>(path.join(projectsDir, file))
  );

  return projects.sort((a, b) => {
    // Pinned first, then by order
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return a.order - b.order;
  });
}

// Testimonials
export function getTestimonials(locale: Locale): Testimonial[] {
  const testimonialsDir = path.join(contentDirectory, "testimonials", locale);
  const files = getMarkdownFiles(testimonialsDir);

  const testimonials = files.map((file) =>
    parseMarkdownFile<Omit<Testimonial, "slug">>(
      path.join(testimonialsDir, file)
    )
  );

  return testimonials.sort((a, b) => a.order - b.order);
}

// Clients (not localized)
export function getClients(): Client[] {
  const clientsDir = path.join(contentDirectory, "clients");
  const files = getMarkdownFiles(clientsDir);

  const clients = files.map((file) =>
    parseMarkdownFile<Omit<Client, "slug">>(path.join(clientsDir, file))
  );

  return clients.sort((a, b) => a.order - b.order);
}

// Blog posts
export function getBlogPosts(locale: Locale): BlogPost[] {
  const blogDir = path.join(contentDirectory, "blog", locale);
  const files = getMarkdownFiles(blogDir);

  const posts = files.map((file) =>
    parseMarkdownFileWithContent<Omit<BlogPost, "slug" | "content">>(
      path.join(blogDir, file)
    )
  );

  return posts.sort((a, b) => {
    // Pinned first, then by date (newest first)
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getBlogPost(locale: Locale, slug: string): BlogPost | null {
  const filePath = path.join(contentDirectory, "blog", locale, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return parseMarkdownFileWithContent<Omit<BlogPost, "slug" | "content">>(
    filePath
  );
}
