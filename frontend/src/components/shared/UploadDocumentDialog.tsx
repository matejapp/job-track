import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadDocument } from '@/api/documents'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import type { Document } from '@/types'

const MAX_SIZE_MB = 10
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploaded?: (doc: Document) => void
}

export default function UploadDocumentDialog({ open, onOpenChange, onUploaded }: Props) {
  const queryClient = useQueryClient()
  const fileRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [type, setType] = useState<'resume' | 'cover_letter'>('resume')
  const [version, setVersion] = useState('')
  const [fileError, setFileError] = useState<string | null>(null)

  const { mutate, isPending, error } = useMutation({
    mutationFn: uploadDocument,
    onSuccess: (doc) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      onUploaded?.(doc)
      handleClose()
    },
  })

  function handleClose() {
    onOpenChange(false)
    setName('')
    setType('resume')
    setVersion('')
    setFileError(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext !== 'pdf' && ext !== 'docx') {
      setFileError('Only PDF and DOCX files are allowed.')
      e.target.value = ''
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setFileError(`File must be under ${MAX_SIZE_MB}MB.`)
      e.target.value = ''
      return
    }

    setFileError(null)
    if (!name) setName(file.name.replace(/\.[^.]+$/, ''))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) { setFileError('Please select a file.'); return }

    const fd = new FormData()
    fd.append('file', file)
    fd.append('name', name.trim() || file.name)
    fd.append('type', type)
    if (version.trim()) fd.append('version', version.trim())

    mutate(fd)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload document</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="doc-file">File</Label>
            <input
              id="doc-file"
              ref={fileRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="block w-full text-sm text-text-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:bg-bg-subtle file:text-text-primary cursor-pointer"
            />
            {fileError && <p className="text-xs text-destructive">{fileError}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="doc-name">Name</Label>
            <Input
              id="doc-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Software Engineer Resume"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="doc-type">Type</Label>
            <Select value={type} onValueChange={v => setType(v as typeof type)}>
              <SelectTrigger id="doc-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resume">Resume</SelectItem>
                <SelectItem value="cover_letter">Cover Letter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="doc-version">Version <span className="text-text-muted">(optional)</span></Label>
            <Input
              id="doc-version"
              value={version}
              onChange={e => setVersion(e.target.value)}
              placeholder="e.g. 2.1"
            />
          </div>

          {error && (
            <p className="text-xs text-destructive">
              {error instanceof Error ? error.message : 'Upload failed. Please try again.'}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Uploading…' : 'Upload'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
