"use client";

import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Testimonial } from "@/lib/content";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const t = useTranslations("testimonials");

  return (
    <section className="section-padding">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="overline mb-4 block">{t("overline")}</span>
          <h2 className="text-[var(--primary)] mb-4">
            {t("title")}
          </h2>
          <p className="text-[var(--secondary)] max-w-md mx-auto text-lg">
            {t("description")}
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.slug}
              className="card-elevated p-8 flex flex-col relative group"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 left-8">
                <div className="p-3 rounded-2xl bg-[var(--accent-purple)]/10 group-hover:bg-[var(--accent-purple)]/20 transition-colors">
                  <Quote className="w-5 h-5 text-[var(--accent-purple)]" />
                </div>
              </div>

              {/* Quote text */}
              <blockquote className="text-[var(--primary)] leading-relaxed mt-4 mb-8 flex-1">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author info */}
              <footer className="pt-6 border-t border-[var(--border-subtle)]">
                <div className="flex items-center gap-4">
                  {/* Avatar placeholder */}
                  <div className="w-12 h-12 rounded-full bg-[var(--highlight)] flex items-center justify-center">
                    <span className="text-lg font-display text-[var(--secondary)]">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <cite className="not-italic font-medium text-[var(--primary)] block">
                      {testimonial.author}
                    </cite>
                    <span className="text-sm text-[var(--secondary)]">
                      {testimonial.role}
                    </span>
                  </div>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
