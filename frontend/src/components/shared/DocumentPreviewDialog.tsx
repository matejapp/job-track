import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  fileUrl: string
  fileType: 'pdf' | 'docx'
}

export default function DocumentPreviewDialog({ open, onOpenChange, name, fileUrl, fileType }: Props) {
  const src = fileType === 'pdf'
    ? fileUrl
    : `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 py-3 border-b border-border shrink-0">
          <DialogTitle className="text-sm font-medium truncate">{name}</DialogTitle>
        </DialogHeader>
        <iframe
          src={src}
          className="flex-1 w-full rounded-b-lg"
          title={name}
          allow="fullscreen"
        />
      </DialogContent>
    </Dialog>
  )
}
