import { LayoutDashboard, CalendarDays, BarChart2 } from 'lucide-react'

const HIGHLIGHTS = [
  {
    icon: LayoutDashboard,
    title: 'One place for every application',
    body: 'Kanban and list views let you see all your applications, statuses, and next steps at a glance — no more spreadsheet chaos.',
  },
  {
    icon: CalendarDays,
    title: 'Never miss a follow-up',
    body: 'Log interviews and deadlines, then check the calendar view so nothing slips through the cracks.',
  },
  {
    icon: BarChart2,
    title: 'Understand what’s working',
    body: 'The statistics page shows your response rates and pipeline stages so you can adjust your strategy, not just send more applications.',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="bg-bg-subtle py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Why JobTrack</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
            Built around how job searching actually works
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HIGHLIGHTS.map(h => (
            <div key={h.title} className="p-6 rounded-xl border border-border bg-bg-surface space-y-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <h.icon className="h-5 w-5 text-accent" />
              </div>
              <p className="text-base font-semibold text-text-primary">{h.title}</p>
              <p className="text-text-secondary text-sm leading-relaxed">{h.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
