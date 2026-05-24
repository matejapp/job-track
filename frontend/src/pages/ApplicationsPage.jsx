import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Pencil, Trash2, ExternalLink, ChevronDown } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import AppShell from "../components/layout/AppShell";
import TopBar from "../components/layout/TopBar";
import ApplicationModal from "../components/modals/ApplicationModal";
import { STAGE_META, STAGES, funnelCounts } from "../constants/statuses";
import {
  addApplication,
  deleteApplication,
  getJobApplications,
  updateApplication,
} from "../api/JobApplications";
import { toastError, toastInfo, toastSuccess } from "../Utils/ToastUtils";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";

// ─── Shared card content ────────────────────────────────────────────────────
function KCard({ a, onEdit, navigate, dragging = false }) {
  return (
    <div
      className="kcard"
      style={dragging ? { boxShadow: "0 16px 48px -12px rgba(0,0,0,0.45)", cursor: "grabbing" } : undefined}
      onClick={() => !dragging && navigate(`/applications/${a.id}`)}
    >
      <div className="ktop">
        <div className="logo logo-sm" style={{ background: a.color }} aria-hidden="true">{a.logo}</div>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>{a.name}</span>
      </div>
      <div className="ktitle">{a.role}</div>
      {a.location && <div className="ksub">{a.location}</div>}
      <div className="kfoot">
        <span className="kdate">{formatDate(a.applied)}</span>
        <button
          className="iconbtn"
          style={{ width: 22, height: 22 }}
          onClick={(e) => { e.stopPropagation(); onEdit(a, e); }}
          title="Edit"
          aria-label={`Edit ${a.name}`}
        >
          <Pencil size={11} />
        </button>
      </div>
    </div>
  );
}

// ─── Draggable wrapper ────────────────────────────────────────────────────────
function DraggableKCard({ a, onEdit, navigate }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: a.id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0 : 1,
        touchAction: "none",
      }}
      {...listeners}
      {...attributes}
    >
      <KCard a={a} onEdit={onEdit} navigate={navigate} />
    </div>
  );
}

// ─── Droppable column ─────────────────────────────────────────────────────────
function DroppableKCol({ stage, meta, cards, onEdit, navigate }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  return (
    <div
      ref={setNodeRef}
      className="kcol"
      style={
        isOver
          ? {
              outline: `2px solid ${meta.color}`,
              outlineOffset: "-2px",
              background: `color-mix(in oklch, ${meta.color} 7%, var(--paper))`,
            }
          : undefined
      }
    >
      <div className="kcol-head">
        <span className="ttl">
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: meta.color, display: "inline-block" }} />
          {meta.label}
        </span>
        <span className="cnt">{cards.length}</span>
      </div>
      {cards.map((a) => (
        <DraggableKCard key={a.id} a={a} onEdit={onEdit} navigate={navigate} />
      ))}
      {cards.length === 0 && (
        <div style={{ padding: "24px 8px", textAlign: "center", color: "var(--muted)", fontSize: 12, fontStyle: "italic" }}>
          Drop here
        </div>
      )}
    </div>
  );
}

