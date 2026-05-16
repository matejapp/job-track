import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import { STATUSES } from '../../constants/statuses'

const EMPTY = {
  companyName: '', position: '', applicationLink: '',
  status: 'Applied', description: '',
  dateApplied: new Date().toISOString().slice(0, 10),
}

export default function ApplicationModal({ open, onClose, onSubmit, app }) {
  const isEdit = !!app
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (!open) return
    setForm(app ? {
      companyName:     app.companyName,
      position:        app.position,
      applicationLink: app.applicationLink,
      status:          app.status,
      description:     app.description,
      dateApplied:     app.dateApplied?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    } : EMPTY)
  }, [open, app])

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Application' : 'New Application'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Company Name *</label>
            <input required className="input-field" placeholder="e.g. Google" value={form.companyName} onChange={set('companyName')} />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Position *</label>
            <input required className="input-field" placeholder="e.g. UX Designer" value={form.position} onChange={set('position')} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Status *</label>
            <select required className="input-field" value={form.status} onChange={set('status')}>
              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Date Applied *</label>
            <input required type="date" className="input-field" value={form.dateApplied} onChange={set('dateApplied')} />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Application Link</label>
          <input type="url" className="input-field" placeholder="https://..." value={form.applicationLink} onChange={set('applicationLink')} />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Notes</label>
          <textarea
            className="input-field resize-none" rows={3}
            placeholder="Recruiter contact, interview notes, anything useful..."
            value={form.description} onChange={set('description')}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">
            {isEdit ? 'Save Changes' : 'Add Application'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
