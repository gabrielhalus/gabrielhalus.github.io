import { ContactSection } from "@/components/layout/contact-section";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/layout/hero-section";
import { SkillsSection } from "@/components/layout/skills-section";
import { TerminalSection } from "@/components/layout/terminal-section";
import { ProjectsSection } from "@/components/layout/projects-section";
import { Navigation } from "@/components/layout/navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <ProjectsSection />
        <SkillsSection />
        <TerminalSection />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}
