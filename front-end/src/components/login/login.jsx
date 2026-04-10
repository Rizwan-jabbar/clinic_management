import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/userThunk/userThunk";
import { NavLink } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseMedical,
  Eye,
  EyeOff,
  HeartPulse,
  Lock,
  Mail,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

function Login() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 font-clinic-body text-white">
      <div className="absolute -left-16 top-6 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute -right-20 bottom-8 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_40%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_30px_90px_rgba(2,6,23,0.65)] backdrop-blur-2xl lg:grid-cols-[1.1fr_0.9fr]">
          <section className="relative hidden overflow-hidden border-r border-white/10 bg-gradient-to-br from-cyan-500/20 via-sky-500/15 to-indigo-500/20 p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.14),_transparent_40%)]" />

            <div className="relative space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/25 bg-cyan-100/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100/90">
                <BriefcaseMedical size={14} />
                Clinic Care Suite
              </span>

              <h1 className="max-w-md font-clinic-heading text-4xl font-semibold leading-tight text-white">
                Smarter clinic management starts with a secure login.
              </h1>
              <p className="max-w-lg text-sm leading-7 text-slate-200/90">
                Access appointments, records, and daily operations from one elegant dashboard designed for healthcare teams.
              </p>
            </div>

            <div className="relative grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <HeartPulse size={18} className="text-cyan-100" />
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-200/70">Care</p>
                <p className="mt-1 text-slate-100">Patient first workflow</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <ShieldCheck size={18} className="text-cyan-100" />
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-200/70">Security</p>
                <p className="mt-1 text-slate-100">Protected access</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <Stethoscope size={18} className="text-cyan-100" />
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-200/70">Efficiency</p>
                <p className="mt-1 text-slate-100">Faster daily flow</p>
              </div>
            </div>
          </section>

          <section className="bg-slate-900/70 p-6 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8 space-y-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-500 text-base font-semibold text-white shadow-lg shadow-cyan-500/20">
                  CM
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-cyan-300/80">
                    Sign In
                  </p>
                  <h2 className="mt-2 font-clinic-heading text-3xl font-semibold text-white">
                    Welcome back
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300/85">
                    Continue with your clinic account to access dashboard services.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                    Email Address
                  </label>
                  <div className="group flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800/90 px-4 py-3 transition focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-500/20">
                    <Mail size={17} className="text-slate-500 group-focus-within:text-cyan-400" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-300 transition hover:text-cyan-200"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="group flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800/90 px-4 py-3 transition focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-500/20">
                    <Lock size={17} className="text-slate-500 group-focus-within:text-cyan-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-slate-500 transition hover:text-cyan-300"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                    {error}
                  </p>
                )}

                <div className="rounded-2xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-[12px] leading-6 text-slate-300">
                  Use your clinic credentials for secure access to appointments, billing, and patient workflows.
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-3.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Continue to Dashboard"}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>

              <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-800/70 px-4 py-4 text-center">
                <p className="text-[13px] text-slate-300">
                  New to the platform?{" "}
                  <NavLink
                    to="/register"
                    className="font-semibold text-cyan-300 transition hover:text-cyan-200"
                  >
                    Create an account
                  </NavLink>
                </p>
              </div>

              <p className="mt-7 text-center text-[11px] text-slate-500">
                Copyright 2026 Clinic Management System
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Login;
