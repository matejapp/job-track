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
        {/* ───────── LEFT — editorial panel ───────── */}
        <section className="relative hidden overflow-hidden bg-ink px-10 py-9 text-paper lg:flex lg:flex-col lg:justify-between">
          {/* warm gradient + grain */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(194,65,12,0.22),transparent_45%),radial-gradient(circle_at_80%_85%,rgba(31,58,44,0.32),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_2px_2px,#f5f0e6_1px,transparent_0)] [background-size:32px_32px]" />

          {/* TOP — nav */}
          <div className="relative z-10 flex items-center justify-between">
            <Link to="/" aria-label="JobTrack home">
              <BrandMark theme="light" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-paper/20 px-4 py-2 text-[12.5px] font-semibold text-paper/85 transition-colors hover:border-paper hover:bg-paper/10 hover:text-paper"
            >
              <ArrowLeft size={13} strokeWidth={2.5} />
              Back home
            </Link>
          </div>

          {/* MIDDLE — editorial display */}
          <div className="relative z-10 max-w-xl py-12">
            <p className="mb-7 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-paper/55">
              <span className="font-serif italic text-clay">No.</span> 01 —
              The workspace
            </p>
            <h2 className="font-display text-[52px] font-bold leading-[0.95] tracking-crunch text-balance lg:text-[64px]">
              A cleaner way to{" "}
              <span className="font-serif italic font-normal text-clay">
                manage
              </span>{" "}
              the roles you care about.
            </h2>

            <div className="my-9 h-px w-24 bg-paper/20" />

            <p className="font-serif text-[22px] italic leading-snug text-paper/85">
              &ldquo;Open JobTrack and you already know what to do next.&rdquo;
            </p>
          </div>

          {/* BOTTOM — bullets + footer */}
          <div className="relative z-10">
            <ul className="space-y-4">
              {AUTH_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-[3px] flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-clay/15 text-clay ring-1 ring-clay/25">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <span className="text-[14px] leading-relaxed text-paper/80">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-[11px] uppercase tracking-[0.22em] text-paper/45">
              © {currentYear} JobTrack — Made for the search ahead.
            </p>
          </div>
        </section>

        {/* ───────── RIGHT — form ───────── */}
        <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-14">
          {/* mobile nav */}
          <div className="absolute left-5 right-5 top-5 flex items-center justify-between sm:left-8 sm:right-8 lg:hidden">
            <Link to="/" aria-label="JobTrack home">
              <BrandMark />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-ink-rule px-3 py-1.5 text-[12px] font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink"
            >
              <ArrowLeft size={12} strokeWidth={2.5} />
              Home
            </Link>
          </div>

          <div className="w-full max-w-[440px]">
            {/* Editorial header */}
            <div className="mb-9">
              {eyebrow ? (
                <p className="mk-eyebrow mb-5">
                  <span className="mk-number">{eyebrow}</span>
                </p>
              ) : null}
              <h1 className="font-display text-[42px] font-bold leading-[1.02] tracking-tightest text-ink text-balance sm:text-[48px]">
                {title}
              </h1>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft text-pretty">
                {subtitle}
              </p>
            </div>

            {/* Form slot */}
            <div>{children}</div>

            {footer}

            {/* Mobile footer */}
            <p className="mt-14 text-center text-[11px] uppercase tracking-[0.22em] text-ink-muted lg:hidden">
              © {currentYear} JobTrack
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
