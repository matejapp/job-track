import { NavLink } from "react-router-dom";
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
  Rocket,
  ChevronDown,
} from "lucide-react";

const NAV = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    to: "/dashboard",
    enabled: true,
  },
  {
    label: "Applications",
    icon: Briefcase,
    to: "/applications",
    enabled: true,
  },
  { label: "Calendar", icon: Calendar, to: null, enabled: false },
  { label: "Statistics", icon: BarChart2, to: null, enabled: false },
  { label: "Documents", icon: FileText, to: null, enabled: false },
  { label: "Contacts", icon: Users, to: null, enabled: false },
  { label: "Notes", icon: BookOpen, to: null, enabled: false },
  { label: "Reminders", icon: Bell, to: null, enabled: false },
];

export default function Sidebar({ user }) {
  return (
    <aside
      className="fixed left-0 top-0 h-full w-56 flex flex-col py-5 px-3 z-30"
      style={{
        background: "linear-gradient(180deg, #0f0f23 0%, #12122e 100%)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 mb-7">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #4f46e5)" }}
        >
          <Briefcase size={14} className="text-white" />
        </div>
        <span className="font-display font-bold text-white text-lg tracking-tight">
          Job<span className="text-violet-400">Track</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5">
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
      <div
        className="h-px my-3"
        style={{ background: "rgba(255,255,255,0.07)" }}
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
      <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #4f46e5)" }}
        >
          {user?.name?.charAt(0) ?? "U"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-semibold truncate leading-tight">
            {user?.name}
          </p>
          <p className="text-slate-500 text-[10px] truncate">{user?.email}</p>
        </div>
        <ChevronDown size={12} className="text-slate-500 flex-shrink-0" />
      </div>
    </aside>
  );
}
