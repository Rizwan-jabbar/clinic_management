import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerPatient } from "../../redux/registerPatientThunk/registerPatientThunk";
import { resetRegisterPatientState } from "../../redux/registerPatientSlice/registerPatientSlice";
import { NavLink } from "react-router-dom";
import {
  ArrowRight,
  BadgePlus,
  HeartPulse,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

function Register() {
  const dispatch = useDispatch();

  const { loading, error, success } = useSelector(
    (state) => state.registerPatient
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      name,
      email,
      password,
      contact,
    };

    dispatch(registerPatient(data));
  };

  useEffect(() => {
    if (success) {
      setName("");
      setEmail("");
      setPassword("");
      setContact("");

      setTimeout(() => {
        dispatch(resetRegisterPatientState());
      }, 2000);
    }
  }, [success, dispatch]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 font-clinic-body sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_34%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(13,148,136,0.18),_transparent_32%)]" />
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-sky-500/10 to-transparent" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[34px] border border-white/15 bg-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.42)] backdrop-blur-2xl lg:grid-cols-[0.94fr_1.06fr]">
          <section className="relative hidden overflow-hidden bg-gradient-to-br from-sky-700 via-cyan-700 to-teal-600 p-9 text-white lg:flex lg:flex-col lg:justify-between xl:p-11">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_35%)]" />
            <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -right-16 bottom-8 h-56 w-56 rounded-full bg-slate-950/15 blur-3xl" />

            <div className="relative space-y-7">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/80">
                <BadgePlus size={14} />
                Patient Registration
              </span>

              <div className="space-y-4">
                <h1 className="max-w-md font-clinic-heading text-4xl font-semibold leading-tight tracking-tight">
                  Create your clinic access in a few simple steps.
                </h1>
                <p className="max-w-lg text-sm leading-7 text-cyan-50/90">
                  Register once to manage appointments, view medical activity, and stay connected with your clinic team in a clear and simple portal.
                </p>
              </div>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-4">
                <HeartPulse size={18} className="text-cyan-100" />
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/65">Health</p>
                <p className="mt-1 font-medium">Easy access</p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-4">
                <ShieldCheck size={18} className="text-cyan-100" />
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/65">Secure</p>
                <p className="mt-1 font-medium">Trusted account</p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-4">
                <UserRound size={18} className="text-cyan-100" />
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/65">Simple</p>
                <p className="mt-1 font-medium">Patient friendly</p>
              </div>
            </div>
          </section>

          <section className="bg-white/95 p-6 sm:p-8 lg:p-10 xl:p-11">
            <div className="mx-auto w-full max-w-lg">
              <div className="mb-7 space-y-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-teal-500 text-base font-semibold text-white shadow-lg shadow-sky-500/20">
                  CM
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-sky-700/75">
                    Register
                  </p>
                  <h2 className="mt-2 font-clinic-heading text-[30px] font-semibold leading-tight text-slate-900">
                    Create your account
                  </h2>
                  <p className="mt-2 text-[13px] leading-6 text-slate-500">
                    Fill in your details below to start using the clinic management portal.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Full Name
                    </label>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm transition focus-within:border-sky-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100">
                      <UserRound size={17} className="text-slate-400" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Email Address
                    </label>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm transition focus-within:border-sky-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100">
                      <Mail size={17} className="text-slate-400" />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Contact Number
                    </label>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm transition focus-within:border-sky-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100">
                      <Phone size={17} className="text-slate-400" />
                      <input
                        type="text"
                        placeholder="03XXXXXXXXX"
                        className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Password
                    </label>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm transition focus-within:border-sky-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100">
                      <Lock size={17} className="text-slate-400" />
                      <input
                        type="password"
                        placeholder="Create a password"
                        className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-[13px] text-rose-600">
                    {error}
                  </p>
                )}

                {success && (
                  <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-600">
                    {success}
                  </p>
                )}

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-[12px] leading-6 text-slate-500">
                  Your account helps you access appointments, notifications, and clinic-related activity from one secure place.
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-500 px-4 py-3.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-700 hover:via-cyan-700 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Registering..." : "Create Account"}
                  <ArrowRight size={16} />
                </button>
              </form>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center shadow-sm">
                <p className="text-[13px] text-slate-500">
                  Already have an account?{" "}
                  <NavLink
                    to="/login"
                    className="font-semibold text-sky-700 transition hover:text-sky-800"
                  >
                    Sign in
                  </NavLink>
                </p>
              </div>

              <p className="mt-7 text-center text-[11px] text-slate-400">
                Copyright 2026 Clinic Management System
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Register;
