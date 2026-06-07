import { useEffect, useState } from 'react'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'
import { Loader2, UserPlus, Upload } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { addApplication, updateApplication, linkDocument } from '@/api/applications'
import { getDocuments } from '@/api/documents'
import { track } from '@/lib/analytics'
import { getRecruiters } from '@/api/recruiters'
import AddRecruiterDialog from '@/pages/recruiters/AddRecruiterDialog'
import UploadDocumentDialog from '@/components/shared/UploadDocumentDialog'
import type { ApplicationStatus, Document, Recruiter } from '@/types'
import type { NormalizedApplication } from '@/api/applications'

const schema = z.object({
  companyName: z.string().min(1, 'Required'),
  position: z.string().min(1, 'Required'),
  status: z.enum(['Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted', 'Withdrawn']),
  dateApplied: z.string().min(1, 'Required'),
  applicationLink: z.string().url('Must be a valid URL').or(z.literal('')),
  location: z.string(),
  workMode: z.enum(['Remote', 'OnSite', 'Hybrid']).optional(),
  salary: z.string(),
  source: z.string(),
  recruiterId: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (o: boolean) => void
  defaultStatus?: ApplicationStatus
  application?: NormalizedApplication | null
}

const STATUS_OPTIONS: ApplicationStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted', 'Withdrawn']
const WORK_MODE_OPTIONS = ['Remote', 'OnSite', 'Hybrid'] as const
const NO_RECRUITER = '__none__'
const NO_DOCUMENT = '__none__'

export default function AddApplicationDialog({ open, onOpenChange, defaultStatus = 'Applied', application }: Props) {
  const queryClient = useQueryClient()
  const isEditing = !!application
  const [addRecruiterOpen, setAddRecruiterOpen] = useState(false)
  const [uploadDocOpen, setUploadDocOpen] = useState(false)
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)

  const { data: recruiters = [] } = useQuery({
    queryKey: ['recruiters'],
    queryFn: getRecruiters,
  })

  const { data: documents = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: getDocuments,
  })

  const resumes = documents.filter(d => d.type === 'resume')

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: '',
      position: '',
      status: defaultStatus,
      dateApplied: new Date().toISOString().slice(0, 10),
      applicationLink: '',
      location: '',
      salary: '',
      source: '',
      recruiterId: NO_RECRUITER,
    },
  })

  useEffect(() => {
    if (!open) return
    setSelectedDocId(application?.documentId ?? null)
    if (isEditing && application) {
      form.reset({
        companyName: application.companyName ?? '',
        position: application.position ?? '',
        status: application.status ?? defaultStatus,
        dateApplied: application.dateApplied ? application.dateApplied.slice(0, 10) : new Date().toISOString().slice(0, 10),
        applicationLink: application.applicationLink ?? '',
        location: application.location ?? '',
        salary: application.salary ?? '',
        source: application.source ?? '',
        workMode: application.workMode ?? 'OnSite',
        recruiterId: application.recruiterId ?? NO_RECRUITER,
      })
    } else {
      form.reset({
        companyName: '',
        position: '',
        status: defaultStatus,
        dateApplied: new Date().toISOString().slice(0, 10),
        applicationLink: '',
        location: '',
        salary: '',
        source: '',
        recruiterId: NO_RECRUITER,
      })
    }
  }, [open, application, isEditing])

  const { isSubmitting } = form.formState

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const dto = {
        companyName: values.companyName,
        position: values.position,
        status: values.status,
        dateApplied: values.dateApplied,
        applicationLink: values.applicationLink ?? '',
        location: values.location ?? '',
        salary: values.salary ?? '',
        source: values.source ?? '',
        resumeVersion: '',
        workMode: values.workMode ?? 'OnSite',
        recruiterId: values.recruiterId === NO_RECRUITER ? undefined : values.recruiterId,
      }

      let appId: string
      if (isEditing) {
        await updateApplication(application!.id, dto)
        appId = application!.id
      } else {
        appId = await addApplication(dto)
      }

      const prevDocId = isEditing ? (application?.documentId ?? null) : null
      if (selectedDocId !== prevDocId) {
        await linkDocument(appId, selectedDocId)
      }

      return values
    },
    onSuccess: (values) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      if (isEditing) {
        queryClient.invalidateQueries({ queryKey: ['application', application!.id] })
        track.applicationUpdated({ status: values.status })
      } else {
        track.applicationCreated({ status: values.status, workMode: values.workMode ?? 'OnSite', hasRecruiter: !!values.recruiterId && values.recruiterId !== NO_RECRUITER })
      }
      toast.success(isEditing ? 'Application updated' : 'Application added')
      form.reset()
      onOpenChange(false)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  function handleRecruiterCreated(recruiter: Recruiter) {
    form.setValue('recruiterId', recruiter.id)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={o => { if (!o) form.reset(); onOpenChange(o) }}>
        <DialogContent className="w-full max-w-2xl bg-bg-surface border-border mx-2 sm:mx-auto max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-text-primary">
              {isEditing ? 'Edit Application' : 'Add Application'}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(v => mutation.mutateAsync(v))} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left column */}
                <div className="space-y-4">
                  <FormField control={form.control} name="companyName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl><Input placeholder="Acme Corp" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="position" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position *</FormLabel>
                      <FormControl><Input placeholder="Software Engineer" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="dateApplied" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Applied *</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="applicationLink" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Link</FormLabel>
                      <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl><Input placeholder="San Francisco, CA" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="workMode" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Mode</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {WORK_MODE_OPTIONS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="salary" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary</FormLabel>
                      <FormControl><Input placeholder="$120,000" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="source" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source</FormLabel>
                      <FormControl><Input placeholder="LinkedIn, Referral…" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Resume</label>
                    <div className="flex gap-2">
                      <Select
                        value={selectedDocId ?? NO_DOCUMENT}
                        onValueChange={v => setSelectedDocId(v === NO_DOCUMENT ? null : v)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select resume…" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NO_DOCUMENT}>None</SelectItem>
                          {resumes.map(d => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.name}{d.version ? ` (v${d.version})` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => setUploadDocOpen(true)}
                        title="Upload new resume"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recruiter — full width */}
              <FormField control={form.control} name="recruiterId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Recruiter</FormLabel>
                  <div className="flex gap-2">
                    <Select onValueChange={field.onChange} value={field.value ?? NO_RECRUITER}>
                      <FormControl>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="None" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NO_RECRUITER}>None</SelectItem>
                        {recruiters.map(r => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.name} — {r.company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      onClick={() => setAddRecruiterOpen(true)}
                      title="Add new recruiter"
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting || mutation.isPending}>
                  {(isSubmitting || mutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? 'Save Changes' : 'Add Application'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AddRecruiterDialog
        open={addRecruiterOpen}
        onOpenChange={setAddRecruiterOpen}
        onCreated={handleRecruiterCreated}
      />

      <UploadDocumentDialog
        open={uploadDocOpen}
        onOpenChange={setUploadDocOpen}
        onUploaded={(doc: Document) => setSelectedDocId(doc.id)}
      />
    </>
  )
}
