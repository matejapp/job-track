import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={cn(
      'sticky top-0 z-50 flex items-center justify-between px-6 py-4 transition-all',
      scrolled && 'backdrop-blur-md bg-bg-base/80 border-b border-border',
    )}>
      <Link to="/" className="font-display text-xl font-semibold text-text-primary">
        JobTrack
      </Link>
      <div className="hidden md:flex items-center gap-8">
        {['Features', 'How it works', 'FAQ'].map(label => (
          <a
            key={label}
            href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            {label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/login">Log in</Link>
        </Button>
        <Button size="sm" asChild>
          <Link to="/signup">Get Started Free</Link>
        </Button>
      </div>
    </nav>
  )
}
