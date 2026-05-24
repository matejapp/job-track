import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/Auth";
import { useAuth } from "../../context/AuthContext";
import { toastError, toastInfo, toastSuccess } from "../Utils/ToastUtils";
import AuthShell from "../components/marketing/AuthShell";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { saveToken, saveUser } = useAuth();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toastSuccess("Login successful");
      saveToken(data.token);
      saveUser(data.user);
      navigate("/dashboard");
    },
    onError:  (err) => toastError(err.message),
    onMutate: () => toastInfo("Logging in..."),
  });

  return (
    <AuthShell
      eyebrow="Sign in"
      title={<>Welcome <span className="font-serif italic font-normal text-clay">back</span>.</>}
      subtitle="Sign in to continue managing your applications, conversations, and next steps."
      footer={
        <p className="mt-8 text-center text-[13px] text-ink-muted">
          New to JobTrack?{" "}
          <Link to="/register" className="font-semibold text-ink underline underline-offset-4 decoration-clay decoration-2 hover:text-clay transition-colors">
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); loginMutation.mutate({ email, password }); }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="form-field">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            id="email" type="email" required autoComplete="email"
            className="mk-input" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="password" className="form-label">Password</label>
          <div style={{ position: "relative" }}>
            <input
              id="password" type={showPassword ? "text" : "password"} required autoComplete="current-password"
              className="mk-input" placeholder="Your password" style={{ paddingRight: 44 }}
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, display: "grid", placeItems: "center", color: "var(--muted)" }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="mk-btn-primary"
          style={{ width: "100%", justifyContent: "center", opacity: loginMutation.isPending ? 0.7 : 1 }}
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Signing in…" : "Sign in"}
          <ArrowRight size={15} strokeWidth={2.5} />
        </button>
      </form>
    </AuthShell>
  );
}
