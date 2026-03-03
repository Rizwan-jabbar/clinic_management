import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getClinics } from "../../redux/clinicThunk/clinicThunk";
import { getDoctors } from "../../redux/doctorThunk/doctorThunk";

const ClinicDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { clinics, loading } = useSelector((state) => state.clinics);
  const { doctors } = useSelector((state) => state.doctors);

  const clinic = clinics?.find((item) => item._id === id);
  const clinicDoctors = doctors?.filter((doc) => doc?.clinic?._id === id);

  useEffect(() => {
    if (!clinics?.length) {
      dispatch(getClinics());
    }
    if (!doctors?.length) {
      dispatch(getDoctors());
    }
  }, [dispatch, clinics?.length, doctors?.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <p className="text-blue-600 font-semibold text-lg animate-pulse">
          Loading clinic details…
        </p>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <p className="text-rose-600 font-bold text-xl">
          Clinic not found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-10 md:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Hero */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-500">
                Clinic
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                {clinic.name}
              </h1>
              <p className="text-sm text-slate-500">{clinic.location}</p>
            </div>
            <span
              className={`self-start rounded-full px-4 py-1 text-xs font-semibold ${
                clinic.status === "Active"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {clinic.status}
            </span>
          </div>
        </section>

        {/* Detail grid */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailBox title="👩‍⚕️ Doctors" value={clinic.doctors} />
            <DetailBox title="🏥 Capacity" value={clinic.capacity} />
            <DetailBox title="📍 Location" value={clinic.location} />
            <DetailBox title="📞 Phone" value={clinic.phone} />
            <DetailBox
              title="🕒 Timings"
              value={`${clinic.openingTime} – ${clinic.closingTime}`}
            />
            <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                📝 Description
              </p>
              <p className="text-sm text-slate-700">
                {clinic.description || "No description provided."}
              </p>
            </div>
          </div>
        </section>

        {/* Doctors table */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              👨‍⚕️ Assigned Doctors
            </h2>
            <span className="text-sm text-slate-500">
              {clinicDoctors?.length || 0} linked
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="min-w-full text-sm text-slate-700">
              <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Specialization</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {clinicDoctors?.length ? (
                  clinicDoctors.map((doc) => (
                    <tr
                      key={doc._id}
                      className="border-t border-slate-100 hover:bg-blue-50/30"
                    >
                      <td className="px-4 py-3">
                        <NavLink
                          to={`/doctors/${doc._id}`}
                          className="text-blue-600 font-medium hover:underline"
                        >
                          {doc.name}
                        </NavLink>
                      </td>
                      <td className="px-4 py-3">
                        {doc.specializations?.join(", ") || "N/A"}
                      </td>
                      <td className="px-4 py-3">{doc.phone || "N/A"}</td>
                      <td className="px-4 py-3 break-all">
                        {doc.email || "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      No doctors assigned yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

const DetailBox = ({ title, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {title}
    </p>
    <p className="mt-2 text-lg font-semibold text-slate-900">
      {value || "N/A"}
    </p>
  </div>
);

export default ClinicDetails;