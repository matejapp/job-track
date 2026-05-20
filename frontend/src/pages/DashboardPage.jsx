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
    change: "12%",
    icon: Briefcase,
    gradient: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
  },
  {
    title: "In Progress",
    value: apps.filter((a) => !["Offer", "Rejected"].includes(a.status)).length,
    change: "7%",
    icon: Clock,
    gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
  },
  {
    title: "Interviews",
    value: apps.filter((a) => a.status === "Interview").length,
    change: "20%",
    icon: Users,
    gradient: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)",
  },
  {
    title: "Offers",
    value: apps.filter((a) => a.status === "Offer").length,
    change: "100%",
    icon: Trophy,
    gradient: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
  },
];

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="flex min-h-screen bg-[#f6f5ff]">
      <Sidebar user={user} />

      <div className="flex-1 ml-56 flex flex-col min-h-screen">
        <TopBar
          user={user}
          onAddClick={() => setModalOpen(true)}
          searchQuery={search}
          onSearch={setSearch}
        />

        <main className="flex-1 p-7 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {buildStats(apps).map((s, i) => (
              <StatCard key={s.title} {...s} index={i} />
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-5" style={{ minHeight: 280 }}>
            <ApplicationOverview applications={apps} />
            <ProgressChart applications={apps} />
          </div>

          {/* Bottom */}
          <div className="grid grid-cols-5 gap-5">
            <div className="col-span-3">
              <RecentApplications applications={apps} />
            </div>
            <div className="col-span-2">
              <UpcomingPanel applications={apps} />
            </div>
          </div>
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
