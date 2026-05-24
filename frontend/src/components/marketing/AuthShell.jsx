import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import BrandMark from "./BrandMark";

const AUTH_POINTS = [
  "Keep every application, contact, and note in one place.",
  "Return to the exact role you need without digging through tabs.",
  "Move from applied to interview with a clearer next step.",
];

export default function AuthShell({ title, subtitle, children, footer, eyebrow }) {
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-paper font-sans text-ink antialiased">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
        {/* Left panel */}
        <section className="relative hidden overflow-hidden px-10 py-9 lg:flex lg:flex-col lg:justify-between" style={{ background: "#0c0d0a", color: "#f1eee0" }}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(194,65,12,0.22),transparent_45%),radial-gradient(circle_at_80%_85%,rgba(31,58,44,0.32),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_2px_2px,#f5f0e6_1px,transparent_0)] [background-size:32px_32px]" />

          <div className="relative z-10 flex items-center justify-between">
            <Link to="/" aria-label="JobTrack home"><BrandMark theme="light" /></Link>
            <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[12.5px] font-semibold text-white/85 transition-colors hover:border-white hover:bg-white/10 hover:text-white">
              <ArrowLeft size={13} strokeWidth={2.5} />
              Back home
            </Link>
          </div>

          <div className="relative z-10 max-w-xl py-12">
            <p className="mb-7 mk-eyebrow text-white/55">
              <span className="font-serif italic text-clay">No.</span> 01 — The workspace
            </p>
            <h2 className="font-display text-[44px] font-bold leading-[0.95] tracking-crunch text-balance lg:text-[64px]">
              A cleaner way to{" "}
              <span className="font-serif italic font-normal text-clay">manage</span>{" "}
              the roles you care about.
            </h2>
            <div className="my-9 h-px w-24 bg-white/20" />
            <p className="font-serif text-[22px] italic leading-snug text-white/85">
              &ldquo;Open JobTrack and you already know what to do next.&rdquo;
            </p>
          </div>

          <div className="relative z-10">
            <ul className="space-y-4">
              {AUTH_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-[3px] flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-clay/15 text-clay ring-1 ring-clay/25">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <span className="text-[14px] leading-relaxed text-white/80">{point}</span>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-[11px] uppercase tracking-[0.22em] text-white/45">
              © {currentYear} JobTrack — Made for the search ahead.
            </p>
          </div>
        </section>

        {/* Right panel — form */}
        <section className="relative flex min-h-screen items-center justify-center px-5 pb-12 pt-24 sm:px-8 sm:pt-28 lg:px-14 lg:py-10">
          <div className="absolute left-5 right-5 top-5 flex items-center justify-between sm:left-8 sm:right-8 lg:hidden">
            <Link to="/" aria-label="JobTrack home"><BrandMark /></Link>
            <Link to="/" className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12px] font-semibold text-muted transition-colors hover:border-ink hover:text-ink">
              <ArrowLeft size={12} strokeWidth={2.5} />
              Home
            </Link>
          </div>

          <div className="w-full max-w-[440px]">
            <div className="mb-9">
              {eyebrow && (
                <p className="mk-eyebrow mb-5">{eyebrow}</p>
              )}
              <h1 className="font-display text-[34px] font-bold leading-[1.02] tracking-tightest text-ink text-balance sm:text-[42px] lg:text-[48px]">
                {title}
              </h1>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft text-pretty">
                {subtitle}
              </p>
            </div>

            <div>{children}</div>
            {footer}

            <p className="mt-14 text-center text-[11px] uppercase tracking-[0.22em] text-ink-muted lg:hidden">
              © {currentYear} JobTrack
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
