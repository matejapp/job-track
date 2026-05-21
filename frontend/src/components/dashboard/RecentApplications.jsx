import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Badge from "../ui/Badge";

const PALETTES = [
  "linear-gradient(135deg,#8b5cf6,#4f46e5)",
  "linear-gradient(135deg,#3b82f6,#06b6d4)",
  "linear-gradient(135deg,#f97316,#ec4899)",
  "linear-gradient(135deg,#22c55e,#10b981)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
];

function CompanyAvatar({ name, index }) {
  return (
    <div
      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
      style={{ background: PALETTES[index % PALETTES.length] }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function RecentApplications({ applications }) {
  const recent = [...applications]
    .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
    .slice(0, 5);

  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Latest moves
          </p>
          <h2 className="font-display text-[17px] font-bold leading-tight tracking-tight text-ink">
            Recent{" "}
            <span className="font-serif italic font-normal text-clay">
              applications
            </span>
          </h2>
        </div>
        <Link
          to="/applications"
          className="flex items-center gap-1 text-xs font-semibold text-ink transition-colors hover:text-clay"
        >
          View all <ArrowRight size={11} />
        </Link>
      </div>

      <div className="space-y-0.5">
        {recent.map((app, i) => (
          <Link
            key={app.id}
            to={`/applications?applicationId=${encodeURIComponent(app.id)}`}
            className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-paper-soft/60"
          >
            <CompanyAvatar name={app.companyName} index={i} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-tight text-ink">
                {app.position}
              </p>
              <p className="truncate text-xs text-ink-muted">
                {app.companyName}
              </p>
            </div>
            <Badge status={app.status} />
            <span className="hidden flex-shrink-0 text-[11px] tabular-nums text-ink-muted sm:ml-1 sm:inline">
              {new Date(app.dateApplied).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <ArrowRight
              size={13}
              className="hidden flex-shrink-0 text-ink-rule transition-colors group-hover:text-clay sm:inline"
            />
          </Link>
        ))}
        {recent.length === 0 && (
          <p className="py-10 text-center font-serif italic text-ink-muted">
            No applications yet. Add one above.
          </p>
        )}
      </div>
    </div>
  );
}
