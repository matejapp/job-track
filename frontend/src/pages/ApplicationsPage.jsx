import { useState } from 'react'
import { Plus, Pencil, Trash2, ExternalLink, ArrowUpDown } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import TopBar from '../components/layout/TopBar'
import Badge from '../components/ui/Badge'
import ApplicationModal from '../components/modals/ApplicationModal'
import { STATUSES } from '../constants/statuses'

const PALETTES = [
  'linear-gradient(135deg,#8b5cf6,#4f46e5)',
  'linear-gradient(135deg,#3b82f6,#06b6d4)',
  'linear-gradient(135deg,#f97316,#ec4899)',
  'linear-gradient(135deg,#22c55e,#10b981)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#06b6d4,#8b5cf6)',
]

function CompanyAvatar({ name, index }) {
  return (
    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
      style={{ background: PALETTES[index % PALETTES.length] }}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export default function ApplicationsPage({ applications, user, onAdd, onUpdate, onDelete }) {
  const [modalOpen, setModalOpen]   = useState(false)
  const [editApp, setEditApp]       = useState(null)
  const [search, setSearch]         = useState('')
  const [activeFilter, setFilter]   = useState('All')
  const [confirmDelete, setConfirm] = useState(null)
  const [sortDesc, setSortDesc]     = useState(true)

  const filtered = [...applications]
    .filter((a) => activeFilter === 'All' || a.status === activeFilter)
    .filter((a) => {
      const q = search.toLowerCase()
      return !q || a.companyName.toLowerCase().includes(q) || a.position.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      const diff = new Date(a.dateCreated) - new Date(b.dateCreated)
      return sortDesc ? -diff : diff
    })

  const openAdd  = ()    => { setEditApp(null); setModalOpen(true) }
  const openEdit = (app) => { setEditApp(app);  setModalOpen(true) }

  const handleSubmit = (form) => {
    if (editApp) onUpdate(editApp.id, form)
    else         onAdd(form)
  }

  const handleDelete = (id) => { onDelete(id); setConfirm(null) }

  const counts = (f) => f === 'All' ? applications.length : applications.filter((a) => a.status === f).length

  return (
    <div className="flex min-h-screen bg-[#f6f5ff]">
      <Sidebar user={user} />

      <div className="flex-1 ml-56 flex flex-col min-h-screen">
        <TopBar user={user} onAddClick={openAdd} searchQuery={search} onSearch={setSearch} />

        <main className="flex-1 p-7">
          <div className="card overflow-hidden">

            {/* Filter tabs */}
            <div className="px-6 py-3.5 border-b border-slate-100 flex items-center gap-1.5 flex-wrap">
              {['All', ...STATUSES.map((s) => s.value)].map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeFilter === f ? 'bg-accent text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
                  {f}
                  <span className={`ml-1.5 tabular-nums ${activeFilter === f ? 'text-violet-200' : 'text-slate-400'}`}>
                    {counts(f)}
                  </span>
                </button>
              ))}
              <div className="flex-1" />
              <button onClick={() => setSortDesc((v) => !v)}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors px-2 py-1.5">
                <ArrowUpDown size={12} />
                {sortDesc ? 'Newest first' : 'Oldest first'}
              </button>
            </div>

            {/* Table header */}
            <div className="grid gap-4 px-6 py-3 bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400"
              style={{ gridTemplateColumns: '2.2fr 1.8fr 1.4fr 1fr 0.8fr 80px' }}>
              <span>Company / Role</span>
              <span>Notes</span>
              <span>Status</span>
              <span>Applied</span>
              <span>Link</span>
              <span className="text-right">Actions</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-50">
              {filtered.map((app, i) => (
                <div key={app.id}
                  className="grid gap-4 px-6 py-3.5 items-center hover:bg-slate-50/60 transition-colors group animate-fade-in"
                  style={{ gridTemplateColumns: '2.2fr 1.8fr 1.4fr 1fr 0.8fr 80px' }}>

                  <div className="flex items-center gap-3 min-w-0">
                    <CompanyAvatar name={app.companyName} index={i} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate leading-tight">{app.position}</p>
                      <p className="text-xs text-slate-400 truncate">{app.companyName}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 truncate">{app.description || '—'}</p>

                  <Badge status={app.status} />

                  <span className="text-xs text-slate-500 tabular-nums">
                    {new Date(app.dateApplied).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>

                  <span>
                    {app.applicationLink
                      ? <a href={app.applicationLink} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-accent hover:underline">
                          <ExternalLink size={11} /> Open
                        </a>
                      : <span className="text-slate-300 text-xs">—</span>}
                  </span>

                  <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(app)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors" title="Edit">
                      <Pencil size={13} />
                    </button>
                    {confirmDelete === app.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDelete(app.id)} className="text-[10px] px-2 py-1 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors">Yes</button>
                        <button onClick={() => setConfirm(null)} className="text-[10px] px-2 py-1 bg-slate-100 rounded-lg font-bold hover:bg-slate-200 transition-colors">No</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirm(app.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="px-6 py-16 text-center">
                  <p className="text-slate-400 text-sm mb-4">
                    {search || activeFilter !== 'All' ? 'No applications match your filter' : 'No applications yet'}
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
                  Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of{' '}
                  <span className="font-semibold text-slate-600">{applications.length}</span> applications
                </p>
                <button onClick={openAdd} className="btn-primary" style={{ padding: '6px 14px' }}>
                  <Plus size={13} /> Add New
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <ApplicationModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} app={editApp} />
    </div>
  )
}
