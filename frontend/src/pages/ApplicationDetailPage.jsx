import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getJobApplications } from "../api/JobApplications";
import { STAGE_META } from "../constants/statuses";
import AppShell from "../components/layout/AppShell";
import TopBar from "../components/layout/TopBar";
import {
  ChevronLeft, ChevronDown, Star, Link as LinkIcon,
  Plus, Check, ExternalLink,
} from "lucide-react";

const fmtDate = (d, opts = { month: "short", day: "numeric", year: "numeric" }) =>
  d && d !== "TBD" ? new Date(d).toLocaleDateString("en-US", opts) : "TBD";

const STAGE_STEPS = [
  { key: "applied",   label: "Applied" },
  { key: "interview", label: "Interview" },
  { key: "offer",     label: "Offer" },
  { key: "done",      label: "Decision" },
];

function StageTracker({ stage }) {
  const stageOrder = ["applied", "interview", "offer"];
  const currentIdx = stageOrder.indexOf(stage);
  const doneIdx = currentIdx >= 0 ? currentIdx : -1;

  return (
    <div className="card">
      <div className="card-head">
        <h3><span className="lbl">A</span> Stage tracker</h3>
        <span className="t-mono">{doneIdx + 1} of {STAGE_STEPS.length} steps</span>
      </div>
      <div className="stage-tracker">
        <div
          className="stage-track-line"
          style={{ left: "12.5%", right: "12.5%" }}
        />
        <div
          className="stage-track-fill"
          style={{
            left: "12.5%",
            width: doneIdx >= 0 ? `${((doneIdx + 0.5) / STAGE_STEPS.length) * 75}%` : "0%",
          }}
        />
        {STAGE_STEPS.map((step, i) => {
          const done = i <= doneIdx;
          const current = i === doneIdx;
          return (
            <div key={step.key} className="stage-step">
              <div
                className={`stage-step-circle${done ? " done" : ""}${current ? " current" : ""}`}
              >
                {i < doneIdx ? <Check size={14} strokeWidth={2.5} /> : i + 1}
              </div>
              <div className="stage-step-label">{step.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Timeline({ stage }) {
  const events = [
    { title: "Applied", date: null, note: "Application submitted.", done: true },
    { title: "Recruiter screen", date: null, note: "Awaiting contact from recruiter.", done: stage !== "applied" },
    { title: "Interviews", date: null, note: stage === "interview" ? "Interview stage — prepare thoroughly." : "Not yet scheduled.", current: stage === "interview" },
    { title: "Offer / Decision", date: null, note: stage === "offer" ? "Offer received. Review carefully." : "Awaiting outcome.", pending: stage !== "offer" },
  ];

  return (
    <div className="card">
      <div className="card-head">
        <h3><span className="lbl">B</span> Timeline</h3>
        <button className="chip" style={{ gap: 5 }}>
          <Plus size={11} /> Add event
        </button>
      </div>
      <div className="timeline">
        {events.map((e, i) => (
          <div className="tl-row" key={i}>
            <div className={`tl-mark${e.done ? " done" : e.current ? " current" : ""}`} />
            <div className="tl-body">
              <div className="ttl">{e.title}</div>
              {e.date && <div className="date">{fmtDate(e.date, { weekday: "short", month: "short", day: "numeric" })}</div>}
              <div className="note">{e.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Notes({ app }) {
  const [note, setNote] = useState("");
  return (
    <div className="card">
      <div className="card-head">
        <h3><span className="lbl">C</span> Notes</h3>
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.65, color: "var(--ink-2)" }}>
        {app.notes ? (
          <p style={{ margin: 0 }}>{app.notes}</p>
        ) : (
          <p style={{ margin: 0, fontStyle: "italic", color: "var(--muted)" }}>No notes yet.</p>
        )}
      </div>
      <div className="note-composer">
        <div className="note-avatar">
          {(app.name ?? "?").charAt(0).toUpperCase()}
        </div>
        <input
          className="note-input"
          placeholder="Add a note…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button className="btn btn-dark btn-sm" disabled={!note.trim()} onClick={() => setNote("")}>
          Save
        </button>
      </div>
    </div>
  );
}

function DetailSide({ app }) {
  const meta = STAGE_META[app.stage] ?? STAGE_META.applied;
  return (
    <>
      {/* Details */}
      <div className="card">
        <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 500 }}>Details</h3>
        <div className="meta-list">
          {app.salary && (
            <div className="meta-row">
              <span className="k">Salary</span>
              <span className="v">{app.salary}</span>
            </div>
          )}
          {app.location && (
            <div className="meta-row">
              <span className="k">Location</span>
              <span className="v">{app.location}</span>
            </div>
          )}
          {app.source && (
            <div className="meta-row">
              <span className="k">Source</span>
              <span className="v">{app.source}</span>
            </div>
          )}
          <div className="meta-row">
            <span className="k">Stage</span>
            <span className="v">
              <span className={`pill ${app.stage}`} aria-label={meta.label}>
                <span className="pdot" />
                {meta.label}
              </span>
            </span>
          </div>
          <div className="meta-row">
            <span className="k">Applied</span>
            <span className="v t-mono" style={{ fontSize: 12 }}>
              {fmtDate(app.applied)}
            </span>
          </div>
        </div>
      </div>

      {/* Resume sent */}
      {app.resumeVersion && (
        <div className="card">
          <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 500 }}>Resume sent</h3>
          <div className="resume-card">
            <div className="ricon">PDF</div>
            <div className="rmeta">
              <div className="name">{app.resumeVersion}</div>
              <div className="sub">Most recent version</div>
            </div>
            <button className="iconbtn" aria-label="Open resume"><ExternalLink size={14} /></button>
          </div>
        </div>
      )}

      {/* Next reminder — dark card */}
      <div className="card" style={{ background: "var(--ink)", borderColor: "var(--ink)", color: "var(--paper)" }}>
        <h3 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 500, color: "var(--accent)" }}>
          Next reminder
        </h3>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>
          {app.stage === "interview" ? "Prep interview" : "Follow up"}
        </div>
        <div style={{ marginTop: 6, fontSize: 13, color: "color-mix(in oklch, var(--paper) 55%, transparent)" }}>
          Set a date to be reminded
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
          <button className="btn btn-primary btn-sm">Snooze</button>
          <button
            className="btn btn-ghost btn-sm"
            style={{ color: "var(--paper)", borderColor: "color-mix(in oklch, var(--paper) 20%, transparent)" }}
          >
            Reschedule
          </button>
        </div>
      </div>
    </>
  );
}

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["apps"],
    queryFn: getJobApplications,
  });

  const app = apps.find((a) => String(a.id) === String(id));

  if (isLoading) return <p style={{ padding: 32, fontStyle: "italic", color: "var(--muted)" }}>Loading…</p>;

  return (
    <AppShell>
      <TopBar crumbs={["Workspace", "Applications", app?.role ?? id]} onAdd={null} />

      <div className="content page-enter">
        <button className="detail-back" onClick={() => navigate("/applications")}>
          <ChevronLeft size={12} strokeWidth={1.6} />
          Back to applications
        </button>

        {app ? (
          <>
            {/* Header */}
            <div className="detail-head">
              <div
                className="logo logo-lg"
                style={{ background: app.color }}
                aria-hidden="true"
              >
                {app.logo}
              </div>
              <div style={{ flex: 1 }}>
                <h1>{app.role}</h1>
                <div className="co">{app.name}{app.location ? ` · ${app.location}` : ""}</div>
                <div style={{ marginTop: 14, display: "flex", gap: 8, alignItems: "center" }}>
                  <span className={`pill ${app.stage}`} aria-label={(STAGE_META[app.stage] ?? STAGE_META.applied).label}>
                    <span className="pdot" />
                    {(STAGE_META[app.stage] ?? STAGE_META.applied).label}
                  </span>
                  <span className="t-mono" style={{ fontSize: 11 }}>
                    Applied {fmtDate(app.applied)}
                  </span>
                </div>
              </div>
              <div className="actions">
                <button className="chip" style={{ gap: 6 }}><Star size={13} /> Star</button>
                {app.applicationLink && (
                  <a
                    href={app.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chip"
                    style={{ gap: 6 }}
                  >
                    <LinkIcon size={13} /> Job posting
                  </a>
                )}
                <button className="btn btn-ghost btn-sm" style={{ gap: 5 }}>
                  Move stage <ChevronDown size={12} />
                </button>
                <button className="btn btn-dark btn-sm" style={{ gap: 5 }}>
                  Log activity <Plus size={13} />
                </button>
              </div>
            </div>

            {/* Main grid */}
            <div className="detail-grid">
              <div className="detail-main">
                <StageTracker stage={app.stage} />
                <Timeline stage={app.stage} />
                <Notes app={app} />
              </div>
              <div className="detail-side">
                <DetailSide app={app} />
              </div>
            </div>
          </>
        ) : (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <p style={{ color: "var(--muted)", fontStyle: "italic", marginBottom: 16 }}>Application not found.</p>
            <button className="btn btn-dark btn-sm" onClick={() => navigate("/applications")}>
              Back to applications
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
