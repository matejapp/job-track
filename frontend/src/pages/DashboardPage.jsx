import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Plus, ChevronDown, ArrowRight } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import TopBar from "../components/layout/TopBar";
import ApplicationModal from "../components/modals/ApplicationModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addApplication, getJobApplications } from "../api/JobApplications";
import { toastSuccess, toastError, toastInfo } from "../Utils/ToastUtils";
import { STAGE_META, funnelCounts } from "../constants/statuses";
import { useAuth } from "../../context/AuthContext";

const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function todayLabel() {
  const d = new Date();
  return `— ${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()} · ${d.getFullYear()}`;
}

const Sparkline = ({ data, color = "var(--ink)" }) => {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${36 - (v / max) * 32}`).join(" ");
  return (
    <svg viewBox="0 0 100 36" preserveAspectRatio="none" className="kpi-spark" aria-hidden="true">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
};

const DEFAULT_TODOS = [
  { text: "Follow up with pending applications",   meta: "Today",    done: false },
  { text: "Update resume with latest projects",    meta: "This week", done: false },
  { text: "Prep questions for upcoming interviews", meta: "Ongoing",  done: false },
  { text: "Research target companies",             meta: "Ongoing",  done: true  },
];

function Todos() {
  const [items, setItems] = useState(DEFAULT_TODOS);
  const toggle = (i) => setItems(items.map((t, ix) => ix === i ? { ...t, done: !t.done } : t));
  return (
    <div>
      {items.map((t, i) => (
        <div key={i} className={`todo-row${t.done ? " is-done" : ""}`}>
          <div
            className={`todo-check${t.done ? " is-done" : ""}`}
            onClick={() => toggle(i)}
            role="checkbox"
            aria-checked={t.done}
            tabIndex={0}
            onKeyDown={(e) => e.key === " " && toggle(i)}
          >
            {t.done && <Check size={10} strokeWidth={3} />}
          </div>
          <span>{t.text}</span>
          <span className="todo-meta">{t.meta}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: apps = [], isLoading, error } = useQuery({
    queryKey: ["apps"],
    queryFn: getJobApplications,
    refetchOnWindowFocus: "always",
  });

  const addMutation = useMutation({
    mutationFn: addApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      toastSuccess("Application added");
      setModalOpen(false);
    },
    onError: (err) => toastError(err.message),
    onMutate: () => toastInfo("Adding application..."),
  });

  if (isLoading) return <p style={{ padding: 32, fontStyle: "italic", color: "var(--muted)" }}>Loading…</p>;
  if (error)     return <p style={{ padding: 32, color: "#9b4a3b" }}>{error.message}</p>;

  const counts  = funnelCounts(apps);
  const total   = apps.length;
  const inProg  = counts.applied + counts.interview;
  const userName = user?.name ?? user?.email?.split("@")[0] ?? "there";

  const recentApps = [...apps]
    .sort((a, b) => new Date(b.applied) - new Date(a.applied))
    .slice(0, 6);

  const sparkData = (() => {
    const week = Array.from({ length: 10 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (9 - i));
      const s = d.toISOString().slice(0, 10);
      return apps.filter((a) => a.applied && a.applied.slice(0, 10) <= s).length;
    });
    return week;
  })();

  return (
    <AppShell>
      <TopBar crumbs={["Workspace", "Dashboard"]} onAdd={() => setModalOpen(true)} />

      <div className="content page-enter">
        <div className="content-head">
          <div className="eyebrow">{todayLabel()}</div>
          <h1>{greeting()}, {userName}.</h1>
          <p>
            You have <strong>{counts.interview} interview{counts.interview !== 1 ? "s" : ""}</strong> in progress
            {" "}and <strong>{inProg} active application{inProg !== 1 ? "s" : ""}</strong>.
            {counts.offer > 0 && <> <strong>{counts.offer} offer</strong> awaiting your reply.</>}
          </p>
        </div>

        <div className="dash-grid">
          {/* KPI tiles */}
          <div className="kpi" style={{ gridColumn: "span 3" }}>
            <div className="kpi-label">Total</div>
            <div className="kpi-value">{total}</div>
            <div className="kpi-delta">
              <span className="up">↗ +{counts.applied}</span> applied
            </div>
            <Sparkline data={sparkData} />
          </div>

          <div className="kpi ink" style={{ gridColumn: "span 3" }}>
            <div className="kpi-label">In progress</div>
            <div className="kpi-value">{inProg}</div>
            <div className="kpi-delta">
              <span style={{ color: "var(--accent)" }}>● </span>
              {counts.interview} in interview
            </div>
            <Sparkline data={sparkData.map((v, i) => Math.max(0, v - i))} color="var(--accent)" />
          </div>

          <div className="kpi" style={{ gridColumn: "span 3" }}>
            <div className="kpi-label">Interviews</div>
            <div className="kpi-value">{counts.interview}</div>
            <div className="kpi-delta">
              {counts.interview > 0 ? "Active pipeline" : "None scheduled"}
            </div>
            <Sparkline data={Array.from({ length: 10 }, (_, i) => i < 7 ? 0 : counts.interview)} />
          </div>

          <div className="kpi accent" style={{ gridColumn: "span 3" }}>
            <div className="kpi-label">Offers</div>
            <div className="kpi-value">{counts.offer}</div>
            <div className="kpi-delta">
              {counts.offer > 0 ? "Waiting on your reply" : "Keep applying!"}
            </div>
            <Sparkline data={Array.from({ length: 10 }, (_, i) => i < 9 ? 0 : counts.offer)} color="var(--accent-ink)" />
          </div>

          {/* Pipeline funnel */}
          <div className="card pipeline-card">
            <div className="card-head">
              <h3><span className="lbl">02</span> Pipeline overview</h3>
              <div style={{ display: "flex", gap: 4 }}>
                <button className="chip" style={{ gap: 4 }}>All time <ChevronDown size={11} /></button>
              </div>
            </div>
            <div className="funnel">
              {Object.entries(STAGE_META).map(([k, m]) => {
                const c = counts[k] ?? 0;
                const max = Math.max(...Object.values(counts), 1);
                const pct = (c / max) * 100;
                return (
                  <div className="funnel-row" key={k}>
                    <div className="funnel-label">
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: m.color, flexShrink: 0 }} />
                      {m.label}
                    </div>
                    <div className="funnel-bar">
                      <div
                        className="funnel-fill"
                        style={{
                          width: `${Math.max(c > 0 ? pct : 0, c > 0 ? 3 : 0)}%`,
                          background: c > 0 ? m.color : "transparent",
                          color: "white",
                        }}
                      >
                        {c > 0 && total > 0 && `${Math.round((c / total) * 100)}%`}
                      </div>
                    </div>
                    <div className="funnel-count">{c}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Up next */}
          <div className="card next-card">
            <div className="card-head">
              <h3><span className="lbl">03</span> Up next</h3>
              <button className="chip" style={{ gap: 5 }} onClick={() => navigate("/calendar")}>
                View all <ArrowRight size={11} />
              </button>
            </div>
            {counts.interview > 0 || counts.offer > 0 ? (
              <div className="upcoming">
                {apps
                  .filter((a) => ["interview", "offer"].includes(a.stage))
                  .slice(0, 4)
                  .map((a, i) => {
                    const date = new Date(a.applied);
                    return (
                      <div
                        className="upcoming-item"
                        key={a.id}
                        onClick={() => navigate(`/applications/${a.id}`)}
                      >
                        <div className="up-date">
                          <span className="d">{date.getDate()}</span>
                          <span className="m">{date.toLocaleString("en", { month: "short" })}</span>
                        </div>
                        <div className="up-body">
                          <div className="title">{a.role} · {a.name}</div>
                          <div className="sub">
                            <span className={`pill ${a.stage}`} style={{ height: 18, fontSize: 10, padding: "0 7px" }}>
                              <span className="pdot" />{(STAGE_META[a.stage] ?? STAGE_META.applied).label}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div style={{ padding: "20px 0", textAlign: "center", color: "var(--muted)", fontSize: 13, fontStyle: "italic" }}>
                No upcoming events
              </div>
            )}
          </div>

          {/* Recent activity */}
          <div className="card activity-card">
            <div className="card-head">
              <h3><span className="lbl">04</span> Recent applications</h3>
              <button className="chip" onClick={() => navigate("/applications")} style={{ gap: 5 }}>
                View all <ArrowRight size={11} />
              </button>
            </div>
            <div className="feed">
              {recentApps.length > 0 ? recentApps.map((a) => (
                <div
                  className="feed-item"
                  key={a.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/applications/${a.id}`)}
                >
                  <span className="feed-dot" style={{ background: STAGE_META[a.stage]?.color ?? "var(--muted)" }} />
                  <div className="feed-body">
                    Applied to <strong>{a.name}</strong> — {a.role}
                  </div>
                  <span className="feed-time">
                    {a.applied ? new Date(a.applied).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                  </span>
                </div>
              )) : (
                <div style={{ padding: "20px 0", color: "var(--muted)", fontSize: 13, fontStyle: "italic", textAlign: "center" }}>
                  No applications yet
                </div>
              )}
            </div>
          </div>

          {/* Todos */}
          <div className="card todo-card">
            <div className="card-head">
              <h3><span className="lbl">05</span> Today's follow-ups</h3>
              <button className="iconbtn" aria-label="Add follow-up"><Plus size={14} /></button>
            </div>
            <Todos />
          </div>
        </div>
      </div>

      <ApplicationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(data) => addMutation.mutate(data)}
      />
    </AppShell>
  );
}
