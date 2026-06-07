import { Link } from 'react-router-dom'

const FOOTER_LINKS = [
  { heading: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'How it works', href: '#how-it-works' }, { label: 'FAQ', href: '#faq' }] },
  { heading: 'Account', links: [{ label: 'Sign up', href: '/signup' }, { label: 'Log in', href: '/login' }] },
  { heading: 'Legal', links: [{ label: 'Privacy Policy', href: '/privacy' }, { label: 'Terms of Service', href: '/terms' }] },
]

export default function LandingFooter() {
  return (
    <footer className="border-t border-border bg-bg-base">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <p className="font-display text-lg font-semibold text-text-primary mb-2">JobTrack</p>
            <p className="text-sm text-text-muted max-w-xs">
              The simplest way to organize your job search and land more offers.
            </p>
          </div>
          {FOOTER_LINKS.map(col => (
            <div key={col.heading}>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3">{col.heading}</p>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l.label}>
                    {l.href.startsWith('/') ? (
                      <Link to={l.href} className="text-sm text-text-secondary hover:text-text-primary transition-colors">{l.label}</Link>
                    ) : (
                      <a href={l.href} className="text-sm text-text-secondary hover:text-text-primary transition-colors">{l.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-6 text-center">
          <p className="text-xs text-text-muted">&copy; {new Date().getFullYear()} JobTrack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
