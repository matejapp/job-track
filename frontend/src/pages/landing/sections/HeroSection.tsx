import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
            <Star className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-medium text-accent">Free for job seekers</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary leading-tight">
            Stop losing track of where you applied.{' '}
            <span className="text-accent">Start landing offers.</span>
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed">
            Track every application, interview, and follow-up in one place. Stay organized, follow up faster, and never miss an opportunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" asChild>
              <Link to="/signup">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <span className="text-sm text-text-muted">No credit card required &middot; Free for job seekers</span>
          </div>
        </div>

        {/* Right: browser mockup */}
        <div className="relative">
          <div className="rounded-xl border border-border bg-bg-surface shadow-2xl overflow-hidden">
            <div className="bg-bg-subtle px-4 py-3 flex items-center gap-2 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-danger/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
              </div>
              <div className="flex-1 mx-4 bg-bg-base rounded px-3 py-1 text-xs text-text-muted">
                app.jobtrack.io/dashboard
              </div>
            </div>
            <div className="p-6 space-y-3">
              {[
                { company: 'Stripe', role: 'Software Engineer', status: 'Interview', color: 'bg-warning/15 text-warning' },
                { company: 'Linear', role: 'Product Designer', status: 'Applied', color: 'bg-info/15 text-info' },
                { company: 'Vercel', role: 'DevRel Engineer', status: 'Offer', color: 'bg-accent/15 text-accent' },
                { company: 'Figma', role: 'Frontend Engineer', status: 'Applied', color: 'bg-info/15 text-info' },
              ].map(item => (
                <div key={item.company} className="flex items-center gap-3 p-3 rounded-lg bg-bg-base border border-border">
                  <div className="w-8 h-8 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {item.company.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{item.company}</p>
                    <p className="text-xs text-text-muted truncate">{item.role}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${item.color}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
