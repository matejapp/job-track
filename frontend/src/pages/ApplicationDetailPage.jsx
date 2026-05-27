import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft, ChevronDown, Link as LinkIcon,
  Plus, Check, ExternalLink, Pencil, Trash2,
} from "lucide-react";
import AppShell from "../components/layout/AppShell";
import TopBar from "../components/layout/TopBar";
import ApplicationModal from "../components/modals/ApplicationModal";
import { getJobApplications, updateApplication, deleteApplication } from "../api/JobApplications";
import { getNotes, createNote, updateNote, deleteNote } from "../api/Notes";
import {
  getActivitiesByJob,
  createActivity,
  updateActivity,
  toggleActivityComplete,
  deleteActivity,
} from "../api/Activities";
import { STAGE_META, STAGES } from "../constants/statuses";
import { toastSuccess, toastError, toastInfo } from "../Utils/ToastUtils";
import { activitySchema } from "../validation/activitySchema";
import { toJobApplicationForm } from "../validation/jobApplicationSchema";

const fmtDate = (d, opts = { month: "short", day: "numeric", year: "numeric" }) =>
  d && d !== "TBD" ? new Date(d).toLocaleDateString("en-US", opts) : "—";

const STAGE_STEPS = [
  { key: "applied",   label: "Applied"   },
  { key: "interview", label: "Interview" },
  { key: "offer",     label: "Offer"     },
  { key: "done",      label: "Decision"  },
];

const IMPORTANCE_META = {
  0: { label: "Low",    color: "#6d6c66" },
  1: { label: "Medium", color: "#c08a3a" },
  2: { label: "High",   color: "#4b6cb7" },
  3: { label: "Urgent", color: "#9b4a3b" },
};

