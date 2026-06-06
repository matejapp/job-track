import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, parseISO } from 'date-fns'
import { ChevronLeft, ExternalLink, Plus, Trash2, MoreVertical, Check, ClipboardList, Activity as ActivityIcon, StickyNote, Info, Pencil } from 'lucide-react'
import { toast } from 'react-toastify'
import { getJobApplication, deleteApplication, updateApplication } from '@/api/applications'
import { track } from '@/lib/analytics'
import { getActivitiesByJob, createActivity, deleteActivity } from '@/api/activities'
import { getNotesByJob, createNote, deleteNote } from '@/api/notes'
import { getRecruiters } from '@/api/recruiters'
import type { ActivityImportance, ApplicationStatus } from '@/types'
import StatusBadge from '@/components/shared/StatusBadge'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import AddApplicationDialog from './AddApplicationDialog'

const IMP_COLORS: Record<ActivityImportance, string> = { Low: 'text-text-muted', Medium: 'text-info', High: 'text-warning', Urgent: 'text-danger' }
const activitySchema = z.object({ name: z.string().min(1), date: z.string().min(1), importance: z.enum(['Low','Medium','High','Urgent']), description: z.string().optional() })
type ActivityForm = z.infer<typeof activitySchema>

const ALL_STATUSES: ApplicationStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted', 'Withdrawn']
const STAGE_STEPS: ApplicationStatus[] = ['Applied', 'Interview', 'Offer']

function StageTracker({ status, onStatusChange }: { status: string; onStatusChange: (s: ApplicationStatus) => void }) {
  const steps = [...STAGE_STEPS, 'Hired'] as const
  const idx = steps.indexOf(status as typeof steps[number])
  return (
    <div className="flex items-center gap-1 py-4">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-1">
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={() => step !== 'Hired' && onStatusChange(step as ApplicationStatus)}
              disabled={step === 'Hired'}
              className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors',
                i < idx ? 'bg-accent text-white' : i === idx ? 'bg-accent/20 text-accent border-2 border-accent' : 'bg-bg-subtle text-text-muted border border-border',
                step !== 'Hired' && 'hover:border-accent hover:text-accent cursor-pointer',
                step === 'Hired' && 'cursor-default',
              )}
            >
              {i < idx ? <Check className="h-3 w-3" /> : i + 1}
            </button>
            <span className={cn('text-xs', i === idx ? 'text-accent font-medium' : 'text-text-muted')}>{step}</span>
          </div>
          {i < steps.length - 1 && <div className={cn('h-px w-6 mb-4', i < idx ? 'bg-accent' : 'bg-border')} />}
        </div>
      ))}
    </div>
  )
}

