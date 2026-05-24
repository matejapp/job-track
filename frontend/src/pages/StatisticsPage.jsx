import { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import AppShell from "../components/layout/AppShell";
import TopBar from "../components/layout/TopBar";
import { getJobApplications } from "../api/JobApplications";
import { STAGE_META, funnelCounts } from "../constants/statuses";

const HEATMAP_WEEKS = 26;
const HEATMAP_DAYS  = 7;

function buildHeatmap(apps) {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - HEATMAP_WEEKS * 7 + 1);

  const byDate = {};
  apps.forEach((a) => {
    if (!a.applied) return;
    const k = a.applied.slice(0, 10);
    byDate[k] = (byDate[k] || 0) + 1;
  });

  const cells = [];
  for (let i = 0; i < HEATMAP_WEEKS * HEATMAP_DAYS; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const count = byDate[key] || 0;
    cells.push(count > 3 ? 4 : count);
  }
  return cells;
}

function buildTrend(apps) {
  const WEEKS = 8;
  const today = new Date();
  const points = [];
  for (let w = WEEKS; w >= 0; w--) {
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() - w * 7);
    const count = apps.filter((a) => a.applied && new Date(a.applied) <= cutoff).length;
    points.push(count);
  }
  return points;
}

function TrendChart({ data }) {
  const max = Math.max(...data, 1);
  const W = 800, H = 200;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - (v / max) * (H - 20)}`);
  const linePts = pts.join(" ");
  const areaPts = `0,${H} ${linePts} ${W},${H}`;
  const labels = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (4 - i) * 14);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  return (
    <svg viewBox={`0 0 ${W} ${H + 20}`} style={{ width: "100%", height: 220 }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1="0" x2={W} y1={(i / 4) * (H - 20)} y2={(i / 4) * (H - 20)}
          stroke="var(--line)" strokeDasharray="3 3" />
      ))}
      <polygon points={areaPts} fill="url(#areaGrad)" />
      <polyline points={linePts} fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
      {pts.map((p, i) => {
        const [x, y] = p.split(",");
        return <circle key={i} cx={x} cy={y} r="4" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />;
      })}
      {labels.map((m, i) => (
        <text key={i} x={(i / 4) * W} y={H + 14} fill="var(--muted)" fontSize="10"
          fontFamily="var(--mono)" textAnchor={i === 0 ? "start" : i === 4 ? "end" : "middle"}>
          {m}
        </text>
      ))}
    </svg>
  );
}

export default function StatisticsPage() {
  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["apps"],
    queryFn: getJobApplications,
  });

  const counts   = useMemo(() => funnelCounts(apps), [apps]);
  const total    = apps.length;
  const heatmap  = useMemo(() => buildHeatmap(apps), [apps]);
  const trend    = useMemo(() => buildTrend(apps), [apps]);

  const responded = (counts.interview + counts.offer + counts.rejected) || 0;
  const responseRate  = total > 0 ? Math.round((responded / total) * 100) : 0;
  const interviewRate = total > 0 ? Math.round(((counts.interview + counts.offer) / total) * 100) : 0;

  // Source breakdown from stage distribution
  const funnelSteps = [
    { stage: "Applied",   count: total,                              color: "var(--ink)" },
    { stage: "Responded", count: responded,                          color: "var(--st-applied)" },
    { stage: "Interview", count: counts.interview + counts.offer,    color: "var(--st-interview)" },
    { stage: "Offer",     count: counts.offer,                       color: "var(--st-offer)" },
  ];

  const HEATMAP_MONTHS = (() => {
    const labels = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      labels.push(d.toLocaleString("en", { month: "short" }));
    }
    return labels;
  })();

  if (isLoading) return <p style={{ padding: 32, fontStyle: "italic", color: "var(--muted)" }}>Loading…</p>;

  return (
    <AppShell>
      <TopBar crumbs={["Workspace", "Statistics"]} />

      <div className="content page-enter">
        <div className="content-head">
          <div className="eyebrow">— Insights · Last 90 days</div>
          <h1>Statistics</h1>
          <p>Where you're applying, where you're getting traction, what's stalled.</p>
        </div>

        {/* Top KPIs */}
        <div className="stat-row" style={{ marginBottom: 0 }}>
          <div className="stat-card">
            <div className="label">Response rate</div>
            <div className="v">{responseRate}<span className="unit">%</span></div>
            <div className="sub">{responded} of {total} responded</div>
          </div>
          <div className="stat-card">
            <div className="label">Interview rate</div>
            <div className="v">{interviewRate}<span className="unit">%</span></div>
            <div className="sub">{counts.interview + counts.offer} reached interview</div>
          </div>
          <div className="stat-card">
            <div className="label">Active applications</div>
            <div className="v">{counts.applied + counts.interview}<span className="unit" style={{ fontSize: 14 }}></span></div>
            <div className="sub">{counts.interview} in interview stage</div>
          </div>
          <div className="stat-card" style={{ background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" }}>
            <div className="label" style={{ color: "var(--accent)" }}>Offers received</div>
            <div className="v">{counts.offer}</div>
            <div className="sub" style={{ color: "color-mix(in oklch, var(--paper) 60%, transparent)" }}>
              {counts.offer > 0 ? "Reply to open offers" : "Keep pushing!"}
            </div>
          </div>
        </div>

        {/* Trend chart */}
        <div className="chart-card">
          <div className="card-head">
            <h3><span className="lbl">01</span> Cumulative applications</h3>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="chip" style={{ gap: 4 }}>8 weeks <ChevronDown size={11} /></button>
            </div>
          </div>
          <TrendChart data={trend} />
        </div>

        {/* Two-column: funnel + stage breakdown */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 0 }}>
          {/* Conversion funnel */}
          <div className="chart-card" style={{ marginTop: 0 }}>
            <div className="card-head">
              <h3><span className="lbl">02</span> Conversion funnel</h3>
              <span className="t-mono">{total} applications</span>
            </div>
            <div style={{ display: "grid", gap: 14, marginTop: 8 }}>
              {funnelSteps.map((s, i) => {
                const pct = total > 0 ? (s.count / total) * 100 : 0;
                return (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                      <span style={{ fontWeight: 500 }}>{s.stage}</span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
                        {s.count} · {pct.toFixed(0)}%
                      </span>
                    </div>
                    <div style={{ height: 26, background: "color-mix(in oklch, var(--ink) 4%, transparent)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${Math.max(pct, s.count > 0 ? 2 : 0)}%`,
                        background: s.color,
                        borderRadius: 4,
                        transition: "width .4s cubic-bezier(.2,.7,.2,1)",
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stage breakdown */}
          <div className="chart-card" style={{ marginTop: 0 }}>
            <div className="card-head">
              <h3><span className="lbl">03</span> By stage</h3>
              <span className="t-mono">all time</span>
            </div>
            <div style={{ display: "grid", gap: 0 }}>
              {Object.entries(STAGE_META).map(([k, m], i) => {
                const c = counts[k] || 0;
                const pct = total > 0 ? (c / total) * 100 : 0;
                return (
                  <div key={k} style={{
                    display: "grid",
                    gridTemplateColumns: "110px 1fr 40px",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 0",
                    borderTop: i ? "1px solid var(--line)" : "0",
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{m.label}</span>
                    <div style={{ position: "relative", height: 22, background: "color-mix(in oklch, var(--ink) 4%, transparent)", borderRadius: 4 }}>
                      <div style={{
                        position: "absolute", inset: "0 auto 0 0",
                        width: `${Math.max(pct, c > 0 ? 3 : 0)}%`,
                        background: m.color,
                        borderRadius: 4,
                        display: "flex", alignItems: "center", justifyContent: "flex-end",
                        paddingRight: 6,
                        fontFamily: "var(--mono)", fontSize: 10,
                        color: "white",
                        transition: "width .4s cubic-bezier(.2,.7,.2,1)",
                      }}>
                        {c > 0 && `${pct.toFixed(0)}%`}
                      </div>
                    </div>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", textAlign: "right" }}>{c}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="chart-card">
          <div className="card-head">
            <h3><span className="lbl">04</span> Activity over time</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--muted)" }}>
              <span style={{ fontFamily: "var(--mono)" }}>Less</span>
              <div style={{ display: "flex", gap: 3 }}>
                {[0, 1, 2, 3, 4].map((v) => (
                  <span key={v} style={{
                    width: 12, height: 12, borderRadius: 3, display: "inline-block",
                    background: v === 0
                      ? "color-mix(in oklch, var(--ink) 4%, transparent)"
                      : `color-mix(in oklch, var(--accent) ${v * 25}%, var(--paper))`,
                  }} />
                ))}
              </div>
              <span style={{ fontFamily: "var(--mono)" }}>More</span>
            </div>
          </div>
          <div className="heatmap">
            {heatmap.map((v, i) => (
              <div key={i} className={`heat-cell${v ? ` heat-${v}` : ""}`} title={v > 0 ? `${v} application${v !== 1 ? "s" : ""}` : ""} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)" }}>
            {HEATMAP_MONTHS.map((m) => <span key={m}>{m}</span>)}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
