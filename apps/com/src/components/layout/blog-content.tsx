"use client";

import { Calendar, Clock, Pin, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { BlogPost } from "@/lib/content";
import { trackEvent } from "@/lib/umami";

interface BlogContentProps {
  posts: BlogPost[];
  pinnedPosts: BlogPost[];
  regularPosts: BlogPost[];
  translations: {
    allTags: string;
    showingPosts: string;
    pinnedArticles: string;
    pinned: string;
    latestArticles: string;
    allArticles: string;
    noPosts: string;
    noPostsDescription: string;
  };
}

export function BlogContent({
  posts,
  pinnedPosts,
  regularPosts,
  translations,
}: BlogContentProps) {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [posts]);

  // Filter posts based on selected tags
  const filteredRegularPosts = useMemo(() => {
    if (selectedTags.size === 0) return regularPosts;
    return regularPosts.filter((post) =>
      post.tags.some((tag) => selectedTags.has(tag))
    );
  }, [regularPosts, selectedTags]);

  const filteredPinnedPosts = useMemo(() => {
    if (selectedTags.size === 0) return pinnedPosts;
    return pinnedPosts.filter((post) =>
      post.tags.some((tag) => selectedTags.has(tag))
    );
  }, [pinnedPosts, selectedTags]);

  const toggleTag = (tag: string) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setSelectedTags(newTags);
    trackEvent("blog_tag_filter", {
      tag,
      active: newTags.has(tag),
    });
  };

  const clearFilters = () => {
    setSelectedTags(new Set());
    trackEvent("blog_clear_filters");
  };

  return (
    <>
      {/* Tag filters */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={clearFilters}
            className={`pill text-sm transition-all ${
              selectedTags.size === 0
                ? "pill-accent"
                : "hover:bg-[var(--accent-purple)]/10 hover:text-[var(--accent-purple)] hover:border-[var(--accent-purple)]/20"
            }`}
          >
            {translations.allTags}
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`pill text-sm cursor-pointer transition-all ${
                selectedTags.has(tag)
                  ? "pill-accent"
                  : "hover:bg-[var(--accent-purple)]/10 hover:text-[var(--accent-purple)] hover:border-[var(--accent-purple)]/20"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        {selectedTags.size > 0 && (
          <p className="text-sm text-[var(--secondary)] mt-4">
            {translations.showingPosts} ({filteredPinnedPosts.length + filteredRegularPosts.length})
          </p>
        )}
      </div>

      {/* Pinned posts section */}
      {filteredPinnedPosts.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Pin className="w-5 h-5 text-[var(--accent-purple)]" />
            <h2 className="text-2xl font-display text-[var(--primary)]">
              {translations.pinnedArticles}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPinnedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <article className="h-full card-elevated transition-all duration-300 hover:shadow-[var(--shadow-glow)] relative overflow-hidden flex flex-col">
                  {/* Thumbnail Image */}
                  {post.image && (
                    <div className="relative h-40 overflow-hidden w-full">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="p-8 flex flex-col flex-1 relative">
                    {/* Decorative gradient */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[var(--accent-purple)]/10 to-transparent" />

                    <div className="relative z-10">
                      {/* Category */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="pill pill-accent text-xs">
                          <Pin className="w-3 h-3" />
                          {translations.pinned}
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

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-[var(--secondary)] mt-auto">
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
      <section>
        <h2 className="text-2xl font-display text-[var(--primary)] mb-8">
          {filteredPinnedPosts.length > 0
            ? translations.latestArticles
            : translations.allArticles}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegularPosts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group"
            >
              <article
                className="h-full card-elevated transition-all duration-300 hover:shadow-[var(--shadow-lg)] animate-in flex flex-col overflow-hidden"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
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

                <div className="p-6 flex flex-col flex-1">
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
                  <div className="flex items-center gap-3 text-xs text-[var(--secondary)] pt-4 border-t border-[var(--border-subtle)] mt-auto">
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
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {filteredPinnedPosts.length === 0 && filteredRegularPosts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-[var(--highlight)] flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-[var(--secondary)]" />
            </div>
            <h3 className="text-xl font-medium text-[var(--primary)] mb-2">
              {translations.noPosts}
            </h3>
            <p className="text-[var(--secondary)]">
              {translations.noPostsDescription}
            </p>
          </div>
        )}
      </section>
    </>
  );
}
