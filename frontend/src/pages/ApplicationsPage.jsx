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
      className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
      style={{ background: PALETTES[index % PALETTES.length] }}
    >
      {(name || "?").charAt(0).toUpperCase()}
    </div>
  );
}

const sortDate = (app) => new Date(app.dateCreated ?? app.dateApplied);

export default function ApplicationsPage({ user }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("applicationId");
  const queryClient = useQueryClient();
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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="flex min-h-screen bg-[#f6f5ff]">
      <Sidebar user={user} />

      <div className="flex-1 ml-56 flex flex-col min-h-screen">
        <TopBar
          user={user}
          onAddClick={openAdd}
          searchQuery={search}
          onSearch={setSearch}
        />

        <main className="flex-1 p-7">
          <div className="card overflow-hidden">
            <div className="px-6 py-3.5 border-b border-slate-100 flex items-center gap-1.5 flex-wrap">
              {["All", ...STATUSES.map((status) => status.value)].map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeFilter === filter
                        ? "bg-accent text-white shadow-sm"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {filter}
                    <span
                      className={`ml-1.5 tabular-nums ${
                        activeFilter === filter
                          ? "text-violet-200"
                          : "text-slate-400"
                      }`}
                    >
                      {counts(filter)}
                    </span>
                  </button>
                ),
              )}
              <div className="flex-1" />
              <button
                onClick={() => setSortDesc((value) => !value)}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors px-2 py-1.5"
              >
                <ArrowUpDown size={12} />
                {sortDesc ? "Newest first" : "Oldest first"}
              </button>
            </div>

            <div
              className="grid gap-4 px-6 py-3 bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400"
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

            <div className="divide-y divide-slate-50">
              {filtered.map((app, index) => {
                const isSelected = app.id === selectedId;

                return (
                  <div
                    id={`application-${app.id}`}
                    key={app.id}
                    className={`grid gap-4 px-6 py-3.5 items-center transition-colors group animate-fade-in ${
                      isSelected
                        ? "bg-violet-50 ring-1 ring-inset ring-violet-200"
                        : "hover:bg-slate-50/60"
                    }`}
                    style={{
                      gridTemplateColumns:
                        "2.2fr 1.8fr 1.4fr 1fr 0.8fr 80px",
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CompanyAvatar name={app.companyName} index={index} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
                          {app.position}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {app.companyName}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 truncate">
                      {app.description || "-"}
                    </p>

                    <Badge status={app.status} />

                    <span className="text-xs text-slate-500 tabular-nums">
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
                          className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                        >
                          <ExternalLink size={11} /> Open
                        </a>
                      ) : (
                        <span className="text-slate-300 text-xs">-</span>
                      )}
                    </span>

                    <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(app)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </button>
                      {confirmDelete === app.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="text-[10px] px-2 py-1 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors"
                            disabled={deleteMutation.isPending}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirm(null)}
                            className="text-[10px] px-2 py-1 bg-slate-100 rounded-lg font-bold hover:bg-slate-200 transition-colors"
                            disabled={deleteMutation.isPending}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirm(app.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
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
                  <p className="text-slate-400 text-sm mb-4">
                    {search || activeFilter !== "All"
                      ? "No applications match your filter"
                      : "No applications yet"}
                  </p>
                  <button onClick={openAdd} className="btn-primary">
                    <Plus size={14} /> Add your first application
                  </button>
                </div>
              )}
            </div>

            {filtered.length > 0 && (
              <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Showing{" "}
                  <span className="font-semibold text-slate-600">
                    {filtered.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-600">
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
