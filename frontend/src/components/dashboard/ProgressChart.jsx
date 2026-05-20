import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="pointer-events-none rounded-xl px-3 py-2 text-xs shadow-xl"
      style={{ background: "#111110", color: "#f5f0e6" }}
    >
      <p className="mb-0.5 font-semibold">{label}</p>
      <p style={{ color: "#fdba74" }}>{payload[0].value} Applications</p>
    </div>
  );
};

function buildChartData(applications) {
  if (!applications.length) return [];
  const sorted = [...applications].sort(
    (a, b) => new Date(a.dateApplied) - new Date(b.dateApplied),
  );
  const byWeek = {};
  sorted.forEach((app) => {
    const d = new Date(app.dateApplied);
    const mon = new Date(d);
    mon.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    const key = mon.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    byWeek[key] = (byWeek[key] ?? 0) + 1;
  });
  let cumulative = 0;
  return Object.entries(byWeek).map(([label, count]) => {
    cumulative += count;
    return { label, count: cumulative };
  });
}

export default function ProgressChart({ applications }) {
  const data = buildChartData(applications);
  return (
    <div className="card flex h-full flex-col p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Trend
          </p>
          <h2 className="font-display text-[17px] font-bold leading-tight tracking-tight text-ink">
            Application{" "}
            <span className="font-serif italic font-normal text-clay">
              progress
            </span>
          </h2>
        </div>
        <span className="rounded-full border border-ink-rule bg-paper/60 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-ink-muted">
          All time
        </span>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height={190}>
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -22 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c2410c" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#c2410c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#ebe4d2"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#6e6a5d" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#6e6a5d" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#c2410c"
              strokeWidth={2.5}
              fill="url(#areaGrad)"
              dot={{ r: 3.5, fill: "#c2410c", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{
                r: 5,
                fill: "#c2410c",
                stroke: "#fff",
                strokeWidth: 2.5,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
