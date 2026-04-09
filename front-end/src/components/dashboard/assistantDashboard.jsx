import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  BadgeDollarSign,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock3,
  TrendingUp,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import { getAppointments } from "../../redux/appointmentThunk/appointmentThunk";
import { getAppointmentRequests } from "../../redux/appointmentRequestThunk/appointmentRequestThunk";
import { getDoctors } from "../../redux/doctorThunk/doctorThunk";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";

const assistantLinks = [
  { to: "/appointmentRequests", label: "Appointment Requests", icon: ClipboardList },
  { to: "/myAppointments", label: "Appointments", icon: CalendarClock },
];

const periodOptions = [
  { id: "day", label: "Daily" },
  { id: "week", label: "Weekly" },
  { id: "month", label: "Monthly" },
  { id: "year", label: "Yearly" },
];

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

const getPeriodStart = (period) => {
  const now = new Date();
  const start = new Date(now);

  if (period === "day") {
    start.setHours(0, 0, 0, 0);
    return start;
  }

  if (period === "week") {
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  if (period === "month") {
    start.setMonth(now.getMonth() - 1);
    return start;
  }

  start.setFullYear(now.getFullYear() - 1);
  return start;
};

function AssistantDashboard() {
  const dispatch = useDispatch();
  const { user, loading: userLoading } = useSelector((state) => state.user);
  const { appointments, loading: appointmentsLoading } = useSelector((state) => state.appointments);
  const { appointmentRequests, loading: requestsLoading } = useSelector((state) => state.appointmentRequest);
  const { doctors, loading: doctorsLoading } = useSelector((state) => state.doctors);
  const [activePeriod, setActivePeriod] = useState("month");

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(getAppointments());
    dispatch(getAppointmentRequests());
    dispatch(getDoctors());
  }, [dispatch]);

  const assistantId = user?._id || user?.id;
  const doctorFeeMap = useMemo(() => new Map(doctors.map((doctor) => [doctor._id?.toString(), Number(doctor?.doctorFee || 0)])), [doctors]);
  const periodStart = useMemo(() => getPeriodStart(activePeriod), [activePeriod]);

  const assistantAppointments = useMemo(() => appointments.filter((appointment) => appointment?.assistant?._id?.toString() === assistantId?.toString()), [appointments, assistantId]);
  const filteredAppointments = useMemo(() => assistantAppointments.filter((appointment) => new Date(appointment?.appointmentDate || appointment?.createdAt) >= periodStart), [assistantAppointments, periodStart]);
  const filteredRequests = useMemo(() => appointmentRequests.filter((request) => new Date(request?.createdAt) >= periodStart), [appointmentRequests, periodStart]);

  const overallStats = useMemo(() => assistantAppointments.reduce((acc, appointment) => {
    acc.totalAppointments += 1;
    acc[appointment?.status] = (acc[appointment?.status] || 0) + 1;
    if (appointment?.status === "Completed") {
      const fee = doctorFeeMap.get(appointment?.doctor?._id?.toString()) || 0;
      acc.revenue += fee * 0.02;
    }
    return acc;
  }, { totalAppointments: 0, Pending: 0, Approved: 0, Completed: 0, Cancelled: 0, Rejected: 0, revenue: 0 }), [assistantAppointments, doctorFeeMap]);

  const periodStats = useMemo(() => filteredAppointments.reduce((acc, appointment) => {
    acc.totalAppointments += 1;
    acc[appointment?.status] = (acc[appointment?.status] || 0) + 1;
    if (appointment?.status === "Completed") {
      const fee = doctorFeeMap.get(appointment?.doctor?._id?.toString()) || 0;
      acc.revenue += fee * 0.02;
    }
    return acc;
  }, { totalAppointments: 0, Pending: 0, Approved: 0, Completed: 0, Cancelled: 0, Rejected: 0, revenue: 0 }), [filteredAppointments, doctorFeeMap]);

  const requestStats = useMemo(() => filteredRequests.reduce((acc, request) => {
    acc.total += 1;
    acc[request?.status] = (acc[request?.status] || 0) + 1;
    return acc;
  }, { total: 0, pending: 0, accepted: 0, rejected: 0 }), [filteredRequests]);

  const recentRequests = useMemo(() => [...appointmentRequests].sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)).slice(0, 5), [appointmentRequests]);

  if (userLoading || appointmentsLoading || requestsLoading || doctorsLoading) {
    return <div className="py-20 text-center text-lg text-slate-600">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-4 font-clinic-body">
      <section className="rounded-[26px] border border-white/60 bg-white/90 p-4 shadow-lg shadow-slate-200/35 backdrop-blur-xl sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0 space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-700"><UserCog size={14} />Assistant Dashboard</span>
            <div>
              <h1 className="font-clinic-heading break-words text-[24px] font-semibold text-slate-900 sm:text-[28px]">Requests, Appointments & Earnings</h1>
              <p className="mt-1 max-w-3xl break-words text-[12px] leading-5 text-slate-500">Track assistant income share, appointment requests, assigned appointments, and daily coordination work from one focused dashboard.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {periodOptions.map((period) => (
              <button key={period.id} type="button" onClick={() => setActivePeriod(period.id)} className={`rounded-xl px-3 py-2 text-[11px] font-semibold transition ${activePeriod === period.id ? "bg-gradient-to-r from-sky-600 to-teal-500 text-white shadow-lg shadow-sky-500/20" : "border border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-700"}`}>{period.label}</button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[22px] border border-slate-100 bg-white px-4 py-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="break-words text-[10px] uppercase tracking-[0.18em] text-slate-400">Assistant Revenue</p><p className="mt-2 break-words text-[21px] font-semibold text-emerald-700">{formatCurrency(periodStats.revenue)}</p></div><span className="shrink-0 rounded-2xl bg-emerald-50 p-2"><Wallet size={16} className="text-emerald-700" /></span></div><p className="mt-2 break-words text-[11px] leading-5 text-slate-500">2% share from completed doctor appointments in selected window.</p></div>
            <div className="rounded-[22px] border border-slate-100 bg-white px-4 py-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="break-words text-[10px] uppercase tracking-[0.18em] text-slate-400">Appointment Requests</p><p className="mt-2 break-words text-[21px] font-semibold text-sky-700">{requestStats.total}</p></div><span className="shrink-0 rounded-2xl bg-sky-50 p-2"><ClipboardList size={16} className="text-sky-700" /></span></div><p className="mt-2 break-words text-[11px] leading-5 text-slate-500">Total requests in selected window.</p></div>
            <div className="rounded-[22px] border border-slate-100 bg-white px-4 py-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="break-words text-[10px] uppercase tracking-[0.18em] text-slate-400">Appointments</p><p className="mt-2 break-words text-[21px] font-semibold text-teal-700">{periodStats.totalAppointments}</p></div><span className="shrink-0 rounded-2xl bg-teal-50 p-2"><CalendarClock size={16} className="text-teal-700" /></span></div><p className="mt-2 break-words text-[11px] leading-5 text-slate-500">Assigned appointments for selected period.</p></div>
            <div className="rounded-[22px] border border-slate-100 bg-white px-4 py-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="break-words text-[10px] uppercase tracking-[0.18em] text-slate-400">Completed</p><p className="mt-2 break-words text-[21px] font-semibold text-slate-900">{overallStats.Completed}</p></div><span className="shrink-0 rounded-2xl bg-slate-100 p-2"><CheckCircle2 size={16} className="text-slate-900" /></span></div><p className="mt-2 break-words text-[11px] leading-5 text-slate-500">Completed appointments overall.</p></div>
          </div>

          <div className="rounded-[22px] bg-gradient-to-r from-sky-600 to-teal-500 p-4 text-white shadow-lg shadow-sky-500/20">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/75">Assistant Window</p>
            <p className="mt-2 text-[26px] font-semibold">{formatCurrency(periodStats.revenue)}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-2xl bg-white/10 px-3 py-2"><p className="text-white/70">Pending Requests</p><p className="mt-1 font-semibold">{requestStats.pending}</p></div>
              <div className="rounded-2xl bg-white/10 px-3 py-2"><p className="text-white/70">Accepted Requests</p><p className="mt-1 font-semibold">{requestStats.accepted}</p></div>
            </div>
            <p className="mt-3 text-[11px] leading-5 text-white/85">Current filter: {periodOptions.find((item) => item.id === activePeriod)?.label}.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[22px] border border-white/70 bg-white/90 px-4 py-4 shadow-sm"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Pending Requests</p><p className="mt-2 text-[22px] font-semibold text-amber-600">{requestStats.pending}</p><p className="mt-2 text-[11px] text-slate-500">Need assistant review or action.</p></div>
        <div className="rounded-[22px] border border-white/70 bg-white/90 px-4 py-4 shadow-sm"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Accepted Requests</p><p className="mt-2 text-[22px] font-semibold text-emerald-700">{requestStats.accepted}</p><p className="mt-2 text-[11px] text-slate-500">Requests moved forward in selected period.</p></div>
        <div className="rounded-[22px] border border-white/70 bg-white/90 px-4 py-4 shadow-sm"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Pending Appointments</p><p className="mt-2 text-[22px] font-semibold text-amber-600">{overallStats.Pending}</p><p className="mt-2 text-[11px] text-slate-500">Appointments still waiting for progress.</p></div>
        <div className="rounded-[22px] border border-white/70 bg-white/90 px-4 py-4 shadow-sm"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Cancelled Appointments</p><p className="mt-2 text-[22px] font-semibold text-rose-700">{overallStats.Cancelled}</p><p className="mt-2 text-[11px] text-slate-500">Cancelled assistant-linked appointments overall.</p></div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-white/60 bg-white/90 p-4 shadow-lg shadow-slate-200/30">
            <div><h2 className="text-lg font-semibold text-slate-900">Recent Appointment Requests</h2><p className="mt-1 text-[12px] text-slate-500">Latest request activity assigned to this assistant.</p></div>
            <div className="mt-4 space-y-2">
              {recentRequests.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-[12px] text-slate-500">No appointment requests found for this assistant yet.</div>
              ) : (
                recentRequests.map((request) => (
                  <div key={request._id} className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3">
                    <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[12px] font-semibold text-slate-900">{request?.patient?.name || "Patient"}</p><p className="mt-1 text-[10px] text-slate-500">{request?.doctor?.name || "Doctor"} / {request?.clinic?.name || "Clinic"}</p></div><span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600">{request?.status}</span></div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {assistantLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} className="min-w-0 overflow-hidden rounded-[22px] border border-white/70 bg-white/90 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="inline-flex rounded-2xl bg-sky-50 p-3 text-sky-700"><Icon size={18} /></div>
                  <h2 className="mt-3 break-words text-base font-semibold text-slate-900">{item.label}</h2>
                  <p className="mt-1 break-words text-[11px] leading-5 text-slate-500">Open this section to keep appointment flow smooth and patient requests organized.</p>
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-white/60 bg-white/90 p-4 shadow-lg shadow-slate-200/30">
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-slate-900"><Clock3 size={16} className="text-sky-700" />Quick Status View</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-slate-50 px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Approved</p><p className="mt-1 text-[18px] font-semibold text-sky-700">{overallStats.Approved}</p></div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Pending</p><p className="mt-1 text-[18px] font-semibold text-amber-600">{overallStats.Pending}</p></div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Completed</p><p className="mt-1 text-[18px] font-semibold text-emerald-700">{overallStats.Completed}</p></div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Rejected Requests</p><p className="mt-1 text-[18px] font-semibold text-rose-700">{requestStats.rejected}</p></div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/60 bg-white/90 p-4 shadow-lg shadow-slate-200/30">
            <h2 className="text-lg font-semibold text-slate-900">Assistant Summary</h2>
            <div className="mt-4 space-y-2">
              <div className="rounded-2xl bg-slate-50 px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Total Revenue</p><p className="mt-1 text-[18px] font-semibold text-slate-900">{formatCurrency(overallStats.revenue)}</p></div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Total Requests</p><p className="mt-1 text-[18px] font-semibold text-slate-900">{appointmentRequests.length}</p></div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Assigned Appointments</p><p className="mt-1 text-[18px] font-semibold text-slate-900">{assistantAppointments.length}</p></div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Patients Coordinated</p><p className="mt-1 text-[18px] font-semibold text-slate-900">{new Set(assistantAppointments.map((item) => item?.patient?._id).filter(Boolean)).size}</p></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AssistantDashboard;