function buildForm(app, overrides = {}) {
  return {
    ...toJobApplicationForm(app),
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

function Notes({ jobId, companyInitial }) {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes", jobId],
    queryFn: () => getNotes(jobId),
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", jobId] });
      setText("");
    },
    onError: (err) => toastError(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", jobId] });
      setEditingId(null);
    },
    onError: (err) => toastError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes", jobId] }),
    onError: (err) => toastError(err.message),
  });

  const handleSave = () => {
    if (!text.trim()) return;
    createMutation.mutate({ jobId, content: text.trim() });
  };

  const handleUpdate = (id) => {
    if (!editText.trim()) return;
    updateMutation.mutate({ jobId, id, content: editText.trim() });
  };

  return (
    <div className="card">
      <div className="card-head">
        <h3><span className="lbl">C</span> Notes</h3>
      </div>

      {isLoading ? (
        <p style={{ fontSize: 13, color: "var(--muted)", fontStyle: "italic", margin: 0 }}>Loading…</p>
      ) : notes.length === 0 ? (
        <p style={{ fontSize: 14, color: "var(--muted)", fontStyle: "italic", margin: 0 }}>No notes yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 0 }}>
          {notes.map((note, i) => (
            <div
              key={note.id}
              style={{
                padding: "12px 0",
                borderBottom: i < notes.length - 1 ? "1px solid var(--line)" : "none",
              }}
            >
              {editingId === note.id ? (
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <textarea
                    className="input-field textarea"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={3}
                    autoFocus
                    style={{ flex: 1 }}
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <button
                      className="btn btn-dark btn-sm"
                      disabled={!editText.trim() || updateMutation.isPending}
                      onClick={() => handleUpdate(note.id)}
                    >
                      Save
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "var(--ink-2)", whiteSpace: "pre-wrap" }}>
                      {note.content}
                    </p>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", marginTop: 4, display: "block" }}>
                      {fmtDate(note.dateCreated)}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                    <button
                      className="iconbtn"
                      onClick={() => { setEditingId(note.id); setEditText(note.content); }}
                      title="Edit note"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      className="iconbtn iconbtn-danger"
                      onClick={() => deleteMutation.mutate({ jobId, id: note.id })}
                      title="Delete note"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="note-composer">
        <div className="note-avatar">{companyInitial}</div>
        <input
          className="note-input"
          placeholder="Add a note…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSave(); } }}
        />
        <button
          className="btn btn-dark btn-sm"
          disabled={!text.trim() || createMutation.isPending}
          onClick={handleSave}
        >
          {createMutation.isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

const EMPTY_ACTIVITY_FORM = { name: "", date: "", importance: 0, description: "" };

const IMPORTANCE_VALUE = {
  low: 0,
  medium: 1,
  high: 2,
  urgent: 3,
};

function importanceValue(value) {
  if (typeof value === "number") return value;
  return IMPORTANCE_VALUE[String(value ?? "").toLowerCase()] ?? 0;
}

function toActivityForm(activity) {
  return {
    name: activity?.name ?? "",
    date: activity?.date ? String(activity.date).slice(0, 10) : "",
    importance: importanceValue(activity?.importance),
    description: activity?.description ?? "",
  };
}

function ActivityForm({
  errors,
  onCancel,
  onSubmit,
  pending,
  pendingLabel,
  register,
  submitLabel,
}) {
  return (
    <form
      onSubmit={onSubmit}
      style={{
        padding: 14,
        background: "color-mix(in oklch, var(--ink) 3%, transparent)",
        borderRadius: "var(--r-md)",
        marginBottom: 12,
        display: "grid",
        gap: 10,
      }}
    >
      <div className="form-row">
        <div className="form-field">
          <label className="form-label">Name</label>
          <input
            className="input-field"
            placeholder="e.g. Prep interview"
            {...register("name")}
          />
          {errors.name && <p className="form-error">{errors.name.message}</p>}
        </div>
        <div className="form-field">
          <label className="form-label">Date</label>
          <input
            className="input-field"
            type="date"
            {...register("date")}
          />
          {errors.date && <p className="form-error">{errors.date.message}</p>}
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label className="form-label">Importance</label>
          <select
            className="input-field select"
            {...register("importance", { valueAsNumber: true })}
          >
            <option value={0}>Low</option>
            <option value={1}>Medium</option>
            <option value={2}>High</option>
            <option value={3}>Urgent</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Description</label>
          <input
            className="input-field"
            placeholder="Optional"
            {...register("description")}
          />
          {errors.description && <p className="form-error">{errors.description.message}</p>}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-dark btn-sm"
          disabled={pending}
        >
          {pending ? pendingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Activities({ jobId }) {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmCompleteId, setConfirmCompleteId] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: EMPTY_ACTIVITY_FORM,
    resolver: zodResolver(activitySchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm({
    defaultValues: EMPTY_ACTIVITY_FORM,
    resolver: zodResolver(activitySchema),
  });

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["activities", jobId],
    queryFn: () => getActivitiesByJob(jobId),
  });

  const createMutation = useMutation({
    mutationFn: createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      reset(EMPTY_ACTIVITY_FORM);
      setShowAdd(false);
    },
    onError: (err) => toastError(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: updateActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      resetEdit(EMPTY_ACTIVITY_FORM);
      setEditingId(null);
    },
    onError: (err) => toastError(err.message),
  });

  const toggleMutation = useMutation({
    mutationFn: toggleActivityComplete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["activities"] }),
    onError: (err) => toastError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["activities"] }),
    onError: (err) => toastError(err.message),
  });

  const openAddForm = () => {
    setEditingId(null);
    setConfirmCompleteId(null);
    setShowAdd((v) => !v);
  };

  const startEdit = (activity) => {
    setShowAdd(false);
    setConfirmCompleteId(null);
    setEditingId(activity.id);
    resetEdit(toActivityForm(activity));
  };

  const cancelEdit = () => {
    resetEdit(EMPTY_ACTIVITY_FORM);
    setEditingId(null);
  };

  return (
    <div className="card">
      <div className="card-head">
        <h3><span className="lbl">D</span> Activities</h3>
        <button
          className="btn btn-ghost btn-sm"
          style={{ gap: 5 }}
          onClick={openAddForm}
        >
          <Plus size={13} /> Add
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleSubmit((data) => createMutation.mutate({ jobId, dto: data }))}
          style={{
            padding: 14,
            background: "color-mix(in oklch, var(--ink) 3%, transparent)",
            borderRadius: "var(--r-md)",
            marginBottom: 12,
            display: "grid",
            gap: 10,
          }}
        >
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Name</label>
              <input
                className="input-field"
                placeholder="e.g. Prep interview"
                {...register("name")}
              />
              {errors.name && <p className="form-error">{errors.name.message}</p>}
            </div>
            <div className="form-field">
              <label className="form-label">Date</label>
              <input
                className="input-field"
                type="date"
                {...register("date")}
              />
              {errors.date && <p className="form-error">{errors.date.message}</p>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Importance</label>
              <select
                className="input-field select"
                {...register("importance", { valueAsNumber: true })}
              >
                <option value={0}>Low</option>
                <option value={1}>Medium</option>
                <option value={2}>High</option>
                <option value={3}>Urgent</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Description</label>
              <input
                className="input-field"
                placeholder="Optional"
                {...register("description")}
              />
              {errors.description && <p className="form-error">{errors.description.message}</p>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => { setShowAdd(false); reset(EMPTY_ACTIVITY_FORM); }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-dark btn-sm"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Adding…" : "Add activity"}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p style={{ fontSize: 13, color: "var(--muted)", fontStyle: "italic", margin: 0 }}>Loading…</p>
      ) : activities.length === 0 && !showAdd ? (
        <p style={{ fontSize: 14, color: "var(--muted)", fontStyle: "italic", margin: 0 }}>
          No activities yet.
        </p>
      ) : (
        <div>
          {activities.map((act) => {
            if (editingId === act.id) {
              return (
                <ActivityForm
                  key={act.id}
                  errors={editErrors}
                  onSubmit={handleEditSubmit((data) =>
                    updateMutation.mutate({ id: act.id, dto: data })
                  )}
                  onCancel={cancelEdit}
                  pending={updateMutation.isPending}
                  pendingLabel="Saving..."
                  register={registerEdit}
                  submitLabel="Save activity"
                />
              );
            }

            const imp = IMPORTANCE_META[importanceValue(act.importance)] ?? IMPORTANCE_META[0];
            const isPendingComplete = confirmCompleteId === act.id;
            return (
              <div
                key={act.id}
                className={`todo-row${act.completed || isPendingComplete ? " is-done" : ""}`}
              >
                {isPendingComplete ? (
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                    <button
                      className="del-yes"
                      onClick={() => { toggleMutation.mutate(act.id); setConfirmCompleteId(null); }}
                      disabled={toggleMutation.isPending}
                    >
                      Mark done
                    </button>
                    <button className="iconbtn" onClick={() => setConfirmCompleteId(null)}>✕</button>
                  </div>
                ) : (
                  <button
                    className={`todo-check${act.completed ? " is-done" : ""}`}
                    style={{ flexShrink: 0 }}
                    onClick={() => act.completed
                      ? toggleMutation.mutate(act.id)
                      : setConfirmCompleteId(act.id)
                    }
                    title={act.completed ? "Mark incomplete" : "Mark as done"}
                  >
                    {act.completed && <Check size={11} strokeWidth={2.5} />}
                  </button>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{act.name}</div>
                  {act.description && (
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{act.description}</div>
                  )}
                </div>
                <div className="todo-meta">
                  <span
                    style={{ width: 7, height: 7, borderRadius: "50%", background: imp.color, flexShrink: 0 }}
                    title={imp.label}
                  />
                  <span>{fmtDate(act.date, { month: "short", day: "numeric" })}</span>
                  <button
                    className="iconbtn"
                    style={{ width: 22, height: 22 }}
                    onClick={() => startEdit(act)}
                    title="Edit activity"
                  >
                    <Pencil size={11} />
                  </button>
                  <button
                    className="iconbtn iconbtn-danger"
                    style={{ width: 22, height: 22 }}
                    onClick={() => deleteMutation.mutate(act.id)}
                    title="Delete activity"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
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
          {app.workMode && (
            <div className="meta-row">
              <span className="k">Work mode</span>
              <span className="v">{app.workMode === "OnSite" ? "On-site" : app.workMode}</span>
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
          <div
            style={{ position: "fixed", inset: 0, zIndex: 9 }}
            onClick={() => setOpen(false)}
          />
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

            <div className="detail-grid">
              <div className="detail-main">
                <StageTracker stage={app.stage} />
                <Timeline stage={app.stage} />
                <Notes jobId={app.id} companyInitial={app.logo} />
                <Activities jobId={app.id} />
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
