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
  const total = payload[0].value;
  return (
    <div
      className="pointer-events-none rounded-xl px-3 py-2 text-xs shadow-xl"
      style={{ background: "#111110", color: "#f5f0e6" }}
    >
      <p className="mb-0.5 font-semibold">{label}</p>
      <p style={{ color: "#fdba74" }}>
        {total} {total === 1 ? "application" : "applications"} total
      </p>
    </div>
  );
};

/**
 * Build a cumulative-progress series from real `dateApplied` values.
 *
 * - Filters out missing / invalid dates.
 * - Groups by local calendar day (YYYY-MM-DD) so two applications on the same
 *   day collapse into one data point, and so the same "Mar 5" in different
 *   years never collide.
 * - Adds a baseline 0 the day before the first application so even a single
 *   data point renders as an upward curve instead of a lone dot.
 * - Switches to `Mar 5 '25` formatting when the data spans multiple years.
 */
function buildChartData(applications) {
  const dates = applications
    .map((a) => new Date(a.dateApplied))
    .filter((d) => !Number.isNaN(d.getTime()))
    .sort((a, b) => a - b);

  if (!dates.length) return [];

  const byDay = new Map();
  for (const d of dates) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    byDay.set(key, (byDay.get(key) ?? 0) + 1);
  }

  const firstYear = dates[0].getFullYear();
  const lastYear = dates[dates.length - 1].getFullYear();
  const showYear = firstYear !== lastYear;

  const fmt = (d) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      ...(showYear ? { year: "2-digit" } : {}),
    });

  const fromKey = (key) => {
    const [y, m, day] = key.split("-").map(Number);
    return new Date(y, m - 1, day);
  };

  const sortedKeys = [...byDay.keys()].sort();

  // Baseline: 0 on the day before the first application
  const firstDate = fromKey(sortedKeys[0]);
  const baseline = new Date(firstDate);
  baseline.setDate(firstDate.getDate() - 1);

  const data = [{ label: fmt(baseline), count: 0 }];

  let cumulative = 0;
  for (const key of sortedKeys) {
    cumulative += byDay.get(key);
    data.push({ label: fmt(fromKey(key)), count: cumulative });
  }

  return data;
}

export default function ProgressChart({ applications }) {
  const data = buildChartData(applications);
  const isEmpty = data.length === 0;
  // Hide the small data dots when the timeline gets dense — keeps the curve clean.
  const showDots = !isEmpty && data.length <= 12;

  return (
    <div className="card flex h-full flex-col p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Trend
          </p>
          <h2 className="font-display text-[16px] font-bold leading-tight tracking-tight text-ink sm:text-[17px]">
            Application{" "}
            <span className="font-serif italic font-normal text-clay">
              progress
            </span>
          </h2>
        </div>
        <span className="flex-shrink-0 rounded-full border border-ink-rule bg-paper/60 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-ink-muted">
          {isEmpty ? "Empty" : "Cumulative"}
        </span>
      </div>

      <div className="flex-1">
        {isEmpty ? (
          <div className="flex h-[190px] flex-col items-center justify-center px-4 text-center">
            <p className="font-serif text-[18px] italic text-ink-muted">
              No applications yet.
            </p>
            <p className="mt-1 text-[12.5px] text-ink-muted">
              Your progress curve will appear here after you add one.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart
              data={data}
              margin={{ top: 5, right: 5, bottom: 0, left: -22 }}
            >
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
                minTickGap={20}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#6e6a5d" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                width={28}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#c2410c"
                strokeWidth={2.5}
                fill="url(#areaGrad)"
                dot={
                  showDots
                    ? { r: 3, fill: "#c2410c", stroke: "#fff", strokeWidth: 2 }
                    : false
                }
                activeDot={{
                  r: 5,
                  fill: "#c2410c",
                  stroke: "#fff",
                  strokeWidth: 2.5,
                }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
