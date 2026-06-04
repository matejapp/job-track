import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/AuthProvider'
import { register as registerUser, login } from '@/api/auth'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormValues = z.infer<typeof schema>

function getPasswordScore(password: string): number {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong']
const STRENGTH_COLORS = ['', 'bg-danger', 'bg-warning', 'bg-info', 'bg-accent']

function PasswordStrength({ password }: { password: string }) {
  const score = useMemo(() => getPasswordScore(password), [password])
  if (!password) return null
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-300',
              i <= score ? STRENGTH_COLORS[score] : 'bg-bg-subtle',
            )}
          />
        ))}
      </div>
      {score > 0 && (
        <p className="text-xs text-text-muted">{STRENGTH_LABELS[score]}</p>
      )}
    </div>
  )
}

export default function SignupPage() {
  const navigate = useNavigate()
  const { saveToken, saveUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
  })

  const { isSubmitting } = form.formState
  const passwordValue = form.watch('password')

  async function onSubmit(values: FormValues) {
    try {
      await registerUser({ name: values.name, email: values.email, password: values.password })
      const result = await login({ email: values.email, password: values.password })
      saveToken(result.token)
      saveUser(result.user)
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.'
      toast.error(msg)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-bg-base overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-sm w-full mx-auto bg-bg-surface rounded-xl shadow-md p-8">
        <div className="mb-6 text-center">
          <span className="text-xl font-display font-semibold text-text-primary tracking-tight">
            JobTrack<span className="text-accent">.</span>
          </span>
          <h1 className="mt-3 text-2xl font-display font-semibold text-text-primary">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-text-secondary">Start tracking your job search</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Smith" autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                        tabIndex={-1}
                      >
                        {showPassword
                          ? <EyeOff className="h-4 w-4" />
                          : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <PasswordStrength password={passwordValue} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                'Get Started'
              )}
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-accent font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
