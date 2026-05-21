import {
  Briefcase,
  CalendarDays,
  Clock,
  LayoutDashboard,
  ListChecks,
  Plus,
  Search,
  Settings,
  Trophy,
  Users,
} from "lucide-react";

const STATS = [
  {
    label: "Total",
    value: 24,
    icon: Briefcase,
    gradient: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
  },
  {
    label: "In progress",
    value: 11,
    icon: Clock,
    gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
  },
  {
    label: "Interviews",
    value: 5,
    icon: Users,
    gradient: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)",
  },
  {
    label: "Offers",
    value: 2,
    icon: Trophy,
    gradient: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
  },
];

const APPLICATIONS = [
  {
    company: "Linear",
    role: "Senior Frontend Engineer",
    status: "Interview",
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  {
    company: "Vercel",
    role: "Product Designer",
    status: "Assessment",
    tone: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  {
    company: "Supabase",
    role: "Backend Engineer",
    status: "Applied",
    tone: "bg-sky-50 text-sky-700 ring-sky-200",
  },
];

const UPCOMING = [
  { when: "Today · 3pm", title: "Linear — system design round" },
  { when: "Tomorrow", title: "Send follow-up note · Vercel" },
  { when: "Friday", title: "Prepare take-home · Supabase" },
];

/**
 * Marketing product preview — always rendered at its full desktop layout.
 * On smaller viewports, the wrapping container (.preview-fit) scales this
 * down proportionally via CSS so it never gets cramped or rewrapped.
 */
export default function ProductPreview() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-[14px] border border-ink-rule bg-paper shadow-[0_36px_80px_-32px_rgba(17,17,16,0.45)]"
      aria-label="Preview of the JobTrack dashboard"
      role="img"
    >
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-ink-rule/70 bg-paper-soft px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        </div>
        <div className="flex items-center gap-2 rounded-full bg-paper px-3 py-1 text-[10.5px] font-medium text-ink-muted ring-1 ring-ink-rule">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          job-track.app/dashboard
        </div>
        <div className="w-12" />
      </div>

      <div className="grid grid-cols-[148px_1fr] bg-[#f6f5ff]">
        {/* Sidebar */}
        <aside className="border-r border-ink-rule/60 bg-[#0f0f23] p-3 text-white">
          <div className="mb-5 flex items-center gap-2 px-1.5 pt-1">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-paper text-ink">
              <span className="font-serif text-[13px] italic font-bold leading-none">
                J
              </span>
            </div>
            <span className="font-display text-[13px] font-bold tracking-tight">
              JobTrack
            </span>
          </div>

          <nav className="space-y-1 text-[11.5px]">
            <a
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%)" }}
            >
              <LayoutDashboard size={13} /> Dashboard
            </a>
            <a className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-slate-400">
              <ListChecks size={13} /> Applications
            </a>
            <a className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-slate-400">
              <CalendarDays size={13} /> Calendar
            </a>
            <a className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-slate-400">
              <Settings size={13} /> Settings
            </a>
          </nav>

          <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-2.5 text-[10.5px] text-slate-300">
            <p className="font-semibold text-white">Next interview</p>
            <p className="mt-1 leading-snug">Linear · 3:00pm today</p>
          </div>
        </aside>

        {/* Main area */}
        <div className="p-4">
          {/* Topbar */}
          <div className="mb-4 flex items-center justify-between">
            <div className="relative w-44">
              <Search
                size={11}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <div className="h-7 rounded-md border border-slate-200 bg-white pl-7 pr-2 text-[10.5px] leading-7 text-slate-400">
                Search applications
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[10.5px] font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%)" }}
                aria-hidden
              >
                <Plus size={11} /> Add
              </button>
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 ring-1 ring-white" />
            </div>
          </div>

          {/* Stats */}
          <div className="mb-3 grid grid-cols-4 gap-2">
            {STATS.map(({ label, value, icon: Icon, gradient }) => (
              <div
                key={label}
                className="rounded-lg border border-slate-100 bg-white p-2.5 shadow-sm"
              >
                <div
                  className="mb-1.5 flex h-6 w-6 items-center justify-center rounded-md text-white"
                  style={{ background: gradient }}
                >
                  <Icon size={11} />
                </div>
                <p className="text-[9px] font-medium uppercase tracking-wider text-slate-400">
                  {label}
                </p>
                <p className="font-display text-base font-bold leading-tight text-slate-900">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="grid grid-cols-[1.45fr_1fr] gap-2.5">
            {/* Applications card */}
            <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[11px] font-bold text-slate-900">
                  Recent applications
                </p>
                <p className="text-[9.5px] font-semibold text-violet-600">
                  View all
                </p>
              </div>
              <div className="space-y-1.5">
                {APPLICATIONS.map((a) => (
                  <div
                    key={a.company}
                    className="flex items-center gap-2.5 rounded-md border border-slate-100 bg-slate-50/60 px-2 py-1.5"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-[10px] font-bold uppercase text-slate-700 ring-1 ring-slate-200">
                      {a.company.slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10.5px] font-semibold text-slate-900">
                        {a.company}
                      </p>
                      <p className="truncate text-[9.5px] text-slate-500">
                        {a.role}
                      </p>
                    </div>
                    <span
                      className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-semibold ring-1 ${a.tone}`}
                    >
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming card */}
            <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
              <p className="mb-2 text-[11px] font-bold text-slate-900">
                Upcoming
              </p>
              <div className="space-y-2">
                {UPCOMING.map((u) => (
                  <div key={u.title} className="flex items-start gap-2">
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-violet-50 text-violet-600">
                      <CalendarDays size={10} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9.5px] font-semibold uppercase tracking-wider text-violet-600">
                        {u.when}
                      </p>
                      <p className="text-[10.5px] leading-tight text-slate-700">
                        {u.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-md border border-dashed border-slate-200 bg-slate-50/60 p-2 text-[9.5px] text-slate-500">
                Add a note for the next conversation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
