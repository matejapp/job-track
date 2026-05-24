import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContext';
import { getJobApplications } from '../../api/JobApplications';
import {
  LayoutDashboard, Briefcase, Calendar, BarChart2,
  FileText, Users, BookOpen, Bell, LogOut, Settings,
} from 'lucide-react';
import BrandMark from '../marketing/BrandMark';

function NavItem({ active, icon: Icon, label, count, onClick, disabled }) {
  return (
    <button
      className={`nav-item${active ? ' is-active' : ''}${disabled ? ' opacity-40 cursor-not-allowed' : ''}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-current={active ? 'page' : undefined}
    >
      <span className="nav-icon"><Icon size={15} strokeWidth={1.6} /></span>
      <span>{label}</span>
      {count != null && <span className="nav-count">{count}</span>}
    </button>
  );
}

export default function Sidebar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { logout, user } = useAuth();
  const queryClient = useQueryClient();

  const { data: apps = [] } = useQuery({
    queryKey: ['apps'],
    queryFn: getJobApplications,
    staleTime: 30_000,
  });

  const at = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const initial = (user?.name || user?.email || 'U').charAt(0).toUpperCase();
  const displayName  = user?.name  || 'User';
  const displayEmail = user?.email || '';

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="sidebar-brand">
        <div className="brand">
          <BrandMark size={28} />
          <span>JobTrack</span>
        </div>
      </div>

      <NavItem active={at('/dashboard')}   onClick={() => navigate('/dashboard')}   icon={LayoutDashboard} label="Dashboard" />
      <NavItem active={at('/applications')} onClick={() => navigate('/applications')} icon={Briefcase}       label="Applications" count={apps.length || undefined} />
      <NavItem active={at('/calendar')}    onClick={() => navigate('/calendar')}    icon={Calendar}        label="Calendar" />
      <NavItem active={at('/statistics')}  onClick={() => navigate('/statistics')}  icon={BarChart2}       label="Statistics" />

      <div className="sidebar-section">Library</div>
      <NavItem disabled icon={FileText} label="Documents" count={7}  />
      <NavItem disabled icon={Users}    label="Contacts"  count={18} />
      <NavItem disabled icon={BookOpen} label="Notes" />
      <NavItem disabled icon={Bell}     label="Reminders" count={3}  />

      <div style={{ flex: 1 }} />

      <NavItem active={at('/settings')} onClick={() => navigate('/settings')} icon={Settings} label="Settings" />

      <div className="sidebar-user">
        <div className="avatar" aria-hidden="true">{initial}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="name">{displayName}</div>
          <div className="email" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {displayEmail}
          </div>
        </div>
        <button className="iconbtn" onClick={handleLogout} title="Sign out" aria-label="Sign out">
          <LogOut size={14} strokeWidth={1.6} />
        </button>
      </div>
    </aside>
  );
}
