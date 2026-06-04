import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FileText, Upload, AlertCircle } from 'lucide-react'
import { getDocuments } from '@/api/documents'
import EmptyState from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import type { Document } from '@/types'

type SortKey = 'date' | 'version' | 'usage'

function sortDocs(docs: Document[], sort: SortKey) {
  return [...docs].sort((a, b) => {
    if (sort === 'version') return (b.version ?? '').localeCompare(a.version ?? '')
    if (sort === 'usage') return (b.usedInApplicationIds?.length ?? 0) - (a.usedInApplicationIds?.length ?? 0)
    return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  })
}

function DocCard({ doc }: { doc: Document }) {
  return (
    <div className="p-4 rounded-lg border border-border bg-bg-surface space-y-3">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-bg-subtle shrink-0">
          <FileText className="h-5 w-5 text-text-muted" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-text-primary truncate">{doc.name}</p>
          <p className="text-xs text-text-muted mt-0.5">
            {new Date(doc.uploadedAt).toLocaleDateString()}
          </p>
        </div>
        {doc.version && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-bg-subtle text-text-secondary shrink-0">
            v{doc.version}
          </span>
        )}
      </div>
      {doc.usedInApplicationIds && doc.usedInApplicationIds.length > 0 && (
        <p className="text-xs text-text-muted">
          Used in {doc.usedInApplicationIds.length} application{doc.usedInApplicationIds.length !== 1 ? 's' : ''}
        </p>
      )}
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" asChild>
          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">Download</a>
        </Button>
      </div>
    </div>
  )
}

export default function DocumentsPage() {
  const [sort, setSort] = useState<SortKey>('date')

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: getDocuments,
    retry: false,
  })

  const resumes = sortDocs(documents.filter(d => d.type === 'resume'), sort)
  const coverLetters = sortDocs(documents.filter(d => d.type === 'cover_letter'), sort)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-text-primary">Documents</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            {documents.length > 0 ? `${documents.length} document${documents.length !== 1 ? 's' : ''}` : 'Manage your resumes and cover letters'}
          </p>
        </div>
        <Button disabled title="Coming soon — backend not yet implemented">
          <Upload className="h-4 w-4 mr-2" />Upload
        </Button>
      </div>

      {/* Backend notice */}
      <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-bg-subtle">
        <AlertCircle className="h-4 w-4 text-text-muted mt-0.5 shrink-0" />
        <p className="text-sm text-text-secondary">
          Document storage requires a backend update. Your files will appear here once the API is live.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-36" />)}
        </div>
      ) : documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Upload your resumes and cover letters to keep them organized."
        />
      ) : (
        <>
          <div className="flex justify-end">
            <Select value={sort} onValueChange={v => setSort(v as SortKey)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="version">Version</SelectItem>
                <SelectItem value="usage">Most Used</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="resumes">
            <TabsList>
              <TabsTrigger value="resumes">Resumes ({resumes.length})</TabsTrigger>
              <TabsTrigger value="cover_letters">Cover Letters ({coverLetters.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="resumes" className="mt-4">
              {resumes.length === 0 ? (
                <EmptyState icon={FileText} title="No resumes" description="Upload your resume to get started." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {resumes.map(doc => <DocCard key={doc.id} doc={doc} />)}
                </div>
              )}
            </TabsContent>
            <TabsContent value="cover_letters" className="mt-4">
              {coverLetters.length === 0 ? (
                <EmptyState icon={FileText} title="No cover letters" description="Upload a cover letter to get started." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {coverLetters.map(doc => <DocCard key={doc.id} doc={doc} />)}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
