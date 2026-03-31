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
      <div className="flex h-screen items-center justify-center text-xl text-red-500">
        Doctor not found
      </div>
    );
  }

  const profilePictureUrl = doctor?.profilePicture
    ? `${BASE_URL}/${doctor.profilePicture.replace(/\\/g, "/")}`
    : "https://via.placeholder.com/150";

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 md:px-10">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* PROFILE HEADER */}

        <div className="rounded-3xl bg-white shadow-lg p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">

          <img
            src={profilePictureUrl}
            alt="doctor"
            className="h-32 w-32 rounded-2xl object-cover shadow"
          />

          <div className="flex-1 text-center md:text-left">

            <h1 className="text-3xl font-bold text-slate-900">
              Dr. {doctor.name}
            </h1>

            <p className="text-slate-500 mt-1">
              {doctor.specializations?.join(", ")}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              🏥 {doctor.clinic?.name || "Clinic not assigned"}
            </p>

            <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">

              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                {doctor.experience} Years Experience
              </span>

              <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                Available
              </span>

            </div>
          </div>

          {user?.role?.toLowerCase() === "admin" && (
            <button
              onClick={() => setShowMessageModal(true)}
              className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700"
            >
              Message Doctor
            </button>
          )}
        </div>

        {/* INFO GRID */}

        <div className="grid gap-6 md:grid-cols-2">

          {/* PROFESSIONAL INFO */}

          <div className="bg-white rounded-2xl shadow p-6 space-y-4">

            <h2 className="text-xl font-semibold text-slate-800">
              Professional Info
            </h2>

            <InfoRow label="Experience" value={`${doctor.experience} Years`} />
            <InfoRow label="Specializations" value={doctor.specializations?.join(", ")} />
            <InfoRow label="Availability" value={doctor.availability} />

          </div>

          {/* CONTACT INFO */}

          <div className="bg-white rounded-2xl shadow p-6 space-y-4">

            <h2 className="text-xl font-semibold text-slate-800">
              Contact Information
            </h2>

            <InfoRow label="Email" value={doctor.email} />
            <InfoRow label="Phone" value={doctor.phone} />
            <InfoRow label="Clinic" value={doctor.clinic?.name} />

          </div>

        </div>

        {/* QUALIFICATIONS */}

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Qualifications
          </h2>

          <div className="flex flex-wrap gap-3">

            {doctor.qualifications?.map((q, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium"
              >
                {q}
              </span>
            ))}

          </div>
        </div>

        {/* META */}

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Account Info
          </h2>

          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">

            <div>
              <span className="font-semibold">Created At:</span>{" "}
              {new Date(doctor.createdAt).toLocaleDateString()}
            </div>

            <div>
              <span className="font-semibold">Doctor ID:</span> {doctor._id}
            </div>

          </div>

        </div>

      </div>

      {/* MESSAGE MODAL */}

      {showMessageModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowMessageModal(false)}
        >

          <div
            className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              onClick={() => setShowMessageModal(false)}
              className="absolute top-4 right-4 text-slate-500"
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

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value || "-"}</span>
    </div>
  );
}

export default DoctorDetails;