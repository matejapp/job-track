import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Briefcase, CheckCircle2 } from 'lucide-react'

const FEATURES = [
  'Track unlimited job applications',
  'Visual progress charts & analytics',
  'Interview & deadline reminders',
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError]   = useState('')

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left brand panel */}
      <div
        className="hidden lg:flex w-[44%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0f0f23 0%, #1a1040 100%)' }}
      >
        <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="absolute bottom-0 -right-10 w-60 h-60 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #4f46e5, transparent)' }} />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #4f46e5)' }}>
            <Briefcase size={17} className="text-white" />
          </div>
          <span className="font-display font-bold text-white text-xl tracking-tight">
            Job<span className="text-violet-400">Track</span>
          </span>
        </div>

        <div className="relative z-10">
          <h2 className="font-display text-[2.6rem] font-bold text-white leading-[1.15] mb-4">
            Start tracking<br />smarter,<br />
            <span style={{ color: '#a78bfa' }}>today.</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-8">
            Join thousands of job seekers who land more interviews by staying organized.
          </p>
          <div className="space-y-3.5">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-violet-400 flex-shrink-0" />
                <p className="text-slate-300 text-sm">{f}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-700">© 2024 JobTrack. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #4f46e5)' }}>
              <Briefcase size={14} className="text-white" />
            </div>
            <span className="font-display font-bold text-slate-900 text-lg">Job<span className="text-violet-600">Track</span></span>
          </div>

          <h1 className="font-display text-3xl font-bold text-slate-900 mb-1">Create account</h1>
          <p className="text-slate-500 text-sm mb-8">Start your job search journey, for free</p>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Full name</label>
              <input type="text" required className="input-field" placeholder="Alex Morgan" value={form.name} onChange={set('name')} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Email address</label>
              <input type="email" required autoComplete="email" className="input-field" placeholder="you@example.com" value={form.email} onChange={set('email')} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required minLength={8} className="input-field pr-10" placeholder="Min. 8 characters" value={form.password} onChange={set('password')} />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Confirm password</label>
              <input type="password" required className="input-field" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} />
            </div>
            <button type="submit" className="w-full btn-primary justify-center py-3 mt-1 text-base"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
              Create account
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
