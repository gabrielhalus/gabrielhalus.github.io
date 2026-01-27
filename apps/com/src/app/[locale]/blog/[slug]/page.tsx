import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
} from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { Locale } from "@/i18n/config";
import { getBlogPost, getBlogPosts } from "@/lib/content";

import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { ShareButton } from "@/components/ui/share-button";

export async function generateStaticParams() {
  const locales = ["en", "fr"] as const;
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const posts = getBlogPosts(locale);
    for (const post of posts) {
      params.push({ locale, slug: post.slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPost(locale, slug);

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blog");
  const post = getBlogPost(locale, slug);

  if (!post) {
    notFound();
  }

  // Get adjacent posts for navigation
  const allPosts = getBlogPosts(locale);
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navigation />

      <main className="pt-40 pb-24">
        {/* Article header */}
        <header className="container-narrow mb-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[var(--secondary)] hover:text-[var(--primary)] transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToBlog")}
          </Link>

          {/* Category */}
          <div className="flex items-center gap-3 mb-6">
            <span className="pill text-sm">{post.category}</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[var(--primary)] leading-tight mb-8">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-[var(--secondary)] leading-relaxed mb-8">
            {post.excerpt}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-4 text-sm text-[var(--secondary)]">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readingTime}
              </span>
            </div>

            {/* Share button */}
            <ShareButton title={post.title} text={post.excerpt} />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-[var(--secondary)] bg-[var(--highlight)] px-3 py-1.5 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Article content */}
        <article className="container-narrow">
          <div className="prose prose-lg max-w-none">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="font-display text-4xl text-[var(--primary)] mt-12 mb-4">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="font-display text-2xl text-[var(--primary)] mt-10 mb-4 line-accent">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-medium text-[var(--primary)] mt-8 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-[var(--primary)] leading-relaxed mb-5 text-base">
                    {children}
                  </p>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-[var(--accent-purple)] hover:underline underline-offset-4"
                    target={href?.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href?.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {children}
                  </a>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-outside ml-5 mb-5 space-y-1.5 text-[var(--primary)]">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-outside ml-5 mb-5 space-y-1.5 text-[var(--primary)]">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed pl-1">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[var(--accent-purple)] pl-5 py-1 my-6 italic text-[var(--secondary)] bg-[var(--highlight)] rounded-r-lg pr-5">
                    {children}
                  </blockquote>
                ),
                code: ({ className, children }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="bg-[var(--highlight)] text-[var(--accent-purple)] px-1.5 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="block bg-[var(--card-background)] p-5 rounded-xl my-5 overflow-x-auto text-sm font-mono border border-[var(--border-subtle)]">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-[var(--card-background)] p-5 rounded-xl my-6 overflow-x-auto border border-[var(--border-subtle)]">
                    {children}
                  </pre>
                ),
                hr: () => <hr className="divider my-10" />,
                img: ({ src, alt }) => (
                  <figure className="my-8">
                    <img
                      src={src}
                      alt={alt}
                      className="w-full rounded-xl shadow-lg"
                    />
                    {alt && (
                      <figcaption className="text-center text-sm text-[var(--secondary)] mt-3">
                        {alt}
                      </figcaption>
                    )}
                  </figure>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6">
                    <table className="w-full border-collapse">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="text-left p-3 bg-[var(--highlight)] border border-[var(--border-subtle)] font-medium text-[var(--primary)]">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="p-3 border border-[var(--border-subtle)] text-[var(--primary)]">
                    {children}
                  </td>
                ),
              }}
            >
              {post.content}
            </Markdown>
          </div>
        </article>

        {/* Post navigation */}
        <div className="container-narrow">
          <nav className="mt-12 pt-8 border-t border-[var(--border-subtle)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prevPost ? (
              <Link href={`/blog/${prevPost.slug}`} className="group">
                <div className="card-flat p-6 h-full hover:bg-[var(--accent-purple)]/5 transition-colors">
                  <span className="text-xs text-[var(--secondary)] flex items-center gap-2 mb-3">
                    <ArrowLeft className="w-3 h-3" />
                    {t("previousArticle")}
                  </span>
                  <p className="font-medium text-[var(--primary)] group-hover:text-[var(--accent-purple)] transition-colors line-clamp-2">
                    {prevPost.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextPost && (
              <Link href={`/blog/${nextPost.slug}`} className="group">
                <div className="card-flat p-6 h-full hover:bg-[var(--accent-purple)]/5 transition-colors text-right">
                  <span className="text-xs text-[var(--secondary)] flex items-center justify-end gap-2 mb-3">
                    {t("nextArticle")}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                  <p className="font-medium text-[var(--primary)] group-hover:text-[var(--accent-purple)] transition-colors line-clamp-2">
                    {nextPost.title}
                  </p>
                </div>
              </Link>
            )}
            </div>
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  );
}
