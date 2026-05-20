import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { GridLoader } from "react-spinners";
import { register } from "../api/Auth";
import { toastError, toastInfo, toastSuccess } from "../Utils/ToastUtils";
import AuthShell from "../components/marketing/AuthShell";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      toastSuccess("Registration successful");
      navigate("/login");
    },
    onError: (err) => {
      toastError(err.message);
    },
    onMutate: () => {
      toastInfo("Creating account...");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    registerMutation.mutate(form);
  };

  return (
    <AuthShell
      eyebrow="No. 02 — Create account"
      title={
        <>
          Start{" "}
          <span className="font-serif italic font-normal text-clay">tracking</span>.
        </>
      }
      subtitle="Free to use. Organize applications, notes, links, and follow-ups in one focused workspace — no credit card required."
      footer={
        <p className="mt-10 text-center text-[13.5px] text-ink-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-ink underline decoration-clay decoration-2 underline-offset-4 transition-colors hover:text-clay"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-muted"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            className="mk-input"
            placeholder="Alex Morgan"
            value={form.name}
            onChange={updateField("name")}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-muted"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            className="mk-input"
            placeholder="you@example.com"
            value={form.email}
            onChange={updateField("email")}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-muted"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              autoComplete="new-password"
              className="mk-input pr-11"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={updateField("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-0 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <p className="text-[12px] leading-relaxed text-ink-muted">
          By creating an account you accept that JobTrack will store the
          applications and notes you choose to add. We don&apos;t send marketing
          emails or share your data with employers.
        </p>

        {registerMutation.isPending ? (
          <div className="flex min-h-[52px] w-full items-center justify-center">
            <GridLoader color="#111110" size={6} />
          </div>
        ) : (
          <button
            type="submit"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-[14px] font-semibold tracking-tight text-paper transition-all duration-200 hover:bg-clay hover:shadow-[0_16px_36px_-16px_rgba(194,65,12,0.6)] active:scale-[0.98]"
          >
            Create account
            <ArrowRight
              size={15}
              strokeWidth={2.5}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>
        )}
      </form>
    </AuthShell>
  );
}
