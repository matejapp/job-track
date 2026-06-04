import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  BarChart3,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/AuthProvider'
import { Button } from '@/components/ui/button'

interface Props {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

const NAV_ITEMS = [
  { label: 'Dashboard',    href: '/dashboard',    icon: LayoutDashboard },
  { label: 'Applications', href: '/applications', icon: Briefcase },
  { label: 'Calendar',     href: '/calendar',     icon: CalendarDays },
  { label: 'Statistics',   href: '/statistics',   icon: BarChart3 },
  { label: 'Recruiters',   href: '/recruiters',   icon: Users },
  { label: 'Documents',    href: '/documents',    icon: FileText },
  { label: 'Settings',     href: '/settings',     icon: Settings },
]

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: Props) {
  const { user, logout } = useAuth()

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-bg-surface border-r border-border transition-all duration-200 flex-shrink-0',
        // Mobile: fixed overlay drawer
        'fixed inset-y-0 left-0 z-50 w-64',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
        // Desktop: static in flow, collapsible
        'md:relative md:inset-auto md:translate-x-0',
        collapsed ? 'md:w-16' : 'md:w-60',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 h-14 border-b border-border flex-shrink-0">
        {/* Mobile: always show logo + close button */}
        <span className={cn('font-display font-semibold text-text-primary text-lg tracking-tight md:hidden')}>
          JobTrack
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileClose}
          className="text-text-secondary hover:text-text-primary md:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Desktop: logo + collapse toggle */}
        {!collapsed && (
          <span className="hidden md:block font-display font-semibold text-text-primary text-lg tracking-tight">
            JobTrack
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            'hidden md:flex text-text-secondary hover:text-text-primary flex-shrink-0',
            collapsed && 'mx-auto',
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <NavLink
            key={href}
            to={href}
            title={collapsed ? label : undefined}
            onClick={onMobileClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary',
                collapsed && 'md:justify-center',
              )
            }
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className={cn(collapsed && 'md:hidden')}>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-border p-2 flex-shrink-0">
        <div className={cn('flex items-center gap-2 px-1 py-1', collapsed && 'md:hidden')}>
          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text-primary truncate">{user?.name ?? 'User'}</p>
            <p className="text-xs text-text-muted truncate">{user?.email ?? ''}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-text-secondary hover:text-text-primary flex-shrink-0"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        {/* Collapsed desktop user */}
        <div className={cn('hidden flex-col items-center gap-2', collapsed && 'md:flex')}>
          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-semibold">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-text-secondary hover:text-text-primary"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
