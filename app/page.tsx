import AboutSection from "@/components/about-section"
import ContactSection from "@/components/contact-section"
import HeroSection from "@/components/hero-section"
import ModernFooter from "@/components/modern-footer"
import Navbar from "@/components/navbar"
import ProjectsSection from "@/components/projects-section"
import ReactiveParticleField from "@/components/reactive-particle-field"
import SkillsSection from "@/components/skills-section"

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <Navbar />
      <div className="particle-world relative isolate">
        <ReactiveParticleField />
        <div className="relative z-10">
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <ContactSection />
        </div>
      </div>
      <ModernFooter />
    </main>
  )
}
