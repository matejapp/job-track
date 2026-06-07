import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, ArrowLeft, Check } from 'lucide-react'
import { toast } from 'react-toastify'

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
import { useAuth } from '@/providers/AuthProvider'
import { login } from '@/api/auth'
import { track } from '@/lib/analytics'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormValues = z.infer<typeof schema>

const AUTH_POINTS = [
  'Keep every application, contact, and note in one place.',
  'Return to the exact role you need without digging through tabs.',
  'Move from applied to interview with a clearer next step.',
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { saveToken, saveUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const { isSubmitting } = form.formState

  async function onSubmit(values: FormValues) {
    try {
      const result = await login({ email: values.email, password: values.password })
      saveToken(result.token)
      saveUser(result.user)
      track.userLoggedIn()
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign in failed. Please try again.'
      toast.error(msg)
    }
  }

  return (
    <main className="min-h-screen bg-bg-base font-sans text-text-primary antialiased">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">

        {/* Dark panel — left */}
        <section
          className="relative hidden overflow-hidden px-10 py-9 lg:flex lg:flex-col lg:justify-between"
          style={{ background: '#0c100e' }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,hsl(150_43%_30%_/_0.28),transparent_45%),radial-gradient(circle_at_80%_85%,hsl(150_43%_20%_/_0.22),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle_at_2px_2px,#c4f0d8_1px,transparent_0)] [background-size:32px_32px]" />

          <div className="relative z-10 flex items-center justify-between">
            <Link to="/" aria-label="JobTrack home">
              <span className="font-display text-lg font-semibold tracking-tight text-white">
                JobTrack<span className="text-[#5cb885]">.</span>
              </span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[12.5px] font-semibold text-white/80 transition-colors hover:border-white hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft size={13} strokeWidth={2.5} />
              Back home
            </Link>
          </div>

          <div className="relative z-10 max-w-xl py-12">
            <p className="mb-7 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5cb885]/60">
              <span className="font-display italic text-[#5cb885]">No.</span> 01 — The workspace
            </p>
            <h2 className="font-display text-[44px] font-bold leading-[0.95] tracking-tight text-balance text-white lg:text-[60px]">
              A cleaner way to{' '}
              <span className="font-display italic font-normal text-[#5cb885]">manage</span>{' '}
              the roles you care about.
            </h2>
            <div className="my-9 h-px w-24 bg-white/20" />
            <p className="font-display text-[22px] italic leading-snug text-white/80">
              &ldquo;Open JobTrack and you already know what to do next.&rdquo;
            </p>
          </div>

          <div className="relative z-10">
            <ul className="space-y-4">
              {AUTH_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-[3px] flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#5cb885]/10 text-[#5cb885] ring-1 ring-[#5cb885]/25">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <span className="text-[14px] leading-relaxed text-white/75">{point}</span>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-[11px] uppercase tracking-[0.22em] text-white/40">
              © {new Date().getFullYear()} JobTrack — Made for the search ahead.
            </p>
          </div>
        </section>

        {/* Form panel — right */}
        <section className="relative flex min-h-screen items-center justify-center px-5 pb-12 pt-24 sm:px-8 sm:pt-28 lg:px-14 lg:py-10">
          {/* Mobile header */}
          <div className="absolute left-5 right-5 top-5 flex items-center justify-between sm:left-8 sm:right-8 lg:hidden">
            <Link to="/" aria-label="JobTrack home">
              <span className="font-display text-lg font-semibold tracking-tight text-text-primary">
                JobTrack<span className="text-accent">.</span>
              </span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[12px] font-semibold text-text-secondary transition-colors hover:border-text-primary hover:text-text-primary"
            >
              <ArrowLeft size={12} strokeWidth={2.5} />
              Home
            </Link>
          </div>


          <div className="w-full max-w-[420px]">
            <div className="mb-8">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">Sign in</p>
              <h1 className="font-display text-[36px] font-bold leading-tight text-text-primary sm:text-[44px]">
                Welcome{' '}
                <span className="font-display italic font-normal text-accent">back</span>.
              </h1>
              <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
                Sign in to continue managing your applications, conversations, and next steps.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link to="/forgot-password" className="text-xs text-text-muted hover:text-text-secondary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className="pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(p => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="mt-1 w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </Form>

            <p className="mt-8 text-center text-sm text-text-secondary">
              New to JobTrack?{' '}
              <Link to="/signup" className="font-medium text-accent hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </section>

      </div>
    </main>
  )
}
