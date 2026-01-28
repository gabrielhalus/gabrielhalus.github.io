"use client";

import { ArrowRight, Calendar, Clock, Pin, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

import type { BlogPost } from "@/lib/content";

import { trackEvent } from "@/lib/umami";

type BlogSectionProps = {
  posts: BlogPost[];
};

export function BlogSection({ posts }: BlogSectionProps) {
  const t = useTranslations("blog");

  const pinnedPosts = posts.filter(p => p.pinned).slice(0, 2);
  const recentPosts = posts.filter(p => !p.pinned).slice(0, 2);
  const displayPosts = [...pinnedPosts, ...recentPosts].slice(0, 4);

  if (displayPosts.length === 0)
    return null;

  const featuredPost = displayPosts[0];
  const otherPosts = displayPosts.slice(1);

  return (
    <section id="blog" className="section-padding relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[var(--accent-purple)]/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--accent-purple)]/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="container-wide relative">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="overline mb-4 block">{t("overline")}</span>
            <h2 className="text-[var(--primary)]">{t("title")}</h2>
          </div>
          <Link
            href="/blog"
            onClick={() => trackEvent("blog_view_all_click")}
            className="group inline-flex items-center gap-2 text-[var(--secondary)] hover:text-[var(--primary)] transition-colors"
          >
            <span className="text-sm font-medium">{t("viewAll")}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Blog grid - editorial asymmetric layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Featured post - large card */}
          <article className="lg:col-span-7 group relative">
            <Link
              href={`/blog/${featuredPost.slug}`}
              onClick={() =>
                trackEvent("blog_post_click", {
                  post: featuredPost.title,
                  featured: true,
                })}
              className="block h-full"
            >
              <div className="relative h-full min-h-[400px] lg:min-h-[520px] card-elevated overflow-hidden transition-all duration-500 hover:shadow-[var(--shadow-glow)] flex flex-col">
                {/* Hero Image */}
                {featuredPost.image && (
                  <div className="relative h-48 lg:h-56 overflow-hidden w-full">
                    <Image
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                  </div>
                )}

                <div className="p-8 lg:p-10 flex flex-col flex-1 relative">
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--accent-purple)]/10 to-transparent" />

                  {/* Category & pinned badge */}
                  <div className="flex items-center gap-3 mb-auto">
                    {featuredPost.pinned && (
                      <span className="pill pill-accent text-xs">
                        <Pin className="w-3 h-3" />
                        {t("pinned")}
                      </span>
                    )}
                    <span className="pill text-xs">{featuredPost.category}</span>
                  </div>

                  {/* Content */}
                  <div className="mt-auto">
                    {/* Meta */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-[var(--secondary)]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(featuredPost.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {featuredPost.readingTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-3xl lg:text-4xl text-[var(--primary)] mb-4 leading-tight group-hover:text-[var(--accent-purple)] transition-colors duration-300">
                      {featuredPost.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-[var(--secondary)] text-base leading-relaxed line-clamp-3 mb-6">
                      {featuredPost.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {featuredPost.tags.slice(0, 4).map(tag => (
                        <span
                          key={tag}
                          className="text-xs text-[var(--secondary)] bg-[var(--highlight)] px-2.5 py-1 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Read indicator */}
                  <div className="absolute bottom-8 right-8 lg:bottom-10 lg:right-10 w-12 h-12 rounded-full bg-[var(--highlight)] flex items-center justify-center group-hover:bg-[var(--accent-purple)] group-hover:scale-110 transition-all duration-300">
                    <ArrowRight className="w-5 h-5 text-[var(--primary)] group-hover:text-white transition-colors -rotate-45" />
                  </div>
                </div>
              </div>
            </Link>
          </article>

          {/* Other posts - stacked cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {otherPosts.map((post, index) => (
              <article key={post.slug} className="group flex-1">
                <Link
                  href={`/blog/${post.slug}`}
                  onClick={() =>
                    trackEvent("blog_post_click", {
                      post: post.title,
                      featured: false,
                    })}
                  className="block h-full"
                >
                  <div
                    className="h-full card-elevated flex flex-col transition-all duration-300 hover:shadow-[var(--shadow-glow)] relative overflow-hidden"
                    style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                  >
                    {/* Subtle gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-purple)]/0 to-[var(--accent-purple)]/0 group-hover:from-[var(--accent-purple)]/[0.02] group-hover:to-transparent transition-all duration-500" />

                    {/* Thumbnail Image */}
                    {post.image && (
                      <div className="relative h-32 overflow-hidden w-full">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    <div className="relative z-10 p-6 flex flex-col flex-1">
                      {/* Category & pinned */}
                      <div className="flex items-center gap-2 mb-3">
                        {post.pinned && (
                          <Pin className="w-3 h-3 text-[var(--accent-purple)]" />
                        )}
                        <span className="text-xs text-[var(--secondary)] font-medium uppercase tracking-wider">
                          {post.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-medium text-[var(--primary)] mb-2 group-hover:text-[var(--accent-purple)] transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-[var(--secondary)] line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border-subtle)]">
                        <div className="flex items-center gap-3 text-xs text-[var(--secondary)]">
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
                        <ArrowRight className="w-4 h-4 text-[var(--secondary)] group-hover:text-[var(--accent-purple)] group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}

            {/* View all card */}
            <Link
              href="/blog"
              onClick={() => trackEvent("blog_view_all_click")}
              className="group"
            >
              <div className="card-flat p-6 flex items-center justify-between hover:bg-[var(--accent-purple)]/5 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent-purple)]/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[var(--accent-purple)]" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[var(--primary)]">
                      {t("viewAllPosts")}
                    </span>
                    <p className="text-xs text-[var(--secondary)]">
                      {t("postsCount", { count: posts.length })}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[var(--secondary)] group-hover:text-[var(--accent-purple)] group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
