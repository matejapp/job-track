import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote: "I was tracking 40+ applications in a spreadsheet and losing my mind. JobTrack made it so much easier to see the full picture at once.",
    author: 'Mia K.',
    role: 'Product Manager',
  },
  {
    quote: "The calendar view is my favorite feature. I can see all my upcoming interviews and follow-ups without digging through emails.",
    author: 'James R.',
    role: 'Software Engineer',
  },
  {
    quote: "The stats page helped me realize I was applying to too many companies and not following up. Changed my whole approach.",
    author: 'Priya N.',
    role: 'UX Designer',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="bg-bg-subtle py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Testimonials</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
            What job seekers are saying
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.author} className="p-6 rounded-xl border border-border bg-bg-surface space-y-4">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-warning fill-warning" />
                ))}
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">"{t.quote}"</p>
              <div>
                <p className="text-sm font-semibold text-text-primary">{t.author}</p>
                <p className="text-xs text-text-muted">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