function ActivityDialog({ jobId, open, onOpenChange }: { jobId: string; open: boolean; onOpenChange: (v: boolean) => void }) {
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ActivityForm>({ resolver: zodResolver(activitySchema), defaultValues: { importance: 'Medium' } })
  const mut = useMutation({
    mutationFn: (d: ActivityForm) => createActivity(jobId, { ...d, description: d.description ?? '' }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['activities', jobId] }); toast.success('Activity logged'); reset(); onOpenChange(false) },
    onError: () => toast.error('Failed to log activity'),
  })
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Log Activity</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(d => mut.mutate(d))} className="space-y-4 mt-2">
          <div className="space-y-1"><Label>Name</Label><Input placeholder="e.g. Interview prep" {...register('name')} />
            {errors.name && <p className="text-xs text-danger">Name is required</p>}</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label>Date</Label><Input type="date" {...register('date')} /></div>
            <div className="space-y-1"><Label>Importance</Label>
              <select className="w-full h-9 rounded-md border border-border bg-bg-base text-sm px-3" {...register('importance')}>
                {(['Low','Medium','High','Urgent'] as const).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1"><Label>Description</Label><Input placeholder="Optional" {...register('description')} /></div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={mut.isPending}>{mut.isPending ? 'Saving…' : 'Log Activity'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [actDialogOpen, setActDialogOpen] = useState(false)
  const [noteText, setNoteText] = useState('')

  const { data: app, isLoading } = useQuery({ queryKey: ['application', id], queryFn: () => getJobApplication(id!) })
  const { data: activities = [] } = useQuery({ queryKey: ['activities', id], queryFn: () => getActivitiesByJob(id!), enabled: !!id })
  const { data: notes = [] } = useQuery({ queryKey: ['notes', id], queryFn: () => getNotesByJob(id!), enabled: !!id })
  const { data: recruiters = [] } = useQuery({ queryKey: ['recruiters'], queryFn: getRecruiters })

  const recruiter = app?.recruiterId ? recruiters.find(r => r.id === app.recruiterId) : null

  const deleteMut = useMutation({ mutationFn: () => deleteApplication(id!), onSuccess: () => { toast.success('Deleted'); navigate('/applications') }, onError: () => toast.error('Failed') })
  const deleteNoteMut = useMutation({ mutationFn: (nid: string) => deleteNote(id!, nid), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes', id] }) })
  const createNoteMut = useMutation({ mutationFn: () => createNote(id!, { content: noteText }), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['notes', id] }); setNoteText('') }, onError: () => toast.error('Failed') })
  const deleteActMut = useMutation({ mutationFn: (aid: string) => deleteActivity(aid), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['activities', id] }) })

  const statusMut = useMutation({
    mutationFn: (status: ApplicationStatus) => updateApplication(id!, { ...app!, status }),
    onSuccess: (_, newStatus) => {
      track.statusChanged({ from: app!.status, to: newStatus })
      queryClient.invalidateQueries({ queryKey: ['application', id] })
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
    onError: () => toast.error('Failed to update status'),
  })

  const fmtDate = (d: string) => { try { return format(parseISO(d), 'MMM d, yyyy') } catch { return d } }

  if (isLoading) return <div className="space-y-4 p-6"><Skeleton className="h-8 w-48" /><Skeleton className="h-24 w-full" /></div>
  if (!app) return <div className="flex flex-col items-center gap-4 py-20"><p className="text-text-secondary">Not found.</p><Button onClick={() => navigate('/applications')}>Back</Button></div>

  const fields: [string, string][] = [
    ['Company', app.companyName], ['Position', app.position], ['Location', app.location || '—'],
    ['Work Mode', app.workMode || '—'], ['Salary', app.salary || '—'], ['Source', app.source || '—'],
    ['Resume Version', app.resumeVersion || '—'], ['Date Applied', app.dateApplied ? fmtDate(app.dateApplied) : '—'],
    ['Recruiter', recruiter ? `${recruiter.name} — ${recruiter.company}` : '—'],
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" asChild><Link to="/applications"><ChevronLeft className="h-4 w-4 mr-1" />Applications</Link></Button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">{app.companyName}</h1>
          <p className="text-text-secondary mt-0.5">{app.position}</p>
          <div className="mt-2 flex items-center gap-3 flex-wrap">
            <StatusBadge status={app.status} />
            <Select value={app.status} onValueChange={s => statusMut.mutate(s as ApplicationStatus)} disabled={statusMut.isPending}>
              <SelectTrigger className="h-7 w-36 text-xs border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_STATUSES.map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {app.applicationLink && (
            <Button variant="ghost" size="sm" asChild>
              <a href={app.applicationLink} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4 mr-1" />Job Posting</a>
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}><Pencil className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-danger" onClick={() => setDeleteOpen(true)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <StageTracker status={app.status} onStatusChange={s => statusMut.mutate(s)} />

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details"><Info className="h-4 w-4 mr-1.5" />Details</TabsTrigger>
          <TabsTrigger value="notes"><StickyNote className="h-4 w-4 mr-1.5" />Notes</TabsTrigger>
          <TabsTrigger value="activities"><ActivityIcon className="h-4 w-4 mr-1.5" />Activities</TabsTrigger>
          <TabsTrigger value="timeline"><ClipboardList className="h-4 w-4 mr-1.5" />Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-5 p-4 rounded-lg border border-border bg-bg-surface">
            {fields.map(([label, value]) => (
              <div key={label}><p className="text-xs text-text-muted uppercase tracking-wide mb-1">{label}</p><p className="text-sm text-text-primary">{value}</p></div>
            ))}
            {app.applicationLink && (
              <div><p className="text-xs text-text-muted uppercase tracking-wide mb-1">Link</p>
                <a href={app.applicationLink} target="_blank" rel="noopener noreferrer" className="text-sm text-accent flex items-center gap-1 hover:underline"><ExternalLink className="h-3 w-3" />Open link</a>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-4 space-y-4">
          {notes.length === 0 ? <EmptyState icon={StickyNote} title="No notes yet" description="Add your first note." /> : (
            <div className="space-y-3">
              {notes.map(n => (
                <div key={n.id} className="p-4 rounded-lg border border-border bg-bg-surface flex gap-3">
                  <div className="flex-1"><p className="text-sm text-text-primary whitespace-pre-wrap">{n.content}</p><p className="text-xs text-text-muted mt-1">{fmtDate(n.dateCreated)}</p></div>
                  <Button variant="ghost" size="sm" onClick={() => deleteNoteMut.mutate(n.id)}><Trash2 className="h-3.5 w-3.5 text-text-muted" /></Button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Textarea placeholder="Add a note…" value={noteText} onChange={e => setNoteText(e.target.value)} rows={2} className="flex-1" />
            <Button onClick={() => createNoteMut.mutate()} disabled={!noteText.trim() || createNoteMut.isPending}><Plus className="h-4 w-4" /></Button>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="mt-4 space-y-4">
          <div className="flex justify-end"><Button size="sm" onClick={() => setActDialogOpen(true)}><Plus className="h-4 w-4 mr-1" />Log Activity</Button></div>
          {activities.length === 0 ? <EmptyState icon={ActivityIcon} title="No activities yet" description="Log your first activity." /> : (
            <div className="space-y-2">
              {activities.map(act => (
                <div key={act.id} className="p-4 rounded-lg border border-border bg-bg-surface flex gap-3 items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-text-primary">{act.name}</p>
                      <span className={cn('text-xs font-medium', IMP_COLORS[act.importance as ActivityImportance] ?? 'text-text-muted')}>{act.importance}</span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">{act.date ? fmtDate(act.date) : ''}</p>
                    {act.description && <p className="text-sm text-text-secondary mt-1 line-clamp-2">{act.description}</p>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteActMut.mutate(act.id)}><Trash2 className="h-3.5 w-3.5 text-text-muted" /></Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          {activities.length === 0 ? <EmptyState icon={ClipboardList} title="No events" description="Activities appear here as a timeline." /> : (
            <div className="space-y-0">
              {[...activities].sort((a, b) => a.date.localeCompare(b.date)).map((act, i) => (
                <div key={act.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent mt-1.5 shrink-0" />
                    {i < activities.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="pb-5">
                    <p className="text-sm font-medium text-text-primary">{act.name}</p>
                    <p className="text-xs text-text-muted">{act.date ? fmtDate(act.date) : ''}</p>
                    <span className={cn('text-xs font-medium', IMP_COLORS[act.importance as ActivityImportance] ?? 'text-text-muted')}>{act.importance}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ActivityDialog jobId={id!} open={actDialogOpen} onOpenChange={setActDialogOpen} />

      <AddApplicationDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        application={app}
      />

      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Application" description="This permanently deletes the application and all its data." onConfirm={() => deleteMut.mutate()} loading={deleteMut.isPending} />
    </div>
  )
}
