import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Bookmark,
  CalendarCheck,
  Check,
  Folder,
  Goal,
  ListChecks,
  MessageSquareText,
  NotebookText,
  Sparkles,
  StickyNote,
  Workflow,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import BrandMark from "../components/marketing/BrandMark";
import ProductPreview from "../components/marketing/ProductPreview";

const TRACK_TAGS = [
  { icon: Folder, label: "Applications" },
  { icon: MessageSquareText, label: "Interview notes" },
  { icon: CalendarCheck, label: "Follow-ups" },
  { icon: Bookmark, label: "Saved roles" },
  { icon: NotebookText, label: "Recruiter contacts" },
  { icon: StickyNote, label: "Take-home prep" },
  { icon: ListChecks, label: "Status changes" },
  { icon: Goal, label: "Next steps" },
];

const FEATURES = [
  {
    n: "01",
    icon: ListChecks,
    title: "Track the whole pipeline",
    text: "Save roles, statuses, links, and notes without the spreadsheet sprawl. Move applications from Applied to Interview to Offer the moment things change.",
  },
  {
    n: "02",
    icon: MessageSquareText,
    title: "Keep interview context close",
    text: "Capture what happened, what to prepare, and what needs a follow-up. Every conversation lives next to the application it belongs to.",
  },
  {
    n: "03",
    icon: Workflow,
    title: "Stay focused on the search",
    text: "One workspace replaces a scattered mix of tabs, notes apps, and reminders. Open JobTrack and you already know what to do next.",
  },
];

const WORKFLOW = [
  {
    n: "Step 01",
    title: "Add a role the moment you apply.",
    text: "Paste the link, write a sentence about why you applied, and JobTrack stores the rest.",
  },
  {
    n: "Step 02",
    title: "Move it through real hiring stages.",
    text: "Applied, Assessment, Interview, Offer. Update the status as the conversation actually progresses.",
  },
  {
    n: "Step 03",
    title: "Return to the application with everything you need.",
    text: "Notes, links, contacts, the exact follow-up you owe — all already where you left them.",
  },
];

const FAQ = [
  {
    q: "Is JobTrack free?",
    a: "Yes. JobTrack is free to create an account and use. No credit card required to start tracking your applications.",
  },
  {
    q: "Who is JobTrack for?",
    a: "JobTrack is built for active job seekers — engineers, designers, and operators running a real search with five, fifty, or a hundred applications across multiple stages.",
  },
  {
    q: "How is this different from a spreadsheet?",
    a: "A spreadsheet stores rows. JobTrack stores the work around each role — notes, links, status changes, and the next step — and surfaces what needs your attention today.",
  },
  {
    q: "Will my data stay private?",
    a: "Your applications and notes are tied to your account. They are not shared with employers and not used as marketing examples.",
  },
];

