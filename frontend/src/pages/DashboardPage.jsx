import { useState } from "react";
import { Briefcase, Clock, Users, Trophy } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
import StatCard from "../components/dashboard/StatCard";
import ApplicationOverview from "../components/dashboard/ApplicationOverview";
import ProgressChart from "../components/dashboard/ProgressChart";
import RecentApplications from "../components/dashboard/RecentApplications";
import UpcomingPanel from "../components/dashboard/UpcomingPanel";
import ApplicationModal from "../components/modals/ApplicationModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addApplication, getJobApplications } from "../api/JobApplications";
import { toastSuccess, toastError, toastInfo } from "../Utils/ToastUtils";
import { useAuth } from "../../context/AuthContext";

const buildStats = (apps) => [
  {
    title: "Total Applications",
    value: apps.length,
    icon: Briefcase,
    gradient: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
  },
  {
    title: "In Progress",
    value: apps.filter((a) => !["Offer", "Rejected"].includes(a.status)).length,
    icon: Clock,
    gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
  },
  {
    title: "Interviews",
    value: apps.filter((a) => a.status === "Interview").length,
    icon: Users,
    gradient: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)",
  },
  {
    title: "Offers",
    value: apps.filter((a) => a.status === "Offer").length,
    icon: Trophy,
    gradient: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
  },
];

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data: apps = [],
    isLoading,
    error,
  } = useQuery({
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
    onError: (err) => {
      toastError(err.message);
    },
    onMutate: () => {
      toastInfo("Adding application...");
    },
  });

  const handleAddApplication = (data) => {
    addMutation.mutate(data);
  };

  if (isLoading)
    return (
      <p className="p-8 font-serif italic text-ink-muted">Loading…</p>
    );
  if (error)
    return <p className="p-8 text-sm text-red-600">{error.message}</p>;

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar
        user={user}
        mobileOpen={navOpen}
        onMobileClose={() => setNavOpen(false)}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:ml-56">
        <TopBar
          user={user}
          onAddClick={() => setModalOpen(true)}
          onMenuClick={() => setNavOpen(true)}
          searchQuery={search}
          onSearch={setSearch}
        />

        <main className="min-w-0 flex-1 space-y-6 px-4 py-5 sm:px-6 sm:py-6 lg:space-y-6 lg:p-7">
          {/* Stats */}
          <section>
            <div className="mb-3 flex items-end justify-between">
              <p className="wk-section-label">
                <span className="font-serif italic normal-case text-clay">
                  No.
                </span>{" "}
                01 — Overview
              </p>
              <p className="text-[11.5px] text-ink-muted">All time</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {buildStats(apps).map((s, i) => (
                <StatCard key={s.title} {...s} index={i} />
              ))}
            </div>
          </section>

          {/* Charts */}
          <section>
            <div className="mb-3">
              <p className="wk-section-label">
                <span className="font-serif italic normal-case text-clay">
                  No.
                </span>{" "}
                02 — Pipeline
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
              <ApplicationOverview applications={apps} />
              <ProgressChart applications={apps} />
            </div>
          </section>

          {/* Bottom */}
          <section>
            <div className="mb-3">
              <p className="wk-section-label">
                <span className="font-serif italic normal-case text-clay">
                  No.
                </span>{" "}
                03 — Activity
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-5">
              <div className="lg:col-span-3">
                <RecentApplications applications={apps} />
              </div>
              <div className="lg:col-span-2">
                <UpcomingPanel applications={apps} />
              </div>
            </div>
          </section>
        </main>
      </div>

      <ApplicationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddApplication}
      />
    </div>
  );
}
