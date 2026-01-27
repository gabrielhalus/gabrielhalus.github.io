import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { getClients, getProjects, getTestimonials } from "@/lib/content";

import { ClientsSection } from "@/components/layout/clients-section";
import { ContactSection } from "@/components/layout/contact-section";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/layout/hero-section";
import { Navigation } from "@/components/layout/navigation";
import { ProjectsSection } from "@/components/layout/projects-section";
import { SkillsSection } from "@/components/layout/skills-section";
import { TerminalSection } from "@/components/layout/terminal-section";
import { TestimonialsSection } from "@/components/layout/testimonials-section";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Load content
  const projects = getProjects(locale);
  const testimonials = getTestimonials(locale);
  const clients = getClients();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navigation />
      <main>
        <HeroSection />
        <ClientsSection clients={clients} />
        <ProjectsSection projects={projects} />
        <SkillsSection />
        <TerminalSection />
        <TestimonialsSection testimonials={testimonials} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
