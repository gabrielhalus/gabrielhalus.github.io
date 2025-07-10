import { ContactSection } from "@/components/layout/contact-section";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/layout/hero-section";
import { SkillsSection } from "@/components/layout/skills-section";
import { TerminalSection } from "@/components/layout/terminal-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <SkillsSection />
      <TerminalSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