export default function LandingPage() {
  const { token } = useAuth();
  const currentYear = new Date().getFullYear();
  const primaryTarget = token ? "/dashboard" : "/register";
  const primaryCopy = token ? "Open dashboard" : "Create free account";

  return (
    <main className="min-h-screen bg-paper font-sans text-ink antialiased">
      {/* ──────────── NAV ──────────── */}
      <header className="sticky top-0 z-40 border-b border-ink-rule/70 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" aria-label="JobTrack home">
            <BrandMark />
          </Link>
          <nav className="hidden items-center gap-7 text-[13px] font-medium text-ink-soft md:flex">
            <a href="#how" className="mk-link-underline">How it works</a>
            <a href="#features" className="mk-link-underline">Features</a>
            <a href="#faq" className="mk-link-underline">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden rounded-full px-3 py-2 text-[13px] font-medium text-ink-soft transition-colors hover:text-ink sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              to={primaryTarget}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-paper transition-all duration-200 hover:bg-clay hover:shadow-[0_14px_30px_-14px_rgba(194,65,12,0.65)]"
            >
              {token ? "Open app" : "Get started"}
              <ArrowUpRight size={14} strokeWidth={2.3} />
            </Link>
          </div>
        </div>
      </header>

      {/* ──────────── HERO ──────────── */}
      <section className="relative overflow-hidden mk-grain">
        <div className="relative z-10 mx-auto max-w-[1240px] px-5 pb-24 pt-14 sm:px-8 lg:pb-32 lg:pt-20">
          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            {/* Hero text */}
            <div className="animate-rise" style={{ animationDelay: "60ms" }}>
              <div className="mk-eyebrow mb-7">
                <span className="h-1 w-6 bg-clay" />
                A workspace for active job seekers
              </div>

              <h1 className="font-display text-[44px] font-bold leading-[0.95] tracking-crunch text-ink text-balance sm:text-[68px] md:text-[78px] lg:text-[108px]">
                Your job search,
                <br />
                <span className="font-serif italic font-normal text-clay">
                  finally
                </span>{" "}
                in one place.
              </h1>

              <p className="mt-7 max-w-xl text-[17px] leading-[1.55] text-ink-soft text-pretty">
                JobTrack is a calm, dedicated workspace for the roles you&apos;re
                actually pursuing — applications, interviews, notes, links, and
                the follow-up you owe by Friday.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link to={primaryTarget} className="mk-btn-primary group">
                  {primaryCopy}
                  <ArrowRight
                    size={15}
                    strokeWidth={2.5}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
                <Link to="/login" className="mk-btn-outline">
                  Sign in
                </Link>
              </div>

              <p className="mt-5 flex items-center gap-2 text-[12.5px] text-ink-muted">
                <Check size={14} className="text-moss" strokeWidth={2.5} />
                Free to use · No credit card · No mailing list
              </p>
            </div>

            {/* Vital stats sidebar */}
            <aside
              className="animate-rise rounded-[18px] border border-ink-rule bg-paper-soft/60 p-6 sm:p-7 lg:mb-3"
              style={{ animationDelay: "220ms" }}
            >
              <p className="mk-eyebrow mb-5">
                <span className="font-serif italic text-clay">No.</span> 01
                — The pitch
              </p>
              <p className="font-serif text-[26px] italic leading-[1.2] text-ink sm:text-[28px]">
                &ldquo;A focused home for every application, before the tabs
                multiply.&rdquo;
              </p>
              <div className="my-6 mk-rule" />
              <ul className="space-y-3.5 text-[13.5px] text-ink-soft">
                {[
                  "Real hiring stages, not generic labels",
                  "Notes and links live next to each role",
                  "Today's follow-ups in one glance",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <Check
                      size={15}
                      strokeWidth={2.5}
                      className="mt-[3px] flex-shrink-0 text-clay"
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>

        {/* decorative bottom mark */}
        <div className="pointer-events-none absolute bottom-6 right-6 hidden text-[11px] font-medium uppercase tracking-[0.3em] text-ink-muted/60 lg:block">
          Est. 2024 — &nbsp;Built for the search ahead
        </div>
      </section>

      {/* ──────────── TAG MARQUEE ──────────── */}
      <section className="overflow-hidden border-y border-ink-rule bg-ink py-6 text-paper">
        <div className="flex animate-marquee gap-12 whitespace-nowrap">
          {[...TRACK_TAGS, ...TRACK_TAGS, ...TRACK_TAGS].map(
            ({ icon: Icon, label }, idx) => (
              <span
                key={`${label}-${idx}`}
                className="flex flex-shrink-0 items-center gap-2.5 text-[15px] font-medium tracking-tight"
              >
                <Icon size={15} className="text-clay" strokeWidth={2} />
                {label}
                <span className="ml-12 font-serif italic text-paper/30">
                  /
                </span>
              </span>
            ),
          )}
        </div>
      </section>

      {/* ──────────── PRODUCT PREVIEW ──────────── */}
      <section
        id="how"
        className="relative overflow-hidden border-b border-ink-rule bg-paper-soft/40 py-24 lg:py-32"
      >
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="mk-eyebrow mb-4">
                <span className="mk-number">No. 02</span>
                — A look inside
              </p>
              <h2 className="font-display text-[34px] font-bold leading-[1] tracking-tightest text-ink text-balance sm:text-[44px] lg:text-[56px]">
                One workspace that <br />
                <span className="font-serif italic font-normal text-clay">
                  remembers
                </span>{" "}
                where you left off.
              </h2>
            </div>
            <p className="max-w-md text-[15.5px] leading-relaxed text-ink-soft lg:justify-self-end">
              Open the dashboard and see the applications you&apos;re actively
              chasing, the conversations that need a reply, and the role you
              were drafting notes for last night.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[28px] bg-gradient-to-br from-clay/10 via-transparent to-moss/10 blur-2xl" />
            <div className="preview-fit">
              <ProductPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── FEATURES ──────────── */}
      <section
        id="features"
        className="relative border-b border-ink-rule bg-paper py-24 lg:py-32"
      >
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="mb-14 flex items-end justify-between gap-6">
            <div>
              <p className="mk-eyebrow mb-4">
                <span className="mk-number">No. 03</span>
                — Features
              </p>
              <h2 className="font-display text-[34px] font-bold leading-[1] tracking-tightest text-ink text-balance sm:text-[44px] lg:text-[56px]">
                Built for the
                <br />
                <span className="font-serif italic font-normal text-clay">
                  moving
                </span>{" "}
                parts of a search.
              </h2>
            </div>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[20px] border border-ink-rule bg-ink-rule lg:grid-cols-3">
            {FEATURES.map(({ n, icon: Icon, title, text }) => (
              <article
                key={title}
                className="group relative flex flex-col gap-6 bg-paper p-8 transition-colors duration-300 hover:bg-paper-soft/70 lg:p-10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-ink text-paper transition-all duration-300 group-hover:bg-clay">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <span className="font-serif text-[18px] italic text-clay/80">
                    {n}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-[22px] font-bold leading-tight tracking-tight text-ink text-balance">
                    {title}
                  </h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft text-pretty">
                    {text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── EDITORIAL PULL QUOTE ──────────── */}
      <section className="relative overflow-hidden bg-ink py-24 text-paper lg:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_2px_2px,#f5f0e6_1px,transparent_0)] [background-size:32px_32px]" />
        <div className="relative mx-auto max-w-[1100px] px-5 sm:px-8">
          <p className="mk-eyebrow mb-8 text-paper/55">
            <span className="font-serif italic text-clay">No.</span> 04 —
            On focus
          </p>
          <blockquote className="font-display text-[32px] font-bold leading-[1.05] tracking-tightest text-balance sm:text-[48px] md:text-[60px] lg:text-[72px]">
            The job search rewards{" "}
            <span className="font-serif italic font-normal text-clay">
              follow-through
            </span>
            , not frantic energy. JobTrack keeps the follow-through visible.
          </blockquote>
          <div className="mt-10 flex items-center gap-3 text-[12.5px] uppercase tracking-[0.25em] text-paper/55">
            <span className="h-px w-10 bg-paper/30" />
            Why we built it
          </div>
        </div>
      </section>

      {/* ──────────── WORKFLOW ──────────── */}
      <section className="border-b border-ink-rule bg-paper py-24 lg:py-32">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="mb-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="mk-eyebrow mb-4">
                <span className="mk-number">No. 05</span>
                — How it works
              </p>
              <h2 className="font-display text-[34px] font-bold leading-[1] tracking-tightest text-ink text-balance sm:text-[44px] lg:text-[56px]">
                Three steps,
                <br />
                <span className="font-serif italic font-normal text-clay">
                  no overhead.
                </span>
              </h2>
            </div>
            <p className="max-w-lg text-[15.5px] leading-relaxed text-ink-soft lg:justify-self-end">
              You don&apos;t need a setup ritual or a productivity philosophy.
              Add a role, move it as things change, return to the work where you
              left it.
            </p>
          </div>

          <ol className="grid gap-px overflow-hidden rounded-[20px] border border-ink-rule bg-ink-rule">
            {WORKFLOW.map(({ n, title, text }, idx) => (
              <li
                key={n}
                className="grid grid-cols-1 gap-4 bg-paper p-6 sm:p-8 lg:grid-cols-[170px_1fr_auto] lg:items-start lg:gap-10 lg:p-10"
              >
                <p className="font-serif text-[18px] italic text-clay sm:text-[20px]">
                  {n}
                </p>
                <div>
                  <h3 className="font-display text-[22px] font-bold leading-tight tracking-tight text-ink text-balance sm:text-[26px] lg:text-[30px]">
                    {title}
                  </h3>
                  <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-ink-soft">
                    {text}
                  </p>
                </div>
                <span className="hidden font-display text-[64px] font-bold leading-none text-ink/10 lg:block">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ──────────── FAQ ──────────── */}
      <section
        id="faq"
        className="border-b border-ink-rule bg-paper-soft/40 py-24 lg:py-32"
      >
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="mk-eyebrow mb-4">
                <span className="mk-number">No. 06</span>
                — Common questions
              </p>
              <h2 className="font-display text-[34px] font-bold leading-[1] tracking-tightest text-ink text-balance sm:text-[44px] lg:text-[52px]">
                Quick{" "}
                <span className="font-serif italic font-normal text-clay">
                  answers
                </span>
                .
              </h2>
            </div>
          </div>

          <div className="divide-y divide-ink-rule border-y border-ink-rule">
            {FAQ.map(({ q, a }) => (
              <details
                key={q}
                className="group py-6 transition-colors [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-6 list-none">
                  <span className="font-display text-[20px] font-semibold tracking-tight text-ink text-balance sm:text-[22px]">
                    {q}
                  </span>
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-ink-rule text-ink transition-all duration-200 group-open:rotate-45 group-open:border-clay group-open:bg-clay group-open:text-paper">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M7 1v12M1 7h12" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-ink-soft text-pretty">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── FINAL CTA ──────────── */}
      <section className="relative overflow-hidden bg-ink py-24 text-paper lg:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(194,65,12,0.18),transparent_55%),radial-gradient(circle_at_75%_80%,rgba(31,58,44,0.32),transparent_55%)]" />
        <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <Sparkles
                size={28}
                strokeWidth={1.5}
                className="mb-7 text-clay"
              />
              <h2 className="font-display text-[36px] font-bold leading-[0.95] tracking-crunch text-balance sm:text-[56px] md:text-[72px] lg:text-[92px]">
                Give your search a{" "}
                <span className="font-serif italic font-normal text-clay">
                  home.
                </span>
              </h2>
              <p className="mt-7 max-w-xl text-[16px] leading-relaxed text-paper/75 text-pretty">
                Start with the applications you already have open. Bring the
                rest of the process into one place. Free to use, no card
                required.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
              <Link
                to={primaryTarget}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-clay px-6 py-4 text-[14px] font-semibold tracking-tight text-paper transition-all duration-200 hover:bg-paper hover:text-ink sm:w-auto lg:w-full"
              >
                {token ? "Open JobTrack" : "Create free account"}
                <ArrowRight
                  size={16}
                  strokeWidth={2.5}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-paper/25 px-6 py-4 text-[14px] font-semibold tracking-tight text-paper transition-all duration-200 hover:border-paper hover:bg-paper/10 sm:w-auto lg:w-full"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── FOOTER ──────────── */}
      <footer className="bg-paper px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <BrandMark />
              <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-ink-muted">
                A focused workspace for managing applications, interviews,
                notes, and follow-ups during a real job search.
              </p>
            </div>
            <nav className="grid grid-cols-2 gap-x-10 gap-y-3 text-[13px] font-medium text-ink-soft sm:flex sm:items-center sm:gap-8">
              <a href="#how" className="mk-link-underline">How it works</a>
              <a href="#features" className="mk-link-underline">Features</a>
              <a href="#faq" className="mk-link-underline">FAQ</a>
              <Link to="/login" className="mk-link-underline">Sign in</Link>
              <Link to={primaryTarget} className="mk-link-underline">
                {token ? "Dashboard" : "Get started"}
              </Link>
            </nav>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-ink-rule pt-6 text-[12px] text-ink-muted sm:flex-row sm:items-center sm:justify-between">
            <p>© {currentYear} JobTrack. All rights reserved.</p>
            <p className="font-serif italic">Made for the search ahead.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
