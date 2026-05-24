import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft, ChevronDown, Star, Link as LinkIcon,
  Plus, Check, ExternalLink, Pencil, Trash2,
} from "lucide-react";
import AppShell from "../components/layout/AppShell";
import TopBar from "../components/layout/TopBar";
import ApplicationModal from "../components/modals/ApplicationModal";
import { getJobApplications, updateApplication, deleteApplication } from "../api/JobApplications";
import { STAGE_META, STAGES } from "../constants/statuses";
import { toastSuccess, toastError, toastInfo } from "../Utils/ToastUtils";

const fmtDate = (d, opts = { month: "short", day: "numeric", year: "numeric" }) =>
  d && d !== "TBD" ? new Date(d).toLocaleDateString("en-US", opts) : "—";

const STAGE_STEPS = [
  { key: "applied",   label: "Applied"   },
  { key: "interview", label: "Interview" },
  { key: "offer",     label: "Offer"     },
  { key: "done",      label: "Decision"  },
];

// ─── Build PUT payload from normalized app ────────────────────────────────────
function buildForm(app, overrides = {}) {
  return {
    companyName:     app.companyName     ?? "",
    position:        app.position        ?? "",
    applicationLink: app.applicationLink ?? "",
    status:          app.status          ?? "Applied",
    description:     app.description     ?? "",
    dateApplied:     app.dateApplied
                       ? app.dateApplied.slice(0, 10)
                       : new Date().toISOString().slice(0, 10),
    ...overrides,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StageTracker({ stage }) {
  const stageOrder = ["applied", "interview", "offer"];
  const currentIdx = stageOrder.indexOf(stage);

  return (
    <div className="card">
      <div className="card-head">
        <h3><span className="lbl">A</span> Stage tracker</h3>
        <span className="t-mono">{Math.max(currentIdx + 1, 0)} of {STAGE_STEPS.length} steps</span>
      </div>
      <div className="stage-tracker">
        <div className="stage-track-line" style={{ left: "12.5%", right: "12.5%" }} />
        <div
          className="stage-track-fill"
          style={{
            left: "12.5%",
            width: currentIdx >= 0 ? `${((currentIdx + 0.5) / STAGE_STEPS.length) * 75}%` : "0%",
          }}
        />
        {STAGE_STEPS.map((step, i) => {
          const done    = i <= currentIdx;
          const current = i === currentIdx;
          return (
            <div key={step.key} className="stage-step">
              <div className={`stage-step-circle${done ? " done" : ""}${current ? " current" : ""}`}>
                {i < currentIdx ? <Check size={14} strokeWidth={2.5} /> : i + 1}
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
    { title: "Applied",          done: true,                     note: "Application submitted." },
    { title: "Recruiter screen", done: stage !== "applied",      note: stage !== "applied" ? "Recruiter contact made." : "Awaiting recruiter contact." },
    { title: "Interviews",       current: stage === "interview", note: stage === "interview" ? "Interview stage — prepare thoroughly." : stage === "offer" ? "Completed." : "Not yet scheduled." },
    { title: "Offer / Decision", current: stage === "offer",     note: stage === "offer" ? "Offer received. Review carefully." : "Awaiting outcome.", pending: !["offer"].includes(stage) },
  ];

  return (
    <div className="card">
      <div className="card-head">
        <h3><span className="lbl">B</span> Timeline</h3>
      </div>
      <div className="timeline">
        {events.map((e, i) => (
          <div className="tl-row" key={i}>
            <div className={`tl-mark${e.done ? " done" : e.current ? " current" : ""}`} />
            <div className="tl-body">
              <div className="ttl">{e.title}</div>
              <div className="note">{e.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Notes({ app, onSave, pending }) {
  const [text, setText] = useState("");

  const handleSave = () => {
    if (!text.trim()) return;
    const combined = app.notes
      ? `${app.notes.trim()}\n\n${text.trim()}`
      : text.trim();
    onSave(combined);
    setText("");
  };

  return (
    <div className="card">
      <div className="card-head">
        <h3><span className="lbl">C</span> Notes</h3>
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.65, color: "var(--ink-2)", whiteSpace: "pre-wrap" }}>
        {app.notes
          ? <p style={{ margin: 0 }}>{app.notes}</p>
          : <p style={{ margin: 0, fontStyle: "italic", color: "var(--muted)" }}>No notes yet.</p>
        }
      </div>
      <div className="note-composer">
        <div className="note-avatar">{(app.name ?? "?").charAt(0).toUpperCase()}</div>
        <input
          className="note-input"
          placeholder="Add a note…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSave(); } }}
        />
        <button
          className="btn btn-dark btn-sm"
          disabled={!text.trim() || pending}
          onClick={handleSave}
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

function DetailSide({ app }) {
  const meta = STAGE_META[app.stage] ?? STAGE_META.applied;
  return (
    <>
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
                <span className="pdot" />{meta.label}
              </span>
            </span>
          </div>
          <div className="meta-row">
            <span className="k">Applied</span>
            <span className="v t-mono" style={{ fontSize: 12 }}>{fmtDate(app.applied)}</span>
          </div>
        </div>
      </div>

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
    </>
  );
}

// ─── Move-stage dropdown ──────────────────────────────────────────────────────
function MoveStageDropdown({ currentStage, onMove, pending }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        className="btn btn-ghost btn-sm"
        style={{ gap: 5 }}
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
      >
        Move stage <ChevronDown size={12} />
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div
            style={{ position: "fixed", inset: 0, zIndex: 9 }}
            onClick={() => setOpen(false)}
          />
          {/* menu */}
          <div style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            zIndex: 10,
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "var(--r-md)",
            boxShadow: "0 8px 24px -8px rgba(0,0,0,0.28)",
            minWidth: 160,
            overflow: "hidden",
          }}>
            {STAGES.filter((s) => s !== currentStage).map((s, i, arr) => {
              const m = STAGE_META[s];
              return (
                <button
                  key={s}
                  onClick={() => { onMove(s); setOpen(false); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    width: "100%",
                    padding: "9px 14px",
                    fontSize: 13,
                    textAlign: "left",
                    borderBottom: i < arr.length - 1 ? "1px solid var(--line)" : "none",
                    transition: "background .12s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "color-mix(in oklch, var(--ink) 5%, transparent)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: m.color, flexShrink: 0 }} />
                  {m.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["apps"],
    queryFn: getJobApplications,
  });

  const app = apps.find((a) => String(a.id) === String(id));

  const updateMutation = useMutation({
    mutationFn: updateApplication,
    onMutate: () => toastInfo("Saving…"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      toastSuccess("Saved");
      setEditOpen(false);
    },
    onError: (err) => toastError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteApplication,
    onMutate: () => toastInfo("Deleting…"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      toastSuccess("Application deleted");
      navigate("/applications", { replace: true });
    },
    onError: (err) => toastError(err.message),
  });

  const moveStage = (newStage) => {
    const newStatus = newStage.charAt(0).toUpperCase() + newStage.slice(1);
    updateMutation.mutate({ id: app.id, form: buildForm(app, { status: newStatus }) });
  };

  const saveNotes = (combined) => {
    updateMutation.mutate({ id: app.id, form: buildForm(app, { description: combined }) });
  };

  const handleEdit = (form) => {
    updateMutation.mutate({ id: app.id, form });
  };

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
              <div className="logo logo-lg" style={{ background: app.color }} aria-hidden="true">
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

                <MoveStageDropdown
                  currentStage={app.stage}
                  onMove={moveStage}
                  pending={updateMutation.isPending}
                />

                <button
                  className="chip"
                  style={{ gap: 6 }}
                  onClick={() => setEditOpen(true)}
                >
                  <Pencil size={13} /> Edit
                </button>

                {deleteConfirm ? (
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <button
                      className="del-yes"
                      onClick={() => deleteMutation.mutate(app.id)}
                      disabled={deleteMutation.isPending}
                    >
                      Confirm delete
                    </button>
                    <button className="iconbtn" onClick={() => setDeleteConfirm(false)}>✕</button>
                  </div>
                ) : (
                  <button
                    className="iconbtn iconbtn-danger"
                    onClick={() => setDeleteConfirm(true)}
                    title="Delete application"
                    aria-label="Delete application"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Main grid */}
            <div className="detail-grid">
              <div className="detail-main">
                <StageTracker stage={app.stage} />
                <Timeline stage={app.stage} />
                <Notes app={app} onSave={saveNotes} pending={updateMutation.isPending} />
              </div>
              <div className="detail-side">
                <DetailSide app={app} />
              </div>
            </div>
          </>
        ) : (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <p style={{ color: "var(--muted)", fontStyle: "italic", marginBottom: 16 }}>
              Application not found.
            </p>
            <button className="btn btn-dark btn-sm" onClick={() => navigate("/applications")}>
              Back to applications
            </button>
          </div>
        )}
      </div>

      {app && (
        <ApplicationModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSubmit={handleEdit}
          app={app}
        />
      )}
    </AppShell>
  );
}
