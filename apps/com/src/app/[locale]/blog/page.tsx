import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { getBlogPosts } from "@/lib/content";

import { BlogContent } from "@/components/layout/blog-content";
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

        </div>

        {/* Blog Content with Tag Filters */}
        <div className="container-wide">
          <BlogContent
            posts={posts}
            pinnedPosts={pinnedPosts}
            regularPosts={regularPosts}
            translations={{
              allTags: t("allTags"),
              showingPosts: t("showingPosts"),
              pinnedArticles: t("pinnedArticles"),
              pinned: t("pinned"),
              latestArticles: t("latestArticles"),
              allArticles: t("allArticles"),
              noPosts: t("noPosts"),
              noPostsDescription: t("noPostsDescription"),
            }}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
