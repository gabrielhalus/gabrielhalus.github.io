import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/layout/hero-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <Footer />
    </div>
  );
}
