import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'
import { Loader2 } from 'lucide-react'

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
import { addApplication } from '@/api/applications'
import type { ApplicationStatus } from '@/types'

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
  resumeVersion: z.string(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (o: boolean) => void
  defaultStatus?: ApplicationStatus
}

const STATUS_OPTIONS: ApplicationStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted', 'Withdrawn']
const WORK_MODE_OPTIONS = ['Remote', 'OnSite', 'Hybrid'] as const

export default function AddApplicationDialog({ open, onOpenChange, defaultStatus = 'Applied' }: Props) {
  const queryClient = useQueryClient()

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
      resumeVersion: '',
    },
  })

  const { isSubmitting } = form.formState

  const mutation = useMutation({
    mutationFn: addApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      toast.success('Application added')
      form.reset()
      onOpenChange(false)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  async function onSubmit(values: FormValues) {
    await mutation.mutateAsync({
      companyName: values.companyName,
      position: values.position,
      status: values.status,
      dateApplied: values.dateApplied,
      applicationLink: values.applicationLink ?? '',
      location: values.location ?? '',
      salary: values.salary ?? '',
      source: values.source ?? '',
      resumeVersion: values.resumeVersion ?? '',
      workMode: values.workMode ?? 'OnSite',
    })
  }

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) form.reset(); onOpenChange(o) }}>
      <DialogContent className="w-full max-w-2xl bg-bg-surface border-border mx-2 sm:mx-auto max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-text-primary">Add Application</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_OPTIONS.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {WORK_MODE_OPTIONS.map(m => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
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

                <FormField control={form.control} name="resumeVersion" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resume Version</FormLabel>
                    <FormControl><Input placeholder="v2, tailored…" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || mutation.isPending}>
                {(isSubmitting || mutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
