import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import LandingNav from './LandingNav'
import LandingFooter from './LandingFooter'
import HeroSection from './sections/HeroSection'
import FeaturesSection from './sections/FeaturesSection'
import HowItWorks from './sections/HowItWorks'
import TestimonialsSection from './sections/Testimonials'
import FAQSection from './sections/FAQSection'

const LOGO_NAMES = ['Google', 'Meta', 'Apple', 'Spotify', 'Notion', 'Figma', 'Linear', 'Stripe']

function LogoBar() {
  return (
    <div className="bg-bg-subtle border-y border-border py-6">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-xs text-text-muted uppercase tracking-widest mb-4">
          Trusted by job seekers targeting
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {LOGO_NAMES.map(name => (
            <span key={name} className="text-sm font-semibold text-text-muted/60">{name}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function FinalCTA() {
  return (
    <section className="bg-accent py-20">
      <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
          Ready to take control of your job search?
        </h2>
        <p className="text-white/80 text-lg">
          Join thousands of job seekers who stay organized and land more offers.
        </p>
        <Button size="lg" variant="secondary" asChild className="bg-white text-accent hover:bg-white/90">
          <Link to="/signup">Get Started Free</Link>
        </Button>
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <div className="bg-bg-base min-h-screen">
      <LandingNav />
      <HeroSection />
      <LogoBar />
      <FeaturesSection />
      <HowItWorks />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTA />
      <LandingFooter />
    </div>
  )
}
