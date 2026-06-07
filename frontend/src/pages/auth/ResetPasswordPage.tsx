import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Check } from 'lucide-react'
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
import { resetPassword } from '@/api/auth'

const schema = z
  .object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [success, setSuccess] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  const { isSubmitting } = form.formState

  async function onSubmit(values: FormValues) {
    if (!token) return
    try {
      await resetPassword(token, values.newPassword)
      setSuccess(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Reset failed. Please try again.'
      toast.error(msg)
    }
  }

  return (
    <main className="min-h-screen bg-bg-base font-sans text-text-primary antialiased">
      <div className="flex min-h-screen items-center justify-center px-5 py-12">
        <div className="w-full max-w-[420px] rounded-xl border border-border bg-bg-surface p-8 shadow-sm">

          {!token ? (
            <div className="text-center">
              <h1 className="font-display text-[28px] font-bold text-text-primary">
                Invalid reset link
              </h1>
              <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
                This link is missing the required token. Please request a new password reset.
              </p>
              <p className="mt-6 text-sm text-text-secondary">
                <Link to="/forgot-password" className="font-medium text-accent hover:underline">
                  Request a new link
                </Link>
              </p>
            </div>
          ) : success ? (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#5cb885]/10 text-accent ring-1 ring-[#5cb885]/25">
                <Check size={24} strokeWidth={2.5} />
              </div>
              <h1 className="font-display text-[28px] font-bold text-text-primary">
                Password updated.
              </h1>
              <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
                Your password has been reset successfully. You can now sign in with your new password.
              </p>
              <p className="mt-6 text-sm text-text-secondary">
                <Link to="/login" className="font-medium text-accent hover:underline">
                  Go to sign in
                </Link>
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Password reset
                </p>
                <h1 className="font-display text-[32px] font-bold leading-tight text-text-primary">
                  Set a new{' '}
                  <span className="font-display italic font-normal text-accent">password</span>.
                </h1>
                <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
                  Choose a strong password you haven't used before.
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="mt-1 w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating…
                      </>
                    ) : (
                      'Reset password'
                    )}
                  </Button>
                </form>
              </Form>

              <p className="mt-6 text-center text-sm text-text-secondary">
                <Link to="/login" className="font-medium text-accent hover:underline">
                  Back to sign in
                </Link>
              </p>
            </>
          )}

        </div>
      </div>
    </main>
  )
}
