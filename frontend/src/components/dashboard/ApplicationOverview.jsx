import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { STATUSES } from "../../constants/statuses";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="pointer-events-none rounded-xl border border-ink-rule bg-white px-3 py-2 text-xs shadow-xl">
      <p className="font-bold text-ink">{d.name}</p>
      <p className="text-ink-muted">
        {d.value} apps · {d.payload.pct}%
      </p>
    </div>
  );
};

export default function ApplicationOverview({ applications }) {
  const total = applications.length;

  const data = STATUSES.map((s) => {
    const count = applications.filter((a) => a.status === s.value).length;
    return {
      name: s.label,
      value: count,
      color: s.color,
      pct: total > 0 ? ((count / total) * 100).toFixed(1) : "0.0",
    };
  }).filter((d) => d.value > 0);

  return (
    <div className="card flex h-full flex-col p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Pipeline
          </p>
          <h2 className="font-display text-[17px] font-bold leading-tight tracking-tight text-ink">
            Application{" "}
            <span className="font-serif italic font-normal text-clay">
              overview
            </span>
          </h2>
        </div>
        <span className="rounded-full border border-ink-rule bg-paper/60 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-ink-muted">
          All time
        </span>
      </div>

      <div className="flex flex-1 items-center gap-6">
        <div className="relative flex-shrink-0">
          <ResponsiveContainer width={176} height={176}>
            <PieChart>
              <Pie
                data={
                  data.length
                    ? data
                    : [{ name: "None", value: 1, color: "#ebe4d2" }]
                }
                cx={84}
                cy={84}
                innerRadius={52}
                outerRadius={82}
                dataKey="value"
                strokeWidth={0}
                paddingAngle={data.length > 1 ? 2 : 0}
              >
                {(data.length ? data : [{ color: "#ebe4d2" }]).map(
                  (entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ),
                )}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-bold tabular-nums text-ink">
              {total}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
              Total
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-2.5">
          {STATUSES.map((s) => {
            const count = applications.filter(
              (a) => a.status === s.value,
            ).length;
            const pct =
              total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
            return (
              <div key={s.value} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ background: s.color }}
                />
                <span className="flex-1 text-ink-soft">{s.label}</span>
                <span className="font-bold tabular-nums text-ink">{count}</span>
                <span className="w-11 text-right tabular-nums text-ink-muted">
                  ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
