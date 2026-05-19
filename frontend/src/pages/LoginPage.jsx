import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Briefcase } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/Auth";
import { useAuth } from "../../context/AuthContext";
import { toastSuccess, toastError, toastInfo } from "../Utils/ToastUtils";
import { GridLoader } from "react-spinners";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const { saveToken } = useAuth();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toastSuccess("Login successful");
      saveToken(data.token);
      navigate("/dashboard");
    },
    onError: (err) => {
      toastError(err.message);
    },
    onMutate: () => {
      toastInfo("Logging in...");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    loginMutation.mutate({
      email,
      password,
    });
  };

  return (
    <div className="min-h-screen flex font-sans">
      <div
        className="hidden lg:flex w-[44%] flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0f0f23 0%, #1a1040 100%)",
        }}
      >
        <div
          className="absolute -top-16 -left-16 w-80 h-80 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #7c3aed, transparent)",
          }}
        />
        <div
          className="absolute bottom-0 -right-10 w-60 h-60 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #4f46e5, transparent)",
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #4f46e5)" }}
          >
            <Briefcase size={17} className="text-white" />
          </div>
          <span className="font-display font-bold text-white text-xl tracking-tight">
            Job<span className="text-violet-400">Track</span>
          </span>
        </div>

        <div className="relative z-10">
          <h2 className="font-display text-[2.6rem] font-bold text-white leading-[1.15] mb-4">
            Land your
            <br />
            dream role,
            <br />
            <span style={{ color: "#a78bfa" }}>organized.</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Track every application, interview, and offer — all in one beautiful
            dashboard built for serious job seekers.
          </p>
          <div className="mt-10 flex gap-8">
            {[
              ["500+", "Jobs tracked daily"],
              ["94%", "User satisfaction"],
              ["2×", "More interviews"],
            ].map(([val, lbl]) => (
              <div key={val}>
                <p className="font-display text-2xl font-bold text-white">
                  {val}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{lbl}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-700">
          © 2024 JobTrack. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #4f46e5)",
              }}
            >
              <Briefcase size={14} className="text-white" />
            </div>
            <span className="font-display font-bold text-slate-900 text-lg">
              Job<span className="text-violet-600">Track</span>
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold text-slate-900 mb-1">
            Welcome back
          </h1>
          <p className="text-slate-500 text-sm mb-8">
            Sign in to continue to your dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-accent font-semibold hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="input-field pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            {loginMutation.isPending ? (
              <div className="flex min-h-[48px] w-full items-center justify-center pt-1">
                <GridLoader color="#8b5cf6" size={6} />
              </div>
            ) : (
              <button
                type="submit"
                className="w-full btn-primary justify-center py-3 mt-1 text-base"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                }}
              >
                Sign in
              </button>
            )}
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-accent font-bold hover:underline"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
