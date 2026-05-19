import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const CARD_COLORS = [
  { bg: "#7c3aed" },
  { bg: "#3b82f6" },
  { bg: "#f97316" },
  { bg: "#22c55e" },
];
const STATUS_VERB = { Interview: "Interview", Assessment: "Design Challenge" };

function daysLabel(dateStr) {
  const diff = Math.ceil(
    (new Date(dateStr) - new Date(new Date().toDateString())) / 86400000,
  );
  if (diff < 0) return null;
  if (diff === 0)
    return { label: "Today", cls: "bg-violet-100 text-violet-700" };
  if (diff === 1)
    return { label: "Tomorrow", cls: "bg-orange-100 text-orange-700" };
  return { label: `In ${diff} days`, cls: "bg-slate-100 text-slate-500" };
}

export default function UpcomingPanel({ applications }) {
  const upcoming = applications
    .filter((a) => ["Interview", "Assessment"].includes(a.status))
    .sort((a, b) => new Date(a.dateApplied) - new Date(b.dateApplied))
    .slice(0, 4);

  return (
    <div className="card p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-slate-900 text-base">
          Upcoming
        </h2>
        <Link
          to="/applications"
          className="text-xs text-accent font-semibold hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="flex-1 space-y-2.5">
        {upcoming.map((app, i) => {
          const d = new Date(app.dateApplied);
          const badge = daysLabel(app.dateApplied);
          const col = CARD_COLORS[i % CARD_COLORS.length];
          return (
            <div
              key={app.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-accent-subtle transition-all cursor-default"
            >
              <div
                className="w-11 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                style={{ background: col.bg }}
              >
                <span className="text-[9px] font-bold uppercase leading-none text-white/80">
                  {d.toLocaleDateString("en-US", { month: "short" })}
                </span>
                <span className="font-display text-lg font-bold leading-none text-white">
                  {d.getDate()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                  {STATUS_VERB[app.status] ?? app.status} · {app.companyName}
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {app.position}
                </p>
              </div>
              {badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${badge.cls}`}
                >
                  {badge.label}
                </span>
              )}
            </div>
          );
        })}
        {upcoming.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-6">
            No upcoming interviews or assessments
          </p>
        )}
      </div>

      <button className="mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 hover:border-violet-300 hover:text-violet-500 transition-colors">
        <Plus size={12} />
        Add Reminder
      </button>
    </div>
  );
}
