import { useEffect } from "react";
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
  X,
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

export default function Sidebar({ user, mobileOpen = false, onMobileClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const displayName = user?.name || "Unknown user";
  const displayEmail = user?.email || "No email";
  const avatarInitial = (user?.name || user?.email || "U")
    .charAt(0)
    .toUpperCase();

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [mobileOpen]);

  // Close the drawer on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => e.key === "Escape" && onMobileClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, onMobileClose]);

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate("/login", { replace: true });
  };

  const handleNavTap = () => onMobileClose?.();

  return (
    <>
      {/* Backdrop — mobile only */}
      <div
        className={`fixed inset-0 z-30 bg-ink/55 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-[260px] flex-col px-3 py-5 transition-transform duration-300 ease-out lg:w-56 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "linear-gradient(180deg, #111110 0%, #1a1916 100%)",
        }}
        aria-label="Primary navigation"
      >
        {/* Logo + mobile close */}
        <div className="mb-6 flex items-center justify-between px-3">
          <div className="flex items-center gap-2.5">
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
          <button
            type="button"
            onClick={onMobileClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-paper/70 transition-colors hover:bg-white/5 hover:text-paper lg:hidden"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-0.5">
          {NAV.map(({ label, icon: Icon, to, enabled }) =>
            enabled && to ? (
              <NavLink
                key={label}
                to={to}
                onClick={handleNavTap}
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
        <div
          className="my-3 h-px"
          style={{ background: "rgba(245,240,230,0.07)" }}
        />

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
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, #c2410c, #9a3412)" }}
            >
              {avatarInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold leading-tight text-paper">
                {displayName}
              </p>
              <p className="truncate text-[10px] text-paper/45">
                {displayEmail}
              </p>
            </div>
            <ChevronDown size={12} className="flex-shrink-0 text-paper/40" />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-paper/55 transition-colors hover:bg-white/5 hover:text-paper"
          >
            <LogOut size={13} />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
