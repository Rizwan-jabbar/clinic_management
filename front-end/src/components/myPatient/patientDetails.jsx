import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { getAppointments } from "../../redux/appointmentThunk/appointmentThunk";
import { getPatientMedicalHistory } from "../../redux/medicalHistoryThunk/medicalHistoryThunk";
import { getDoctors } from "../../redux/doctorThunk/doctorThunk";
const statusBadge = {
  Pending: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  Confirmed: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  Completed: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  Cancelled: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
};

function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { appointments, loading: apptLoading, error: apptError } = useSelector(
    (state) => state.appointments
  );
  const {
    medicalHistory,
    loading: historyLoading,
    error: historyError,
  } = useSelector((state) => state.medicalHistory || {});

  console.log("Appointments from Redux:", appointments);
  console.log("Medical history from Redux:", medicalHistory);

   const {user} = useSelector((state) => state.user || {});

   

  //  const currentDoctorMedicalHistory = medicalHistory?.visits?.find(
  //   (visit) => visit?.doctorId?._id === user?._id
  // );

   useEffect(() => {
    dispatch(getDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(getPatientMedicalHistory(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!appointments?.length) {
      dispatch(getAppointments());
    }
  }, [dispatch, appointments?.length]);

  const patientData = useMemo(() => {
    if (!appointments?.length || !id) return null;

    const patientAppointments = appointments.filter(
      (appt) => appt?.patient?._id === id && appt?.doctor?._id === user?._id
    );

    if (!patientAppointments.length) return null;

    const sorted = [...patientAppointments].sort(
      (a, b) =>
        new Date(b?.appointmentDate || 0) -
        new Date(a?.appointmentDate || 0)
    );

    const uniqueClinics = new Set(
      patientAppointments
        .map((appt) => appt?.clinic?._id)
        .filter(Boolean)
    );

    const nextVisit = sorted
      .slice()
      .reverse()
      .find(
        (appt) =>
          new Date(appt?.appointmentDate) > new Date() &&
          appt?.status !== "Completed" &&
          appt?.status !== "Cancelled"
      );

    return {
      info: sorted[0]?.patient,
      visits: sorted,
      counts: {
        total: patientAppointments.length,
        clinics: uniqueClinics.size,
        pending: patientAppointments.filter(
          (appt) => appt?.status === "Pending"
        ).length,
        lastStatus: sorted[0]?.status,
      },
      nextVisit,
    };
  }, [appointments, id]);

  const patient = patientData?.info;
  const visits = patientData?.visits || [];
  const stats = patientData?.counts;
  const nextVisit = patientData?.nextVisit;

  const history =
    medicalHistory && typeof medicalHistory === "object"
      ? medicalHistory
      : null;

  const historyVisits = history?.visits || [];
  const allergies = history?.allergies || [];
  const chronic = history?.chronicDiseases || [];
  const surgeries = history?.pastSurgeries || [];
  const hasHistory = Boolean(history && Object.keys(history).length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-10 md:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
          >
            ← Back
          </button>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
            Patient profile
          </p>
        </header>

        <section className="rounded-[32px] border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-blue-50 p-8 shadow-xl shadow-slate-200/60">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-900/90 text-3xl font-semibold text-white shadow-lg shadow-slate-900/30">
                {patient?.name?.[0]?.toUpperCase() || "P"}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Patient
                </p>
                <h1 className="text-3xl font-semibold text-slate-900">
                  {patient?.name || "Unknown Patient"}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {patient?._id || "—"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
              <InfoPill
                label="Email"
                value={patient?.email || "Not provided"}
              />
              <InfoPill
                label="Phone"
                value={patient?.phone || patient?.contact || "Not provided"}
              />
            </div>
          </div>

          {apptLoading && (
            <p className="mt-6 text-sm text-slate-500">Loading visits…</p>
          )}
          {!apptLoading && !patientData && (
            <p className="mt-6 text-sm text-rose-500">
              No appointments found for this patient.
            </p>
          )}
        </section>

        {patientData && (
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total visits"
              value={stats?.total || 0}
              accent="from-indigo-500 to-blue-500"
            />
            <StatCard
              label="Clinics visited"
              value={stats?.clinics || 0}
              accent="from-emerald-500 to-teal-500"
            />
            <StatCard
              label="Pending actions"
              value={stats?.pending || 0}
              accent="from-amber-500 to-orange-500"
            />
            <StatCard
              label="Last status"
              value={stats?.lastStatus || "—"}
              accent="from-rose-500 to-pink-500"
            />
          </section>
        )}

        {patientData && (
          <section className="grid gap-8 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-200/60 lg:col-span-2">
              <SectionHeading
                title="Latest appointments"
                subtitle="Clinic timeline"
                badge={`${visits.length} entries`}
              />
              <div className="mt-6 space-y-4">
                {visits.map((visit, idx) => (
                  <VisitRow key={visit?._id || idx} visit={visit} />
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-200/60">
                <SectionHeading title="Next visit" subtitle="Schedule" />
                {nextVisit ? (
                  <div className="mt-4 space-y-2">
                    <p className="text-2xl font-semibold text-slate-900">
                      {new Date(
                        nextVisit?.appointmentDate
                      ).toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-600">
                      {nextVisit?.clinic?.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      Status: {nextVisit?.status}
                    </p>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">
                    No upcoming visits scheduled.
                  </p>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-900 text-white p-6 shadow-xl shadow-slate-900/40">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
                  Contact patient
                </p>
                <h3 className="mt-3 text-2xl font-semibold">
                  Need a follow-up?
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  Send a quick message or schedule a call to ensure continuity
                  of care.
                </p>
                <button className="mt-4 w-full rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
                  Message patient
                </button>
              </div>
            </div>
          </section>
        )}

        {hasHistory && (
          <>
            <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-lg shadow-slate-200/60">
              <SectionHeading
                title="Health profile"
                subtitle="Medical insights"
              />
              <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <InsightCard
                  label="Blood group"
                  value={history?.bloodGroup || "—"}
                  accent="from-rose-500 to-pink-500"
                />
                <InsightCard
                  label="Allergies"
                  value={`${allergies.length || 0} noted`}
                  accent="from-amber-500 to-orange-500"
                />
                <InsightCard
                  label="Chronic conditions"
                  value={`${chronic.length || 0} active`}
                  accent="from-indigo-500 to-blue-500"
                />
                <InsightCard
                  label="Past surgeries"
                  value={`${surgeries.length || 0} recorded`}
                  accent="from-emerald-500 to-teal-500"
                />
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <ListSection
                  title="Allergies"
                  items={allergies}
                  emptyLabel="No allergies recorded."
                />
                <ListSection
                  title="Chronic diseases"
                  items={chronic}
                  emptyLabel="No chronic conditions recorded."
                />
                <ListSection
                  title="Past surgeries"
                  items={surgeries.map(
                    (s) =>
                      `${s?.surgeryName || "Procedure"} ${
                        s?.year ? `(${s.year})` : ""
                      }${s?.notes ? ` – ${s.notes}` : ""}`
                  )}
                  emptyLabel="No surgeries recorded."
                />
                <ListSection
                  title="Family & social history"
                  items={[
                    history?.familyHistory,
                    history?.socialHistory,
                  ].filter(Boolean)}
                  emptyLabel="No history provided."
                />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-lg shadow-slate-200/60">
              <SectionHeading
                title="Medical history timeline"
                subtitle="Doctor-authored visits"
              />
              {historyVisits.length ? (
                <div className="mt-8 space-y-6 border-l-2 border-slate-200 pl-6">
                  {historyVisits.map((visit, idx) => (
                    <HistoryTimelineItem key={visit?._id || idx} visit={visit} />
                  ))}
                </div>
              ) : (
                <p className="mt-6 text-sm text-slate-500">
                  No clinician-authored visit notes yet.
                </p>
              )}
            </section>
          </>
        )}

        {(apptError || historyError) && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {historyError || apptError}
          </div>
        )}

        {historyLoading && (
          <div className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
            Fetching medical history…
          </div>
        )}
      </div>
    </div>
  );
}

const InfoPill = ({ label, value }) => (
  <div>
    <p className="uppercase text-xs tracking-[0.2em] text-slate-400">
      {label}
    </p>
    <p className="font-semibold text-slate-800">{value}</p>
  </div>
);

const StatCard = ({ label, value, accent }) => (
  <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-lg shadow-slate-200/60">
    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
      {label}
    </p>
    <div className="mt-3 flex items-end justify-between">
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
      <span
        className={`inline-flex items-center rounded-full bg-gradient-to-r ${accent} px-3 py-1 text-xs font-semibold text-white`}
      >
        Live
      </span>
    </div>
  </div>
);

const InsightCard = ({ label, value, accent }) => (
  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
      {label}
    </p>
    <div className="mt-3 flex items-center justify-between">
      <p className="text-xl font-semibold text-slate-900">{value}</p>
      <span
        className={`inline-flex items-center rounded-full bg-gradient-to-r ${accent} px-3 py-1 text-xs font-semibold text-white`}
      >
        Insight
      </span>
    </div>
  </div>
);

const SectionHeading = ({ title, subtitle, badge }) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
        {subtitle}
      </p>
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
    </div>
    {badge && (
      <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
        {badge}
      </span>
    )}
  </div>
);

const VisitRow = ({ visit }) => (
  <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 transition hover:border-blue-200 hover:bg-white md:flex-row md:items-center">
    <div className="flex-1">
      <p className="text-sm font-semibold text-slate-900">
        {new Date(visit?.appointmentDate).toLocaleString()}
      </p>
      <p className="text-sm text-slate-500">
        {visit?.clinic?.name || "Clinic not set"}
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
        Reason
      </p>
      <p className="text-sm text-slate-600">
        {visit?.reason || "Not provided"}
      </p>
    </div>
    <div className="flex flex-col items-start gap-2 md:w-40 md:items-end">
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
          statusBadge[visit?.status] || "bg-slate-200 text-slate-700"
        }`}
      >
        <span className="h-2 w-2 rounded-full bg-current" />
        {visit?.status}
      </span>
      <p className="text-xs text-slate-400">
        {visit?.paymentStatus || "Payment N/A"}
      </p>
    </div>
  </div>
);

const ListSection = ({ title, items, emptyLabel }) => (
  <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
      {title}
    </p>
    {items?.length ? (
      <ul className="mt-3 space-y-2 text-sm text-slate-700">
        {items.map((item, idx) => (
          <li
            key={`${title}-${idx}`}
            className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200"
          >
            {item}
          </li>
        ))}
      </ul>
    ) : (
      <p className="mt-3 text-sm text-slate-400">{emptyLabel}</p>
    )}
  </div>
);

const HistoryTimelineItem = ({ visit }) => (
  <div className="relative pl-6">
    <span className="absolute left-[-11px] top-2 h-3 w-3 rounded-full border-4 border-white bg-emerald-500 shadow" />
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 shadow-sm">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {new Date(visit?.visitDate || visit?.createdAt || Date.now()).toLocaleString()}
        </span>
        <span className="rounded-full bg-slate-900/10 px-3 py-1 font-semibold text-slate-700">
          {visit?.clinicId?.name || visit?.clinic?.name || "Clinic"}
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-900">
        {visit?.diagnosis || "Diagnosis not set"}
      </p>
      {visit?.symptoms && (
        <p className="text-xs text-slate-500">
          Symptoms: <span className="text-slate-700">{visit.symptoms}</span>
        </p>
      )}
      {visit?.medicines?.length ? (
        <p className="text-xs text-slate-500">
          Medicines:{" "}
          <span className="text-slate-700">
            {visit.medicines
              .map(
                (med) =>
                  `${med?.name || "Drug"} ${med?.dosage || ""} ${med?.frequency || ""} ${med?.duration || ""}`
              )
              .join(" • ")}
          </span>
        </p>
      ) : null}
      {visit?.tests?.length ? (
        <p className="text-xs text-slate-500">
          Tests:{" "}
          <span className="text-slate-700">
            {visit.tests
              .map((test) => `${test?.testName || "Test"} (${test?.status || "Pending"})`)
              .join(" • ")}
          </span>
        </p>
      ) : null}
      {visit?.advice && (
        <p className="text-xs text-slate-500">
          Advice: <span className="text-slate-700">{visit.advice}</span>
        </p>
      )}
    </div>
  </div>
);

export default PatientDetails;