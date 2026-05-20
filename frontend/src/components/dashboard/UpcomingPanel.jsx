import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const CARD_COLORS = [
  { bg: "linear-gradient(135deg,#7c3aed,#4f46e5)" },
  { bg: "linear-gradient(135deg,#3b82f6,#06b6d4)" },
  { bg: "linear-gradient(135deg,#f97316,#f59e0b)" },
  { bg: "linear-gradient(135deg,#22c55e,#10b981)" },
];
const STATUS_VERB = { Interview: "Interview", Assessment: "Design Challenge" };

function daysLabel(dateStr) {
  const diff = Math.ceil(
    (new Date(dateStr) - new Date(new Date().toDateString())) / 86400000,
  );
  if (diff < 0) return null;
  if (diff === 0)
    return { label: "Today", cls: "bg-clay/15 text-clay ring-1 ring-clay/30" };
  if (diff === 1)
    return {
      label: "Tomorrow",
      cls: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
    };
  return {
    label: `In ${diff} days`,
    cls: "bg-paper-soft text-ink-soft ring-1 ring-ink-rule",
  };
}

export default function UpcomingPanel({ applications }) {
  const upcoming = applications
    .filter((a) => ["Interview", "Assessment"].includes(a.status))
    .sort((a, b) => new Date(a.dateApplied) - new Date(b.dateApplied))
    .slice(0, 4);

  return (
    <div className="card flex h-full flex-col p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
            On the calendar
          </p>
          <h2 className="font-display text-[17px] font-bold leading-tight tracking-tight text-ink">
            Up{" "}
            <span className="font-serif italic font-normal text-clay">
              next
            </span>
          </h2>
        </div>
        <Link
          to="/applications"
          className="text-xs font-semibold text-ink transition-colors hover:text-clay"
        >
          View all
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
              className="flex cursor-default items-center gap-3 rounded-xl border border-ink-rule p-3 transition-all hover:border-clay/40 hover:bg-paper-soft/40"
            >
              <div
                className="flex h-11 w-11 flex-shrink-0 flex-col items-center justify-center rounded-xl text-white"
                style={{ background: col.bg }}
              >
                <span className="text-[9px] font-bold uppercase leading-none text-white/80">
                  {d.toLocaleDateString("en-US", { month: "short" })}
                </span>
                <span className="font-display text-lg font-bold leading-none text-white">
                  {d.getDate()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold leading-tight text-ink">
                  {STATUS_VERB[app.status] ?? app.status} · {app.companyName}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-ink-muted">
                  {app.position}
                </p>
              </div>
              {badge && (
                <span
                  className={`flex-shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${badge.cls}`}
                >
                  {badge.label}
                </span>
              )}
            </div>
          );
        })}
        {upcoming.length === 0 && (
          <p className="py-6 text-center font-serif italic text-ink-muted">
            No upcoming interviews or assessments.
          </p>
        )}
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink-rule py-2.5 text-xs font-medium text-ink-muted transition-colors hover:border-clay hover:text-clay">
        <Plus size={12} />
        Add Reminder
      </button>
    </div>
  );
}
