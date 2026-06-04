const STEPS = [
  { n: '1', title: 'Add an application', desc: 'Log a job with the company name, role, status, and link. Takes under 30 seconds.' },
  { n: '2', title: 'Track as you progress', desc: 'Move it through stages, log activities, and attach notes to keep your context.' },
  { n: '3', title: 'Stay on top of what matters', desc: 'Use the calendar and dashboard to see what is next and where to focus.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-bg-subtle py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">How it works</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
            Up and running in minutes
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-border" style={{ left: '16.7%', right: '16.7%' }} />
          {STEPS.map((step, i) => (
            <div key={step.n} className="flex flex-col items-center text-center space-y-4">
              <div className="relative z-10 w-20 h-20 rounded-full bg-accent text-white flex items-center justify-center text-2xl font-display font-bold shadow-lg">
                {step.n}
              </div>
              {i < STEPS.length - 1 && (
                <div className="md:hidden h-8 w-px bg-border" />
              )}
              <div>
                <h3 className="font-semibold text-text-primary text-lg mb-2">{step.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
