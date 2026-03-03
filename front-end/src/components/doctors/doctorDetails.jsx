import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { getDoctors } from "../../redux/doctorThunk/doctorThunk";
import Messages from "../messages/messages";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

function DoctorDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { doctors, loading } = useSelector((state) => state.doctors);
  const { user } = useSelector((state) => state.user);
  const lowerCaseRole = user?.role?.toLowerCase();

  const [showMessageModal, setShowMessageModal] = useState(false);

  const doctor = useMemo(() => {
    return doctors?.find((doc) => doc?._id?.toString() === id);
  }, [doctors, id]);

  useEffect(() => {
    if (!doctors || doctors.length === 0) {
      dispatch(getDoctors());
    }
  }, [dispatch, doctors]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl text-slate-600">
        Loading doctor profile...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex h-screen items-center justify-center text-xl text-rose-500">
        Doctor not found
      </div>
    );
  }

  const profilePictureUrl = doctor?.profilePicture
    ? `${BASE_URL}/${doctor.profilePicture.replace(/\\/g, "/")}`
    : "https://via.placeholder.com/150";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-10 md:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),transparent_55%)]" />
          <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-8">
            <div className="mx-auto h-32 w-32 overflow-hidden rounded-3xl border-4 border-white shadow-xl shadow-blue-500/20 md:mx-0">
              <img
                src={profilePictureUrl}
                alt="doctor"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-500">
                Specialist
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                {doctor.name}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {doctor.specializations?.length
                  ? `🩺 ${doctor.specializations.join(", ")}`
                  : "🩺 Specialization not provided"}
              </p>
              <p className="text-sm text-slate-500">
                🏥 {doctor.clinic?.name || "No clinic assigned"}
              </p>
            </div>

            {lowerCaseRole === "admin" && (
              <button
                onClick={() => setShowMessageModal(true)}
                className="mt-4 w-full rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700 md:ml-auto md:w-auto"
              >
                Message Doctor
              </button>
            )}
          </div>
        </section>

        {/* Info grid */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard title="Experience" icon="🎓">
            {doctor.experience || 0} Years
          </InfoCard>
          <InfoCard title="Email" icon="📧">
            {doctor.email || "Not provided"}
          </InfoCard>
          <InfoCard title="Phone" icon="📞">
            {doctor.phone || "Not provided"}
          </InfoCard>
          <InfoCard title="Availability" icon="📅">
            {doctor.availability || "Not provided"}
          </InfoCard>
        </section>
      </div>

      {/* Message modal */}
      {showMessageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
          onClick={() => setShowMessageModal(false)}
        >
          <div
            className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowMessageModal(false)}
              className="absolute right-5 top-5 rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-rose-200 hover:text-rose-500"
              aria-label="Close modal"
            >
              ✕
            </button>
            <Messages doctorId={doctor._id} />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ title, icon, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {icon} {title}
      </p>
      <p className="mt-2 text-lg font-semibold text-slate-900 break-words">
        {children}
      </p>
    </div>
  );
}

export default DoctorDetails;