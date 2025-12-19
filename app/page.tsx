import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { CoursesSection } from "@/components/landing/courses-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { CTASection } from "@/components/landing/cta-section"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CoursesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
