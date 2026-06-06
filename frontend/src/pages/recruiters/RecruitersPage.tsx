import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, Plus, Trash2, Pencil, ExternalLink } from 'lucide-react'
import { toast } from 'react-toastify'
import { format, parseISO } from 'date-fns'
import { getRecruiters, deleteRecruiter } from '@/api/recruiters'
import { track } from '@/lib/analytics'
import EmptyState from '@/components/shared/EmptyState'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import AddRecruiterDialog from './AddRecruiterDialog'
import type { Recruiter } from '@/types'

export default function RecruitersPage() {
  const [search, setSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [editRecruiter, setEditRecruiter] = useState<Recruiter | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Recruiter | null>(null)

  const queryClient = useQueryClient()

  const { data: recruiters = [], isLoading } = useQuery({
    queryKey: ['recruiters'],
    queryFn: getRecruiters,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRecruiter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiters'] })
      toast.success('Recruiter deleted')
      track.recruiterDeleted()
      setDeleteTarget(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const filtered = recruiters.filter(r =>
    `${r.name} ${r.company} ${r.title}`.toLowerCase().includes(search.toLowerCase())
  )

  function safeDate(dateStr: string | null) {
    if (!dateStr) return null
    try { return format(parseISO(dateStr), 'MMM d, yyyy') }
    catch { return null }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-text-primary">Recruiters</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            {recruiters.length > 0
              ? `${recruiters.length} contact${recruiters.length !== 1 ? 's' : ''}`
              : 'Manage your recruiter contacts'}
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> Add Recruiter
        </Button>
      </div>

      {recruiters.length > 0 && (
        <Input
          placeholder="Search by name, company or title…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm"
        />
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-44" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No recruiters yet"
          description="Add your first recruiter contact to start tracking your network."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(r => {
            const initial = r.name.charAt(0).toUpperCase()
            const lastContacted = safeDate(r.lastContactedAt)
            return (
              <div key={r.id} className="p-4 rounded-lg border border-border bg-bg-surface space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center text-sm font-semibold shrink-0">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-text-primary truncate">{r.name}</p>
                      <p className="text-xs text-text-muted truncate">{r.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => setEditRecruiter(r)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-danger hover:text-danger"
                      onClick={() => setDeleteTarget(r)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-bg-subtle text-text-secondary">
                    {r.company}
                  </span>
                  {r.email && (
                    <p className="text-xs text-text-muted truncate">{r.email}</p>
                  )}
                  {r.phone && (
                    <p className="text-xs text-text-muted">{r.phone}</p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2">
                  {lastContacted ? (
                    <p className="text-xs text-text-muted">Last contact: {lastContacted}</p>
                  ) : (
                    <span />
                  )}
                  {r.linkedInProfile && (
                    <a
                      href={r.linkedInProfile}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" /> LinkedIn
                    </a>
                  )}
                </div>

                {r.notes && (
                  <p className="text-xs text-text-secondary line-clamp-2 border-t border-border pt-2">
                    {r.notes}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      <AddRecruiterDialog
        open={addOpen}
        onOpenChange={setAddOpen}
      />

      <AddRecruiterDialog
        open={!!editRecruiter}
        onOpenChange={o => { if (!o) setEditRecruiter(null) }}
        recruiter={editRecruiter}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={o => { if (!o) setDeleteTarget(null) }}
        title="Delete Recruiter"
        description={`Remove ${deleteTarget?.name} from your contacts? This cannot be undone.`}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
