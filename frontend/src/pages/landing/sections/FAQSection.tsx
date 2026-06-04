import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const FAQS = [
  {
    q: 'Is JobTrack really free?',
    a: 'Yes — JobTrack is completely free for job seekers. There are no hidden fees, paywalls, or premium tiers. We believe everyone deserves great tools for their job search.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'Yes, a free account keeps your data synced across devices and ensures your applications are never lost. Sign up takes under a minute.',
  },
  {
    q: 'What data do you store?',
    a: 'Only the information you enter — application details, notes, and activities. We do not read your emails, access your accounts elsewhere, or share your data with anyone.',
  },
  {
    q: 'Can I import applications from a spreadsheet?',
    a: 'Import is on our roadmap. For now, adding applications manually is fast — each one takes under 30 seconds.',
  },
  {
    q: 'What if I find a bug or have a feature request?',
    a: 'Reach out via the feedback link in the app. We read every message and ship improvements quickly based on what job seekers actually need.',
  },
]

export default function FAQSection() {
  return (
    <section id="faq" className="max-w-3xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">FAQ</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
          Common questions
        </h2>
      </div>
      <Accordion type="single" collapsible className="space-y-2">
        {FAQS.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-lg px-4">
            <AccordionTrigger className="text-left text-sm font-medium text-text-primary hover:no-underline">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-text-secondary leading-relaxed pb-4">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
