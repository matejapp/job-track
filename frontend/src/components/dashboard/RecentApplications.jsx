import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'

const PALETTES = [
  'linear-gradient(135deg,#8b5cf6,#4f46e5)',
  'linear-gradient(135deg,#3b82f6,#06b6d4)',
  'linear-gradient(135deg,#f97316,#ec4899)',
  'linear-gradient(135deg,#22c55e,#10b981)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
]

function CompanyAvatar({ name, index }) {
  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
      style={{ background: PALETTES[index % PALETTES.length] }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export default function RecentApplications({ applications }) {
  const recent = [...applications]
    .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
    .slice(0, 5)

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-slate-900 text-base">Recent Applications</h2>
        <Link to="/applications" className="text-xs text-accent font-semibold hover:underline flex items-center gap-1">
          View All <ArrowRight size={11} />
        </Link>
      </div>
      <div className="space-y-0.5">
        {recent.map((app, i) => (
          <Link
            key={app.id}
            to={`/applications?applicationId=${encodeURIComponent(app.id)}`}
            className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            <CompanyAvatar name={app.companyName} index={i} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight">{app.position}</p>
              <p className="text-xs text-slate-400 truncate">{app.companyName}</p>
            </div>
            <Badge status={app.status} />
            <span className="text-[11px] text-slate-400 flex-shrink-0 ml-1 tabular-nums">
              {new Date(app.dateApplied).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <ArrowRight size={13} className="text-slate-200 group-hover:text-slate-400 transition-colors flex-shrink-0" />
          </Link>
        ))}
        {recent.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-10">No applications yet. Add one above!</p>
        )}
      </div>
    </div>
  )
}
