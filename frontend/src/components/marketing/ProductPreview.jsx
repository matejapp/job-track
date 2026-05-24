import {
  BarChart2,
  Briefcase,
  CalendarDays,
  LayoutDashboard,
  Plus,
  Settings,
} from "lucide-react";

const APPS = [
  { co: "L", color: "#5B4CF5", company: "Linear",    role: "Sr. Frontend Engineer", stage: "Interview", sc: "#3D3080" },
  { co: "V", color: "#0F0F0F", company: "Vercel",     role: "Product Designer",      stage: "Applied",   sc: "#333"    },
  { co: "S", color: "#1C9B3A", company: "Supabase",   role: "Backend Engineer",      stage: "Offer",     sc: "#145C25" },
  { co: "F", color: "#F24E1E", company: "Figma",      role: "Design Engineer",       stage: "Rejected",  sc: "#8C2D12" },
];

const STAGE_COLORS = {
  Applied:   { bg: "rgba(75,108,183,0.14)",  fg: "#4b6cb7" },
  Interview: { bg: "rgba(192,138,58,0.14)",  fg: "#c08a3a" },
  Offer:     { bg: "rgba(47,125,79,0.14)",   fg: "#2f7d4f" },
  Rejected:  { bg: "rgba(155,74,59,0.14)",   fg: "#9b4a3b" },
};

export default function ProductPreview() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-[14px] border border-[#2a2b22] bg-[#0c0d0a] shadow-[0_36px_80px_-24px_rgba(0,0,0,0.65)]"
      aria-label="Preview of the JobTrack dashboard"
      role="img"
    >
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-[#1e1f16] bg-[#101109] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/[0.06] px-3 py-1 text-[10.5px] font-medium text-white/35 ring-1 ring-white/[0.08]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c8ff2e]" />
          job-track.app/dashboard
        </div>
        <div className="w-12" />
      </div>

      <div className="grid grid-cols-[148px_1fr]">
        {/* Sidebar */}
        <aside className="border-r border-[#1e1f16] bg-[#0c0d0a] p-3">
          <div className="mb-5 flex items-center gap-2 px-1.5 pt-1">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-[5px] bg-[#16170e] font-mono text-[12px] font-bold text-[#c8ff2e]">
              j
            </div>
            <span className="text-[13px] font-semibold tracking-tight text-[#f1eee0]">JobTrack</span>
          </div>

          <nav className="space-y-0.5 text-[11.5px]">
            <div className="flex items-center gap-2 rounded-[8px] bg-[#f1eee0] px-2.5 py-2 font-semibold text-[#0c0d0a]">
              <LayoutDashboard size={13} /> Dashboard
            </div>
            <div className="flex items-center gap-2 rounded-[8px] px-2.5 py-2 text-[#8b897a]">
              <Briefcase size={13} /> Applications
              <span className="ml-auto font-mono text-[10px] text-[#5a594e]">12</span>
            </div>
            <div className="flex items-center gap-2 rounded-[8px] px-2.5 py-2 text-[#8b897a]">
              <CalendarDays size={13} /> Calendar
            </div>
            <div className="flex items-center gap-2 rounded-[8px] px-2.5 py-2 text-[#8b897a]">
              <BarChart2 size={13} /> Statistics
            </div>
          </nav>

          <div className="mt-5 border-t border-[#1e1f16] pt-4">
            <p className="px-2.5 pb-2 font-mono text-[9px] uppercase tracking-[0.15em] text-[#5a594e]">Library</p>
            {["Documents", "Contacts", "Reminders"].map((l) => (
              <div key={l} className="flex items-center gap-2 rounded-[8px] px-2.5 py-1.5 text-[11px] text-[#5a594e]">
                {l}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-[8px] border border-[#1e1f16] bg-[#16170e] p-2">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#2a2b22] font-mono text-[10px] font-bold text-[#c8ff2e]">
              M
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-medium text-[#f1eee0]">Mateja P.</p>
              <p className="truncate text-[9px] text-[#5a594e]">Free plan</p>
            </div>
            <Settings size={11} className="text-[#5a594e]" />
          </div>
        </aside>

        {/* Main */}
        <div className="bg-[#0c0d0a] p-4">
          {/* Topbar */}
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#8b897a]">
              Workspace &nbsp;/&nbsp; Dashboard
            </span>
            <button
              className="flex items-center gap-1.5 rounded-full bg-[#f1eee0] px-3 py-1.5 text-[10px] font-semibold text-[#0c0d0a]"
              aria-hidden="true"
            >
              <Plus size={10} /> Add application
            </button>
          </div>

          {/* KPI tiles */}
          <div className="mb-3 grid grid-cols-4 gap-2">
            {[
              { label: "Total",      value: 24, variant: "base"  },
              { label: "Active",     value: 11, variant: "ink"   },
              { label: "Interviews", value:  5, variant: "base"  },
              { label: "Offers",     value:  2, variant: "accent"},
            ].map(({ label, value, variant }) => (
              <div
                key={label}
                className="rounded-[10px] p-2.5"
                style={{
                  background: variant === "ink"    ? "#f1eee0"
                            : variant === "accent" ? "#c8ff2e"
                            : "#16170e",
                  border: variant === "base" ? "1px solid #2a2b22" : "none",
                }}
              >
                <p
                  className="font-mono text-[9px] uppercase tracking-wider"
                  style={{ color: variant === "ink" ? "#6d6c66" : variant === "accent" ? "#5a5e20" : "#8b897a" }}
                >
                  {label}
                </p>
                <p
                  className="text-xl font-bold tabular-nums leading-tight"
                  style={{ color: variant === "ink" || variant === "accent" ? "#0c0d0a" : "#f1eee0" }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Applications list */}
          <div className="rounded-[10px] border border-[#2a2b22] bg-[#16170e]">
            <div className="flex items-center justify-between border-b border-[#2a2b22] px-3 py-2">
              <p className="text-[11px] font-semibold text-[#f1eee0]">Recent applications</p>
              <p className="text-[9.5px] font-semibold text-[#c8ff2e]">View all →</p>
            </div>
            <div className="divide-y divide-[#1a1b12]">
              {APPS.map((a) => {
                const s = STAGE_COLORS[a.stage] || STAGE_COLORS.Applied;
                return (
                  <div key={a.company} className="flex items-center gap-2.5 px-3 py-2">
                    <div
                      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-[5px] font-mono text-[10px] font-bold text-white"
                      style={{ background: a.color }}
                    >
                      {a.co}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10.5px] font-semibold text-[#f1eee0]">{a.company}</p>
                      <p className="truncate text-[9.5px] text-[#8b897a]">{a.role}</p>
                    </div>
                    <span
                      className="whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-semibold"
                      style={{ background: s.bg, color: s.fg }}
                    >
                      {a.stage}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
