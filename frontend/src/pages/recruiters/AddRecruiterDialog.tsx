import { useEffect } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { createRecruiter, updateRecruiter } from '@/api/recruiters'
import { recruiterSchema, emptyRecruiterForm, toRecruiterForm, type RecruiterFormValues } from '@/validation/recruiterSchema'
import { track } from '@/lib/analytics'
import type { Recruiter, CreateRecruiterDto } from '@/types'

interface Props {
  open: boolean
  onOpenChange: (o: boolean) => void
  recruiter?: Recruiter | null
  onCreated?: (recruiter: Recruiter) => void
}

export default function AddRecruiterDialog({ open, onOpenChange, recruiter, onCreated }: Props) {
  const queryClient = useQueryClient()
  const isEditing = !!recruiter

  const form = useForm<RecruiterFormValues>({
    resolver: zodResolver(recruiterSchema),
    defaultValues: emptyRecruiterForm(),
  })

  useEffect(() => {
    if (open) {
      form.reset(isEditing ? toRecruiterForm(recruiter) : emptyRecruiterForm())
    }
  }, [open, recruiter, isEditing])

  const { isSubmitting } = form.formState

  const mutation = useMutation({
    mutationFn: (dto: CreateRecruiterDto) =>
      isEditing ? updateRecruiter(recruiter!.id, dto) : createRecruiter(dto),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['recruiters'] })
      toast.success(isEditing ? 'Recruiter updated' : 'Recruiter added')
      if (!isEditing) { track.recruiterAdded(); onCreated?.(created) }
      onOpenChange(false)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  async function onSubmit(values: RecruiterFormValues) {
    await mutation.mutateAsync({
      name: values.name,
      title: values.title,
      company: values.company,
      linkedInProfile: values.linkedInProfile,
      email: values.email,
      phone: values.phone,
      notes: values.notes,
      lastContactedAt: values.lastContactedAt || null,
    })
  }

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) form.reset(); onOpenChange(o) }}>
      <DialogContent className="w-full max-w-2xl bg-bg-surface border-border mx-2 sm:mx-auto max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-text-primary">
            {isEditing ? 'Edit Recruiter' : 'Add Recruiter'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left column */}
              <div className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl><Input placeholder="Jane Smith" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input placeholder="Senior Technical Recruiter" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="company" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company *</FormLabel>
                    <FormControl><Input placeholder="Acme Corp" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="linkedInProfile" render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Profile</FormLabel>
                    <FormControl><Input placeholder="https://linkedin.com/in/..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Right column */}
              <div className="space-y-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="jane@acme.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl><Input placeholder="+1 555 000 0000" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="lastContactedAt" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Contacted</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Add any notes about this recruiter…" rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || mutation.isPending}>
                {(isSubmitting || mutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? 'Save Changes' : 'Add Recruiter'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
