import { ArrowLeft, Calendar, Clock, Pin, Search } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { getBlogPosts } from "@/lib/content";

import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blog");
  const posts = getBlogPosts(locale);

  const pinnedPosts = posts.filter((p) => p.pinned);
  const regularPosts = posts.filter((p) => !p.pinned);

  // Get unique categories
  const categories = [...new Set(posts.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navigation />

      <main className="pt-40 pb-24">
        {/* Hero header */}
        <div className="container-wide mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--secondary)] hover:text-[var(--primary)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backHome")}
          </Link>

          <div className="max-w-3xl">
            <span className="overline mb-4 block">{t("overline")}</span>
            <h1 className="text-[var(--primary)] mb-6">{t("pageTitle")}</h1>
            <p className="text-xl text-[var(--secondary)] leading-relaxed">
              {t("pageDescription")}
            </p>
          </div>

          {/* Categories filter */}
          <div className="flex flex-wrap gap-3 mt-10">
            <span className="pill pill-accent text-sm cursor-pointer">
              {t("allPosts")}
            </span>
            {categories.map((category) => (
              <span
                key={category}
                className="pill text-sm cursor-pointer hover:bg-[var(--accent-purple)]/10 hover:text-[var(--accent-purple)] hover:border-[var(--accent-purple)]/20 transition-colors"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Pinned posts section */}
        {pinnedPosts.length > 0 && (
          <section className="container-wide mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Pin className="w-5 h-5 text-[var(--accent-purple)]" />
              <h2 className="text-2xl font-display text-[var(--primary)]">
                {t("pinnedArticles")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pinnedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <article className="h-full card-elevated p-8 transition-all duration-300 hover:shadow-[var(--shadow-glow)] relative overflow-hidden">
                    {/* Decorative gradient */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[var(--accent-purple)]/10 to-transparent" />

                    <div className="relative z-10">
                      {/* Category */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="pill pill-accent text-xs">
                          <Pin className="w-3 h-3" />
                          {t("pinned")}
                        </span>
                        <span className="text-xs text-[var(--secondary)] uppercase tracking-wider">
                          {post.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-2xl text-[var(--primary)] mb-3 group-hover:text-[var(--accent-purple)] transition-colors duration-300">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-[var(--secondary)] leading-relaxed line-clamp-3 mb-6">
                        {post.excerpt}
                      </p>

                      {/* Meta & tags */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-[var(--secondary)]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(post.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {post.readingTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All posts grid */}
        <section className="container-wide">
          <h2 className="text-2xl font-display text-[var(--primary)] mb-8">
            {pinnedPosts.length > 0 ? t("latestArticles") : t("allArticles")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <article
                  className="h-full card-elevated p-6 transition-all duration-300 hover:shadow-[var(--shadow-lg)] animate-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Category */}
                  <span className="text-xs text-[var(--secondary)] font-medium uppercase tracking-wider mb-3 block">
                    {post.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg font-medium text-[var(--primary)] mb-2 group-hover:text-[var(--accent-purple)] transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-[var(--secondary)] line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-[var(--secondary)] bg-[var(--highlight)] px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-[var(--secondary)] pt-4 border-t border-[var(--border-subtle)]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readingTime}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Empty state */}
          {posts.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-[var(--highlight)] flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-[var(--secondary)]" />
              </div>
              <h3 className="text-xl font-medium text-[var(--primary)] mb-2">
                {t("noPosts")}
              </h3>
              <p className="text-[var(--secondary)]">{t("noPostsDescription")}</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
