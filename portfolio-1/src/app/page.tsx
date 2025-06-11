import { Sidebar } from "@/components/sidebar";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { SkillsSection } from "@/components/skills-section";
import { ProjectsSection } from "@/components/projects-section";
import { ResumeSection } from "@/components/resume-section";
import { InteractiveGame } from "@/components/interactive-game";
import { ContactSection } from "@/components/contact-section";
import { Spotlight } from "@/components/spotlight";
import { NoiseOverlay } from "@/components/noise-overlay";
import { ThemeProvider } from "@/components/theme-provider";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NoiseOverlay />
      <Spotlight />
      <Sidebar />
      <main className="ml-16">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <ResumeSection />
          <InteractiveGame />
          <ContactSection />
        </ThemeProvider>
      </main>
    </div>
  );
}
