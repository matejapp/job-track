import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  BarChart2,
  FileText,
  Users,
  BookOpen,
  Bell,
  Settings,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";

const NAV = [
  { label: "Dashboard",    icon: LayoutDashboard, to: "/dashboard",    enabled: true  },
  { label: "Applications", icon: Briefcase,       to: "/applications", enabled: true  },
  { label: "Calendar",     icon: Calendar,        to: null,            enabled: false },
  { label: "Statistics",   icon: BarChart2,       to: null,            enabled: false },
  { label: "Documents",    icon: FileText,        to: null,            enabled: false },
  { label: "Contacts",     icon: Users,           to: null,            enabled: false },
  { label: "Notes",        icon: BookOpen,        to: null,            enabled: false },
  { label: "Reminders",    icon: Bell,            to: null,            enabled: false },
];

export default function Sidebar({ user }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const displayName = user?.name || "Unknown user";
  const displayEmail = user?.email || "No email";
  const avatarInitial = (user?.name || user?.email || "U").charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className="fixed left-0 top-0 z-30 flex h-full w-56 flex-col px-3 py-5"
      style={{
        background: "linear-gradient(180deg, #111110 0%, #1a1916 100%)",
      }}
    >
      {/* Logo */}
      <div className="mb-7 flex items-center gap-2.5 px-3">
        <div
          className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-paper text-ink"
          aria-hidden="true"
        >
          <span className="translate-y-[1px] font-serif text-[17px] font-bold italic leading-none">
            J
          </span>
          <span className="absolute right-[4px] top-[4px] h-[4px] w-[4px] rounded-full bg-clay" />
        </div>
        <span className="font-display text-[17px] font-bold tracking-tight text-paper">
          JobTrack
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV.map(({ label, icon: Icon, to, enabled }) =>
          enabled && to ? (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link-active" : "sidebar-link-inactive"}`
              }
            >
              <Icon size={15} />
              <span>{label}</span>
            </NavLink>
          ) : (
            <div
              key={label}
              title="Coming soon"
              className="sidebar-link sidebar-link-disabled"
            >
              <Icon size={15} />
              <span>{label}</span>
            </div>
          ),
        )}
      </nav>

      {/* Divider */}
      <div className="my-3 h-px" style={{ background: "rgba(245,240,230,0.07)" }} />

      {/* Settings */}
      <div
        title="Coming soon"
        className="sidebar-link sidebar-link-disabled mb-3"
      >
        <Settings size={15} />
        <span>Settings</span>
      </div>

      {/* User Profile */}
      <div className="rounded-xl bg-white/[0.04] px-2 py-2">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #c2410c, #9a3412)" }}
          >
            {avatarInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold leading-tight text-paper">
              {displayName}
            </p>
            <p className="truncate text-[10px] text-paper/45">{displayEmail}</p>
          </div>
          <ChevronDown size={12} className="flex-shrink-0 text-paper/40" />
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-paper/55 transition-colors hover:bg-white/5 hover:text-paper"
        >
          <LogOut size={13} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
