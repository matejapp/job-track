import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Pencil, Trash2, ExternalLink, ArrowUpDown } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
import Badge from "../components/ui/Badge";
import ApplicationModal from "../components/modals/ApplicationModal";
import { STATUSES } from "../constants/statuses";
import {
  addApplication,
  deleteApplication,
  getJobApplications,
  updateApplication,
} from "../api/JobApplications";
import { toastError, toastInfo, toastSuccess } from "../Utils/ToastUtils";
import { useAuth } from "../../context/AuthContext";

const PALETTES = [
  "linear-gradient(135deg,#8b5cf6,#4f46e5)",
  "linear-gradient(135deg,#3b82f6,#06b6d4)",
  "linear-gradient(135deg,#f97316,#ec4899)",
  "linear-gradient(135deg,#22c55e,#10b981)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#06b6d4,#8b5cf6)",
];

function CompanyAvatar({ name, index }) {
  return (
    <div
      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
      style={{ background: PALETTES[index % PALETTES.length] }}
    >
      {(name || "?").charAt(0).toUpperCase()}
    </div>
  );
}

const sortDate = (app) => new Date(app.dateCreated ?? app.dateApplied);

export default function ApplicationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("applicationId");
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editApp, setEditApp] = useState(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setFilter] = useState("All");
  const [confirmDelete, setConfirm] = useState(null);
  const [sortDesc, setSortDesc] = useState(true);

  const {
    data: applications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["apps"],
    queryFn: getJobApplications,
    refetchOnWindowFocus: "always",
  });

  const closeModal = () => {
    setModalOpen(false);
    setEditApp(null);
  };

  const addMutation = useMutation({
    mutationFn: addApplication,
    onMutate: () => {
      toastInfo("Adding application...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      toastSuccess("Application added");
      closeModal();
    },
    onError: (err) => {
      toastError(err.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateApplication,
    onMutate: () => {
      toastInfo("Saving application...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      toastSuccess("Application updated");
      closeModal();
    },
    onError: (err) => {
      toastError(err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteApplication,
    onMutate: () => {
      toastInfo("Deleting application...");
    },
    onSuccess: (_data, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
      toastSuccess("Application deleted");
      setConfirm(null);

      if (selectedId === deletedId) {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete("applicationId");
        setSearchParams(nextParams, { replace: true });
      }
    },
    onError: (err) => {
      toastError(err.message);
    },
  });

  useEffect(() => {
    if (!selectedId || applications.length === 0) return;

    const selectedApp = applications.find((app) => app.id === selectedId);
    if (!selectedApp) return;

    setSearch("");
    setFilter("All");

    const timer = window.setTimeout(() => {
      document
        .getElementById(`application-${selectedId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [applications, selectedId]);

  const filtered = useMemo(() => {
    return [...applications]
      .filter((app) => activeFilter === "All" || app.status === activeFilter)
      .filter((app) => {
        const q = search.toLowerCase();
        return (
          !q ||
          app.companyName.toLowerCase().includes(q) ||
          app.position.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const diff = sortDate(a) - sortDate(b);
        return sortDesc ? -diff : diff;
      });
  }, [activeFilter, applications, search, sortDesc]);

  const openAdd = () => {
    setEditApp(null);
    setModalOpen(true);
  };

  const openEdit = (app) => {
    setEditApp(app);
    setModalOpen(true);
  };

  const handleSubmit = (form) => {
    if (editApp) {
      updateMutation.mutate({ id: editApp.id, form });
      return;
    }

    addMutation.mutate(form);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const counts = (filter) =>
    filter === "All"
      ? applications.length
      : applications.filter((app) => app.status === filter).length;

  if (isLoading)
    return <p className="p-8 font-serif italic text-ink-muted">Loading…</p>;
  if (error)
    return <p className="p-8 text-sm text-red-600">{error.message}</p>;

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar user={user} />

      <div className="ml-56 flex min-h-screen flex-1 flex-col">
        <TopBar
          user={user}
          onAddClick={openAdd}
          searchQuery={search}
          onSearch={setSearch}
        />

        <main className="flex-1 p-7">
          {/* Editorial header */}
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="wk-section-label">
                <span className="font-serif italic normal-case text-clay">
                  No.
                </span>{" "}
                01 — Pipeline
              </p>
              <h2 className="mt-2 font-display text-[28px] font-bold leading-tight tracking-tight text-ink">
                Your{" "}
                <span className="font-serif italic font-normal text-clay">
                  applications
                </span>
              </h2>
            </div>
            <p className="text-[12.5px] text-ink-muted">
              <span className="font-semibold text-ink">
                {applications.length}
              </span>{" "}
              total · filter, sort, or update inline.
            </p>
          </div>

          <div className="card overflow-hidden">
            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-ink-rule/70 bg-paper/40 px-5 py-3.5">
              {["All", ...STATUSES.map((status) => status.value)].map(
                (filter) => {
                  const active = activeFilter === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => setFilter(filter)}
                      className={`wk-chip ${active ? "wk-chip-active" : ""}`}
                    >
                      {filter}
                      <span
                        className={`tabular-nums ${
                          active ? "text-paper/65" : "text-ink-muted"
                        }`}
                      >
                        {counts(filter)}
                      </span>
                    </button>
                  );
                },
              )}
              <div className="flex-1" />
              <button
                onClick={() => setSortDesc((value) => !value)}
                className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink"
              >
                <ArrowUpDown size={12} />
                {sortDesc ? "Newest first" : "Oldest first"}
              </button>
            </div>

            {/* Header row */}
            <div
              className="grid gap-4 border-b border-ink-rule/70 bg-paper-soft/40 px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-ink-muted"
              style={{
                gridTemplateColumns: "2.2fr 1.8fr 1.4fr 1fr 0.8fr 80px",
              }}
            >
              <span>Company / Role</span>
              <span>Notes</span>
              <span>Status</span>
              <span>Applied</span>
              <span>Link</span>
              <span className="text-right">Actions</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-ink-rule/50">
              {filtered.map((app, index) => {
                const isSelected = app.id === selectedId;

                return (
                  <div
                    id={`application-${app.id}`}
                    key={app.id}
                    className={`group grid animate-fade-in items-center gap-4 px-6 py-3.5 transition-colors ${
                      isSelected
                        ? "bg-clay/10 ring-1 ring-inset ring-clay/30"
                        : "hover:bg-paper-soft/40"
                    }`}
                    style={{
                      gridTemplateColumns:
                        "2.2fr 1.8fr 1.4fr 1fr 0.8fr 80px",
                    }}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <CompanyAvatar name={app.companyName} index={index} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold leading-tight text-ink">
                          {app.position}
                        </p>
                        <p className="truncate text-xs text-ink-muted">
                          {app.companyName}
                        </p>
                      </div>
                    </div>

                    <p className="truncate text-xs text-ink-soft">
                      {app.description || (
                        <span className="font-serif italic text-ink-muted">
                          —
                        </span>
                      )}
                    </p>

                    <Badge status={app.status} />

                    <span className="text-xs tabular-nums text-ink-soft">
                      {new Date(app.dateApplied).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>

                    <span>
                      {app.applicationLink ? (
                        <a
                          href={app.applicationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-ink underline decoration-clay decoration-2 underline-offset-4 transition-colors hover:text-clay"
                        >
                          <ExternalLink size={11} /> Open
                        </a>
                      ) : (
                        <span className="font-serif italic text-xs text-ink-muted">
                          —
                        </span>
                      )}
                    </span>

                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => openEdit(app)}
                        className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-paper-soft hover:text-ink"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </button>
                      {confirmDelete === app.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="rounded-lg bg-red-500 px-2 py-1 text-[10px] font-bold text-white transition-colors hover:bg-red-600"
                            disabled={deleteMutation.isPending}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirm(null)}
                            className="rounded-lg bg-paper-soft px-2 py-1 text-[10px] font-bold text-ink-soft transition-colors hover:bg-paper-mid"
                            disabled={deleteMutation.isPending}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirm(app.id)}
                          className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-red-50 hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="px-6 py-16 text-center">
                  <p className="mb-4 font-serif text-base italic text-ink-muted">
                    {search || activeFilter !== "All"
                      ? "No applications match your filter."
                      : "No applications yet."}
                  </p>
                  <button onClick={openAdd} className="btn-primary">
                    <Plus size={14} /> Add your first application
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {filtered.length > 0 && (
              <div className="flex items-center justify-between border-t border-ink-rule/70 bg-paper/40 px-6 py-3.5">
                <p className="text-xs text-ink-muted">
                  Showing{" "}
                  <span className="font-semibold text-ink">
                    {filtered.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-ink">
                    {applications.length}
                  </span>{" "}
                  applications
                </p>
                <button
                  onClick={openAdd}
                  className="btn-primary"
                  style={{ padding: "6px 14px" }}
                >
                  <Plus size={13} /> Add New
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <ApplicationModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        app={editApp}
      />
    </div>
  );
}
