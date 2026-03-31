import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";
import { getAppointments } from "../../redux/appointmentThunk/appointmentThunk";
import { NavLink } from "react-router-dom";

function MyPatient() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { appointments, loading } = useSelector((state) => state.appointments);
  
  const patients = appointments?.filter(
    (pat) => pat.doctor._id === user?._id
  );
  const uniquePatients = Array.from(
    new Map(
      (patients || [])
        .filter((appt) => appt?.patient?._id) // guard against missing data
        .map((appt) => [appt.patient._id, appt])
    ).values()
  );
  console.log("Appointments:", appointments);


useEffect(() => {
  if (!user) { 
    dispatch(fetchUserProfile());
  }

  if (!appointments || appointments.length === 0) { 
    dispatch(getAppointments());
  }
}, [dispatch, user, appointments]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-10 md:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-500">
            Patients
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">
                My Patients
              </h1>
              <p className="text-sm text-slate-500">
                Track bookings, payment status, and clinic context at a glance.
              </p>
            </div>
            <span className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
              {uniquePatients?.length || 0} listed
            </span>
          </div>
        </header>

        {loading ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
            <p className="text-sm font-semibold text-blue-600">
              Loading patients…
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-36 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          </section>
        ) : uniquePatients && uniquePatients.length > 0 ? (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
            {uniquePatients.map((appointment) => (
              <NavLink  to={`/myPatients/${appointment.patient._id}`}>
              <article
                key={appointment._id}
                className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-lg shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {appointment.patient.name}
                    </h2>
                    <p className="text-sm text-slate-500 break-all">
                      {appointment.patient.email}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl font-semibold text-blue-600">
                    {appointment.patient.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div className="mt-4 space-y-1 text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-800">
                      Clinic:
                    </span>{" "}
                    {appointment.clinic?.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">
                      Date:
                    </span>{" "}
                    {new Date(
                      appointment.appointmentDate
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      appointment.status === "Cancelled"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {appointment.status}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      appointment.paymentStatus === "Unpaid"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {appointment.paymentStatus}
                  </span>
                </div>
              </article>
              </NavLink>
            ))}
          </section>
        ) : (
          <section className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-slate-500 shadow-lg shadow-slate-200/50">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
              📋
            </div>
            No patients found yet.
          </section>
        )}
      </div>
    </div>
  );
}

export default MyPatient;