import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";
import { getPatientMedicalHistory } from "../../redux/medicalHistoryThunk/medicalHistoryThunk";
import { getAppointments } from "../../redux/appointmentThunk/appointmentThunk";

const MyMedicalHistory = () => {
  const dispatch = useDispatch();
  const { user, loading: userLoading } = useSelector((state) => state.user);
  const {
    medicalHistory,
    loading: historyLoading,
    error: historyError,
  } = useSelector((state) => state.medicalHistory || {});
  const {
    appointments,
    loading: appointmentLoading,
  } = useSelector((state) => state.appointments || {});

  const patientId = user?._id;

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (patientId) {
      dispatch(getPatientMedicalHistory(patientId));
      dispatch(getAppointments());
    }
  }, [dispatch, patientId]);

  const visitStats = useMemo(() => {
    if (!appointments?.length || !patientId) return null;

    const myVisits = appointments.filter(
      (appt) => appt?.patient?._id === patientId
    );

    return {
      total: myVisits.length,
      completed: myVisits.filter((v) => v.status === "Completed").length,
      pending: myVisits.filter((v) => v.status === "Pending").length,
      upcoming: myVisits.filter(
        (v) =>
          new Date(v.appointmentDate) > new Date() &&
          v.status !== "Completed" &&
          v.status !== "Cancelled"
      ).length,
    };
  }, [appointments, patientId]);

  const history = medicalHistory && typeof medicalHistory === "object"
    ? medicalHistory
    : null;

  const timeline = history?.visits || [];
  const allergies = history?.allergies || [];
  const chronic = history?.chronicDiseases || [];
  const surgeries = history?.pastSurgeries || [];

  const isLoading = userLoading || historyLoading || appointmentLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-10 md:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-500">
                My records
              </p>
              <h1 className="text-3xl font-semibold text-slate-900">
                Medical History
              </h1>
              <p className="text-sm text-slate-500">
                Secure summary of allergies, chronic conditions, surgeries, and doctor visits.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
              {visitStats?.total || 0} total visits
            </div>
          </div>
        </header>

        {isLoading ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
            <p className="text-sm text-slate-500">Loading your medical history…</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          </section>
        ) : historyError ? (
          <section className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 shadow-lg shadow-rose-100/80">
            {historyError}
          </section>
        ) : !history ? (
          <section className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-slate-500 shadow-lg shadow-slate-200/50">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
              📋
            </div>
            No medical history has been recorded yet.
          </section>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <InfoCard label="Allergies" value={allergies.length} accent="from-amber-500 to-orange-500" />
              <InfoCard label="Chronic conditions" value={chronic.length} accent="from-rose-500 to-pink-500" />
              <InfoCard label="Past surgeries" value={surgeries.length} accent="from-indigo-500 to-blue-500" />
              <InfoCard label="Completed visits" value={visitStats?.completed || 0} accent="from-emerald-500 to-teal-500" />
            </section>

            <section className="grid gap-8 lg:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-lg shadow-slate-200/60 lg:col-span-2">
                <SectionHeading title="Health profile" subtitle="Allergies & conditions">
                  <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                    Updated {new Date(history?.updatedAt || history?.createdAt || new Date()).toLocaleDateString()}
                  </span>
                </SectionHeading>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <ListCard title="Allergies" items={allergies} emptyText="No allergies recorded." />
                  <ListCard title="Chronic diseases" items={chronic} emptyText="No chronic conditions recorded." />
                  <ListCard
                    title="Past surgeries"
                    items={
                      surgeries.length
                        ? surgeries.map(
                            (surgery) =>
                              `${surgery?.surgeryName || "Procedure"} ${
                                surgery?.year ? `(${surgery.year})` : ""
                              }${surgery?.notes ? ` – ${surgery.notes}` : ""}`
                          )
                        : []
                    }
                    emptyText="No surgeries recorded."
                  />
                  <ListCard
                    title="Family & social history"
                    items={[
                      history?.familyHistory ? `Family: ${history.familyHistory}` : null,
                      history?.socialHistory ? `Social: ${history.socialHistory}` : null,
                    ].filter(Boolean)}
                    emptyText="No family/social history added."
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-lg shadow-slate-200/60">
                  <SectionHeading title="Visit overview" subtitle="Appointments" />
                  <div className="mt-6 space-y-3 text-sm text-slate-600">
                    <StatRow label="Total visits" value={visitStats?.total || 0} />
                    <StatRow label="Completed" value={visitStats?.completed || 0} />
                    <StatRow label="Pending" value={visitStats?.pending || 0} />
                    <StatRow label="Upcoming" value={visitStats?.upcoming || 0} />
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-900 text-white p-6 shadow-xl shadow-slate-900/40">
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
                    Export
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold">Need a PDF copy?</h3>
                  <p className="mt-2 text-sm text-white/70">
                    Download your medical summary for consults or second opinions.
                  </p>
                  <button className="mt-4 w-full rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
                    Export summary
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-lg shadow-slate-200/60">
              <SectionHeading title="Medical history timeline" subtitle="Doctor-authored visits" />
              {timeline.length ? (
                <div className="mt-8 space-y-6 border-l-2 border-slate-200 pl-6">
                  {timeline.map((visit, idx) => (
                    <TimelineItem key={visit?._id || idx} visit={visit} />
                  ))}
                </div>
              ) : (
                <p className="mt-6 text-sm text-slate-500">
                  No clinician visit notes have been recorded yet.
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

const InfoCard = ({ label, value, accent }) => (
  <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-lg shadow-slate-200/60">
    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{label}</p>
    <div className="mt-3 flex items-center justify-between">
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
      <span className={`inline-flex items-center rounded-full bg-gradient-to-r ${accent} px-3 py-1 text-xs font-semibold text-white`}>
        Live
      </span>
    </div>
  </div>
);

const SectionHeading = ({ title, subtitle, children }) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{subtitle}</p>
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
    </div>
    {children}
  </div>
);

const ListCard = ({ title, items, emptyText }) => (
  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{title}</p>
    {items?.length ? (
      <ul className="mt-3 space-y-2 text-sm text-slate-700">
        {items.map((item, idx) => (
          <li key={`${title}-${idx}`} className="rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
            {item}
          </li>
        ))}
      </ul>
    ) : (
      <p className="mt-3 text-sm text-slate-400">{emptyText}</p>
    )}
  </div>
);

const StatRow = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-xl bg-slate-900/5 px-4 py-2">
    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
      {label}
    </span>
    <span className="text-lg font-semibold text-slate-900">{value}</span>
  </div>
);

const TimelineItem = ({ visit }) => (
  <div className="relative pl-6">
    <span className="absolute left-[-11px] top-2 h-3 w-3 rounded-full border-4 border-white bg-emerald-500 shadow" />
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 shadow-sm">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{new Date(visit?.visitDate || visit?.createdAt || Date.now()).toLocaleString()}</span>
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

export default MyMedicalHistory;