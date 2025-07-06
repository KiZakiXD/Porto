import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import SkillsSection from "@/components/skills-section"
import ProjectsSection from "@/components/projects-section"
import ContactSection from "@/components/contact-section"
import ModernFooter from "@/components/modern-footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white dark:bg-gray-900">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
      <ModernFooter />
    </div>
  )
}