// ─── View toggle ─────────────────────────────────────────────────────────────
const ViewToggle = ({ view, onChange }) => (
  <div className="view-toggle">
    {["list", "board"].map((v) => (
      <button
        key={v}
        className={`view-toggle-btn${view === v ? " is-active" : ""}`}
        onClick={() => onChange(v)}
      >
        {v.charAt(0).toUpperCase() + v.slice(1)}
      </button>
    ))}
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ApplicationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("applicationId");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editApp, setEditApp] = useState(null);
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("list");
  const [sortDesc, setSortDesc] = useState(true);
  const [confirmDelete, setConfirm] = useState(null);
  const [activeApp, setActiveApp] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  const { data: applications = [], isLoading, error } = useQuery({
    queryKey: ["apps"],
    queryFn: getJobApplications,
    refetchOnWindowFocus: "always",
  });

  const closeModal = () => { setModalOpen(false); setEditApp(null); };

  const addMutation = useMutation({
    mutationFn: addApplication,
    onMutate: () => toastInfo("Adding application..."),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["apps"] }); toastSuccess("Application added"); closeModal(); },
    onError: (err) => toastError(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: updateApplication,
    onMutate: () => toastInfo("Saving application..."),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["apps"] }); toastSuccess("Application updated"); closeModal(); },
    onError: (err) => toastError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteApplication,
    onMutate: () => toastInfo("Deleting application..."),
    onSuccess: (_d, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      toastSuccess("Application deleted");
      setConfirm(null);
      if (selectedId === deletedId) {
        const next = new URLSearchParams(searchParams);
        next.delete("applicationId");
        setSearchParams(next, { replace: true });
      }
    },
    onError: (err) => toastError(err.message),
  });

  useEffect(() => {
    if (!selectedId || applications.length === 0) return;
    const found = applications.find((a) => a.id === selectedId);
    if (!found) return;
    setFilter("all");
    const t = setTimeout(() => {
      document.getElementById(`app-${selectedId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
    return () => clearTimeout(t);
  }, [applications, selectedId]);

  const counts = useMemo(() => funnelCounts(applications), [applications]);
  const filtered = useMemo(() => {
    const list = filter === "all" ? [...applications] : applications.filter((a) => a.stage === filter);
    return list.sort((a, b) => {
      const d = new Date(a.applied) - new Date(b.applied);
      return sortDesc ? -d : d;
    });
  }, [filter, applications, sortDesc]);

  const openAdd  = () => { setEditApp(null); setModalOpen(true); };
  const openEdit = (app, e) => { e?.stopPropagation(); setEditApp(app); setModalOpen(true); };
  const handleSubmit = (form) => {
    if (editApp) { updateMutation.mutate({ id: editApp.id, form }); return; }
    addMutation.mutate(form);
  };

  // ─── Drag handlers ──────────────────────────────────────────────────────────
  const handleDragStart = ({ active }) => {
    setActiveApp(applications.find((a) => a.id === active.id) ?? null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveApp(null);
    if (!over) return;
    const app = applications.find((a) => a.id === active.id);
    const newStage = over.id; // droppable id is the stage string
    if (!app || newStage === app.stage) return;
    // API expects PascalCase enum value
    const newStatus = newStage.charAt(0).toUpperCase() + newStage.slice(1);
    updateMutation.mutate({
      id: app.id,
      form: {
        companyName:     app.companyName     ?? "",
        position:        app.position        ?? "",
        applicationLink: app.applicationLink ?? "",
        status:          newStatus,
        description:     app.description     ?? "",
        dateApplied:     app.dateApplied
                           ? app.dateApplied.slice(0, 10)
                           : new Date().toISOString().slice(0, 10),
      },
    });
  };

  if (isLoading) return <p style={{ padding: 32, fontStyle: "italic", color: "var(--muted)" }}>Loading…</p>;
  if (error)     return <p style={{ padding: 32, color: "#9b4a3b" }}>{error.message}</p>;

  const FILTER_TABS = [
    ["all", "All", applications.length],
    ...STAGES.map((s) => [s, STAGE_META[s].label, counts[s]]),
  ];

  return (
    <AppShell>
      <TopBar crumbs={["Workspace", "Applications"]} onAdd={openAdd} />

      <div className="content page-enter">
        <div className="content-head">
          <div className="eyebrow">— Pipeline · {applications.length} total</div>
          <h1>Your applications</h1>
          <p>Filter, sort, or update inline. Drag cards between columns in board view.</p>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="tabs">
            {FILTER_TABS.map(([k, label, count]) => (
              <button
                key={k}
                className={`tab${filter === k ? " is-active" : ""}`}
                onClick={() => setFilter(k)}
              >
                {label} <span className="tn">{count}</span>
              </button>
            ))}
          </div>
          <span className="toolbar-spacer" />
          <button className="chip" onClick={() => setSortDesc((v) => !v)} style={{ gap: 6 }}>
            {sortDesc ? "Newest first" : "Oldest first"}
            <ChevronDown size={11} />
          </button>
          <ViewToggle view={view} onChange={setView} />
        </div>

        {/* ── List view ──────────────────────────────────────────────────────── */}
        {view === "list" && (
          <div className="table">
            <div className="tr th">
              <span className="th-label">Company / Role</span>
              <span className="th-label">Notes</span>
              <span className="th-label">Status</span>
              <span className="th-label">Applied</span>
              <span className="th-label">Link</span>
              <span className="th-label" style={{ textAlign: "right" }}>Actions</span>
            </div>

            {filtered.map((app) => {
              const meta = STAGE_META[app.stage] ?? STAGE_META.applied;
              const isSelected = app.id === selectedId;
              return (
                <div
                  id={`app-${app.id}`}
                  key={app.id}
                  className="tr"
                  style={isSelected ? { background: "color-mix(in oklch, var(--accent) 8%, transparent)" } : undefined}
                  onClick={() => navigate(`/applications/${app.id}`)}
                >
                  <div className="td-role">
                    <div className="logo" style={{ background: app.color }} aria-hidden="true">{app.logo}</div>
                    <div>
                      <div className="role-title">{app.role}</div>
                      <div className="role-co">{app.name}{app.location ? ` · ${app.location}` : ""}</div>
                    </div>
                  </div>
                  <div className="td-notes">{app.notes || <span style={{ fontStyle: "italic", opacity: 0.35 }}>—</span>}</div>
                  <div>
                    <span className={`pill ${app.stage}`} aria-label={meta.label}>
                      <span className="pdot" />{meta.label}
                    </span>
                  </div>
                  <div className="td-date">{formatDate(app.applied)}</div>
                  <div>
                    {app.applicationLink ? (
                      <a href={app.applicationLink} target="_blank" rel="noopener noreferrer" className="td-link" onClick={(e) => e.stopPropagation()}>
                        <ExternalLink size={11} /> Open
                      </a>
                    ) : (
                      <span style={{ fontStyle: "italic", opacity: 0.35 }}>—</span>
                    )}
                  </div>
                  <div className="td-actions" onClick={(e) => e.stopPropagation()}>
                    <button className="iconbtn" onClick={(e) => openEdit(app, e)} title="Edit" aria-label={`Edit ${app.name}`}>
                      <Pencil size={13} />
                    </button>
                    {confirmDelete === app.id ? (
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="del-yes" onClick={() => deleteMutation.mutate(app.id)} disabled={deleteMutation.isPending}>Delete</button>
                        <button className="iconbtn" onClick={() => setConfirm(null)}>✕</button>
                      </div>
                    ) : (
                      <button className="iconbtn iconbtn-danger" onClick={() => setConfirm(app.id)} title="Delete" aria-label={`Delete ${app.name}`}>
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div style={{ padding: "60px 24px", textAlign: "center" }}>
                <p style={{ fontStyle: "italic", color: "var(--muted)", marginBottom: 16 }}>
                  {filter !== "all" ? "No applications match this filter." : "No applications yet."}
                </p>
                <button className="btn btn-dark btn-sm" onClick={openAdd}>Add your first application</button>
              </div>
            )}
          </div>
        )}

        {/* ── Board view ─────────────────────────────────────────────────────── */}
        {view === "board" && (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveApp(null)}
          >
            <div style={{ overflowX: "auto", paddingBottom: 8 }}>
              <div className="kanban" style={{ minWidth: "max-content" }}>
                {STAGES.map((stage) => (
                  <DroppableKCol
                    key={stage}
                    stage={stage}
                    meta={STAGE_META[stage]}
                    cards={applications.filter((a) => a.stage === stage)}
                    onEdit={openEdit}
                    navigate={navigate}
                  />
                ))}
              </div>
            </div>

            <DragOverlay dropAnimation={{ duration: 150, easing: "ease" }}>
              {activeApp && (
                <KCard
                  a={activeApp}
                  onEdit={() => {}}
                  navigate={() => {}}
                  dragging
                />
              )}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      <ApplicationModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        app={editApp}
      />
    </AppShell>
  );
}
