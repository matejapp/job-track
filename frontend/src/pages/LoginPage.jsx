import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { GridLoader } from "react-spinners";
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
    onError: (err) => {
      toastError(err.message);
    },
    onMutate: () => {
      toastInfo("Logging in...");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <AuthShell
      eyebrow="No. 02 — Sign in"
      title={
        <>
          Welcome <span className="font-serif italic font-normal text-clay">back</span>.
        </>
      }
      subtitle="Sign in to continue managing your applications, conversations, and next steps."
      footer={
        <p className="mt-10 text-center text-[13.5px] text-ink-muted">
          New to JobTrack?{" "}
          <Link
            to="/register"
            className="font-semibold text-ink underline decoration-clay decoration-2 underline-offset-4 transition-colors hover:text-clay"
          >
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-7">
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
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-muted"
            >
              Password
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              className="mk-input pr-11"
              placeholder="Your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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

        {loginMutation.isPending ? (
          <div className="flex min-h-[52px] w-full items-center justify-center">
            <GridLoader color="#111110" size={6} />
          </div>
        ) : (
          <button
            type="submit"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-[14px] font-semibold tracking-tight text-paper transition-all duration-200 hover:bg-clay hover:shadow-[0_16px_36px_-16px_rgba(194,65,12,0.6)] active:scale-[0.98]"
          >
            Sign in
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
