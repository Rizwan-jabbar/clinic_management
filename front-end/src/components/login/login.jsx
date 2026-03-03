import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/userThunk/userThunk";

function Login() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden px-4 py-10 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(59,130,246,0.35),_transparent_60%)]" />

      <div className="relative w-full max-w-md mx-auto p-[1px] rounded-[26px] bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-2xl">
        <div className="rounded-[24px] bg-white/95 backdrop-blur-3xl p-6 sm:p-8">
          <div className="text-center mb-7 sm:mb-8 space-y-2">
            <span className="inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center text-lg sm:text-xl font-semibold rounded-2xl bg-blue-600/10 text-blue-700">
              CM
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Welcome back
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Sign in to your clinic dashboard
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-slate-600">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-800 placeholder:text-slate-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-600">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-800 placeholder:text-slate-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-xs sm:text-sm text-center text-red-500 bg-red-50 border border-red-100 rounded-xl py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-2.5 sm:py-3 rounded-2xl font-semibold text-sm sm:text-base shadow-lg shadow-blue-500/25 transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Continue"}
            </button>
          </form>

          <p className="text-[10px] sm:text-xs text-slate-400 text-center mt-6 sm:mt-8">
            © 2026 Clinic Management System
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;