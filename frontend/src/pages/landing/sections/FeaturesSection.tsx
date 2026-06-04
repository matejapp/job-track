import { ListChecks, CalendarDays, BarChart2 } from 'lucide-react'

const FEATURES = [
  {
    icon: ListChecks,
    eyebrow: '01',
    title: 'Pipeline Management',
    desc: 'Track every application from the first click to the final offer. Move jobs through stages, log status changes, and never lose context on any role.',
    mockup: (
      <div className="space-y-2 p-4">
        {['Applied', 'Interview', 'Offer'].map((s, i) => (
          <div key={s} className="flex items-center gap-3 p-2 rounded-lg bg-bg-base border border-border">
            <div className={`w-2 h-2 rounded-full shrink-0 ${i === 0 ? 'bg-info' : i === 1 ? 'bg-warning' : 'bg-accent'}`} />
            <div className="flex-1 h-2 rounded bg-bg-subtle" />
            <div className="text-xs text-text-muted">{s}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: CalendarDays,
    eyebrow: '02',
    title: 'Smart Calendar',
    desc: 'See all your interviews, follow-ups, and deadlines in a single calendar view. Never miss a scheduled event or let a promising application go cold.',
    mockup: (
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i} className="text-center text-xs text-text-muted pb-1">{d}</div>
          ))}
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 3
            const hasEvent = [4, 9, 14, 21].includes(day)
            const isToday = day === 10
            return (
              <div key={i} className={`aspect-square rounded flex items-center justify-center text-xs
                ${day < 1 || day > 31 ? 'text-text-muted' : 'text-text-primary'}
                ${isToday ? 'bg-accent text-white font-bold' : ''}
                ${hasEvent && !isToday ? 'bg-accent/15 text-accent font-medium' : ''}`}>
                {day >= 1 && day <= 31 ? day : ''}
              </div>
            )
          })}
        </div>
      </div>
    ),
  },
  {
    icon: BarChart2,
    eyebrow: '03',
    title: 'Statistics & Insights',
    desc: 'Understand your job search with response rates, interview conversion, and activity trends. Know what is working and where to focus your energy.',
    mockup: (
      <div className="p-4 space-y-3">
        {[['Response rate', '42%', 80], ['Interview rate', '18%', 36], ['Active apps', '7', 56]].map(([label, val, w]) => (
          <div key={label as string}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-text-secondary">{label}</span>
              <span className="font-semibold text-text-primary">{val}</span>
            </div>
            <div className="h-2 rounded-full bg-bg-subtle">
              <div className="h-full rounded-full bg-accent" style={{ width: `${w}%` }} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-20 space-y-20">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Features</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
          Everything your job search needs
        </h2>
        <p className="text-text-secondary mt-4 max-w-xl mx-auto">
          One workspace to replace spreadsheets, sticky notes, and scattered reminders.
        </p>
      </div>
      {FEATURES.map((f, i) => {
        const Icon = f.icon
        const reversed = i % 2 !== 0
        return (
          <div key={f.eyebrow} className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${reversed ? 'md:[&>*:first-child]:order-last' : ''}`}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <span className="text-xs font-semibold text-text-muted uppercase tracking-widest">{f.eyebrow}</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-text-primary">{f.title}</h3>
              <p className="text-text-secondary leading-relaxed">{f.desc}</p>
            </div>
            <div className="rounded-xl border border-border bg-bg-surface shadow-lg overflow-hidden">
              {f.mockup}
            </div>
          </div>
        )
      })}
    </section>
  )
}
