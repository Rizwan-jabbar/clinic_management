import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  BadgeDollarSign,
  CalendarClock,
  CheckCircle2,
  Clock3,
  MessageSquare,
  Stethoscope,
  TrendingUp,
  UserCog,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";
import { getAppointments } from "../../redux/appointmentThunk/appointmentThunk";

const doctorLinks = [
  { to: "/myAppointments", label: "Appointments", icon: CalendarClock },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/myPatients", label: "Patients", icon: Users },
  { to: "/myAssistant", label: "Assistants", icon: UserCog },
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

function DoctorDashboard() {
  const dispatch = useDispatch();
  const { user, loading: userLoading } = useSelector((state) => state.user);
  const { appointments, loading: appointmentsLoading } = useSelector(
    (state) => state.appointments
  );
  const [activePeriod, setActivePeriod] = useState("month");

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(getAppointments());
  }, [dispatch]);

  const doctorId = user?._id || user?.id;
  const doctorFee = Number(user?.doctorFee || 0);

  const doctorAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) =>
        appointment?.doctor?._id?.toString() === doctorId?.toString()
    );
  }, [appointments, doctorId]);

  const filteredAppointments = useMemo(() => {
    const periodStart = getPeriodStart(activePeriod);

    return doctorAppointments.filter((appointment) => {
      const appointmentDate = new Date(
        appointment?.appointmentDate || appointment?.createdAt
      );
      return appointmentDate >= periodStart;
    });
  }, [doctorAppointments, activePeriod]);

  const overallStats = useMemo(() => {
    const uniquePatients = new Set();

    const baseStats = doctorAppointments.reduce(
      (acc, appointment) => {
        const patientId = appointment?.patient?._id?.toString();
        if (patientId) uniquePatients.add(patientId);

        acc.totalAppointments += 1;
        acc[appointment?.status] = (acc[appointment?.status] || 0) + 1;

        if (appointment?.status === "Completed") {
          acc.completedRevenue += doctorFee;
        }

        return acc;
      },
      {
        totalAppointments: 0,
        Pending: 0,
        Approved: 0,
        Completed: 0,
        Cancelled: 0,
        Rejected: 0,
        completedRevenue: 0,
      }
    );

    return {
      ...baseStats,
      uniquePatients: uniquePatients.size,
    };
  }, [doctorAppointments, doctorFee]);

  const periodStats = useMemo(() => {
    const uniquePatients = new Set();

    const baseStats = filteredAppointments.reduce(
      (acc, appointment) => {
        const patientId = appointment?.patient?._id?.toString();
        if (patientId) uniquePatients.add(patientId);

        acc.totalAppointments += 1;
        acc[appointment?.status] = (acc[appointment?.status] || 0) + 1;

        if (appointment?.status === "Completed") {
          acc.completedRevenue += doctorFee;
        }

        return acc;
      },
      {
        totalAppointments: 0,
        Pending: 0,
        Approved: 0,
        Completed: 0,
        Cancelled: 0,
        Rejected: 0,
        completedRevenue: 0,
      }
    );

    return {
      ...baseStats,
      uniquePatients: uniquePatients.size,
    };
  }, [filteredAppointments, doctorFee]);

  const adminShare = periodStats.completedRevenue * 0.03;
  const assistantShare = periodStats.completedRevenue * 0.02;
  const netProfit = periodStats.completedRevenue - adminShare - assistantShare;
  const averageRevenue =
    periodStats.Completed > 0
      ? periodStats.completedRevenue / periodStats.Completed
      : 0;

  const recentAppointments = useMemo(
    () =>
      [...doctorAppointments]
        .sort(
          (a, b) =>
            new Date(b?.appointmentDate || b?.createdAt || 0) -
            new Date(a?.appointmentDate || a?.createdAt || 0)
        )
        .slice(0, 5),
    [doctorAppointments]
  );

  const primaryCards = [
    {
      label: "Appointment Revenue",
      value: formatCurrency(periodStats.completedRevenue),
      note: `${periodStats.Completed} completed appointments in selected window`,
      icon: Wallet,
      tone: "text-emerald-700",
      bg: "bg-emerald-50",
    },
    {
      label: "Net Profit",
      value: formatCurrency(netProfit),
      note: `After 3% admin and 2% assistant share`,
      icon: BadgeDollarSign,
      tone: "text-sky-700",
      bg: "bg-sky-50",
    },
    {
      label: "Total Patients",
      value: overallStats.uniquePatients,
      note: `${periodStats.uniquePatients} patients in selected window`,
      icon: Users,
      tone: "text-teal-700",
      bg: "bg-teal-50",
    },
    {
      label: "Doctor Fee",
      value: formatCurrency(doctorFee),
      note: `Per completed appointment earning base`,
      icon: Stethoscope,
      tone: "text-slate-900",
      bg: "bg-slate-100",
    },
  ];

  const statCards = [
    {
      label: "Appointments",
      value: periodStats.totalAppointments,
      helper: `${periodStats.Pending} pending, ${periodStats.Approved} approved`,
      icon: CalendarClock,
      tone: "text-slate-800",
    },
    {
      label: "Completed",
      value: overallStats.Completed,
      helper: `${periodStats.Completed} completed in selected window`,
      icon: CheckCircle2,
      tone: "text-emerald-700",
    },
    {
      label: "Pending",
      value: overallStats.Pending,
      helper: `${periodStats.Pending} pending in selected window`,
      icon: Clock3,
      tone: "text-amber-600",
    },
    {
      label: "Cancelled",
      value: overallStats.Cancelled,
      helper: `${periodStats.Cancelled} cancelled in selected window`,
      icon: XCircle,
      tone: "text-rose-700",
    },
  ];

  if (userLoading || appointmentsLoading) {
    return <div className="py-20 text-center text-lg text-slate-600">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-4 font-clinic-body">
      <section className="rounded-[26px] border border-white/60 bg-white/90 p-4 shadow-lg shadow-slate-200/35 backdrop-blur-xl sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0 space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-700">
              <TrendingUp size={14} />
              Doctor Dashboard
            </span>
            <div>
              <h1 className="font-clinic-heading break-words text-[24px] font-semibold text-slate-900 sm:text-[28px]">
                Appointments, Revenue & Patients
              </h1>
              <p className="mt-1 max-w-2xl break-words text-[12px] leading-5 text-slate-500">
                Track consultation earnings, patient load, appointment status, and quick doctor actions from one professional dashboard.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {periodOptions.map((period) => (
              <button
                key={period.id}
                type="button"
                onClick={() => setActivePeriod(period.id)}
                className={`rounded-xl px-3 py-2 text-[11px] font-semibold transition ${
                  activePeriod === period.id
                    ? "bg-gradient-to-r from-sky-600 to-teal-500 text-white shadow-lg shadow-sky-500/20"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-700"
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {primaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="rounded-[22px] border border-slate-100 bg-white px-4 py-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words text-[10px] uppercase tracking-[0.18em] text-slate-400">
                        {card.label}
                      </p>
                      <p className={`mt-2 break-words text-[21px] font-semibold ${card.tone}`}>{card.value}</p>
                    </div>
                    <span className={`shrink-0 rounded-2xl p-2 ${card.bg}`}>
                      <Icon size={16} className={card.tone} />
                    </span>
                  </div>
                  <p className="mt-2 break-words text-[11px] leading-5 text-slate-500">{card.note}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-[22px] bg-gradient-to-r from-sky-600 to-teal-500 p-4 text-white shadow-lg shadow-sky-500/20">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/75">Revenue Window</p>
            <p className="mt-2 text-[26px] font-semibold">{formatCurrency(periodStats.completedRevenue)}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-2xl bg-white/10 px-3 py-2">
                <p className="text-white/70">Admin 3%</p>
                <p className="mt-1 font-semibold">{formatCurrency(adminShare)}</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-2">
                <p className="text-white/70">Assistant 2%</p>
                <p className="mt-1 font-semibold">{formatCurrency(assistantShare)}</p>
              </div>
            </div>
            <p className="mt-3 text-[11px] leading-5 text-white/85">
              Current filter: {periodOptions.find((item) => item.id === activePeriod)?.label}.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-[22px] border border-white/70 bg-white/90 px-4 py-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                    {card.label}
                  </p>
                  <p className={`mt-2 text-[22px] font-semibold ${card.tone}`}>{card.value}</p>
                </div>
                <Icon size={18} className={card.tone} />
              </div>
              <p className="mt-2 text-[11px] leading-5 text-slate-500">{card.helper}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-slate-100 bg-white px-4 py-4 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Completed</p>
              <p className="mt-2 text-[22px] font-semibold text-emerald-700">{overallStats.Completed}</p>
              <p className="mt-2 text-[11px] text-slate-500">All completed appointments overall.</p>
            </div>
            <div className="rounded-[22px] border border-slate-100 bg-white px-4 py-4 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Rejected</p>
              <p className="mt-2 text-[22px] font-semibold text-rose-700">{overallStats.Rejected}</p>
              <p className="mt-2 text-[11px] text-slate-500">Requests rejected from schedule.</p>
            </div>
            <div className="rounded-[22px] border border-slate-100 bg-white px-4 py-4 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Average Revenue</p>
              <p className="mt-2 text-[22px] font-semibold text-amber-600">{formatCurrency(averageRevenue)}</p>
              <p className="mt-2 text-[11px] text-slate-500">Average earning per completed appointment.</p>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/60 bg-white/90 p-4 shadow-lg shadow-slate-200/30">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent Appointments</h2>
              <p className="mt-1 text-[12px] text-slate-500">
                Latest patient visits and appointment status updates.
              </p>
            </div>

            <div className="mt-4 space-y-2">
              {recentAppointments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-[12px] text-slate-500">
                  No appointments found for this doctor yet.
                </div>
              ) : (
                recentAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-slate-900">
                          {appointment?.patient?.name || "Patient"}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {new Date(appointment?.appointmentDate).toLocaleString()}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                        {appointment?.status}
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">
                      {appointment?.clinic?.name || "Clinic not assigned"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-white/60 bg-white/90 p-4 shadow-lg shadow-slate-200/30">
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Clock3 size={16} className="text-sky-700" />
              Quick Status View
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Approved</p>
                <p className="mt-1 text-[18px] font-semibold text-sky-700">{overallStats.Approved}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Pending</p>
                <p className="mt-1 text-[18px] font-semibold text-amber-600">{overallStats.Pending}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Patients</p>
                <p className="mt-1 text-[18px] font-semibold text-slate-900">
                  {overallStats.uniquePatients}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Appointments</p>
                <p className="mt-1 text-[18px] font-semibold text-slate-900">
                  {overallStats.totalAppointments}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {doctorLinks.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="min-w-0 overflow-hidden rounded-[22px] border border-white/70 bg-white/90 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="inline-flex rounded-2xl bg-sky-50 p-3 text-sky-700">
                    <Icon size={18} />
                  </div>
                  <h2 className="mt-3 break-words text-base font-semibold text-slate-900">{item.label}</h2>
                  <p className="mt-1 break-words text-[11px] leading-5 text-slate-500">
                    Open this section to continue doctor workflow with less navigation overhead.
                  </p>
                </NavLink>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default DoctorDashboard;
