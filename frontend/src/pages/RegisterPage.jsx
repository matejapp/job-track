import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { register } from "../api/Auth";
import { toastError, toastInfo, toastSuccess } from "../Utils/ToastUtils";
import AuthShell from "../components/marketing/AuthShell";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => { toastSuccess("Account created"); navigate("/login"); },
    onError:   (err) => toastError(err.message),
    onMutate:  () => toastInfo("Creating account..."),
  });

  return (
    <AuthShell
      eyebrow="Create account"
      title={<>Start <span className="font-serif italic font-normal text-clay">tracking</span>.</>}
      subtitle="Free to use. Organize applications, notes, links, and follow-ups in one focused workspace — no credit card required."
      footer={
        <p className="mt-8 text-center text-[13px] text-ink-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-ink underline underline-offset-4 decoration-clay decoration-2 hover:text-clay transition-colors">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); registerMutation.mutate(form); }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="form-field">
          <label htmlFor="name" className="form-label">Name</label>
          <input id="name" type="text" required autoComplete="name" className="mk-input" placeholder="Alex Morgan" value={form.name} onChange={set("name")} />
        </div>

        <div className="form-field">
          <label htmlFor="email" className="form-label">Email address</label>
          <input id="email" type="email" required autoComplete="email" className="mk-input" placeholder="you@example.com" value={form.email} onChange={set("email")} />
        </div>

        <div className="form-field">
          <label htmlFor="password" className="form-label">Password</label>
          <div style={{ position: "relative" }}>
            <input
              id="password" type={showPassword ? "text" : "password"} required minLength={6}
              autoComplete="new-password" className="mk-input" placeholder="At least 6 characters"
              style={{ paddingRight: 44 }} value={form.password} onChange={set("password")}
            />
            <button
              type="button" onClick={() => setShowPassword((v) => !v)}
              style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, display: "grid", placeItems: "center", color: "var(--muted)" }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
          By creating an account you accept that JobTrack will store the applications and notes you choose to add. We don't send marketing emails or share your data with employers.
        </p>

        <button
          type="submit"
          className="mk-btn-primary"
          style={{ width: "100%", justifyContent: "center", opacity: registerMutation.isPending ? 0.7 : 1 }}
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Creating account…" : "Create account"}
          <ArrowRight size={15} strokeWidth={2.5} />
        </button>
      </form>
    </AuthShell>
  );
}
