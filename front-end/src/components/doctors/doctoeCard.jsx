import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteDoctor } from "../../redux/doctorThunk/doctorThunk";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";
import AppointmentForm from "../appointment/appoinment";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const colors = [
  "border-blue-100 bg-gradient-to-br from-white to-blue-50",
  "border-teal-100 bg-gradient-to-br from-white to-teal-50",
  "border-amber-100 bg-gradient-to-br from-white to-amber-50",
  "border-purple-100 bg-gradient-to-br from-white to-purple-50",
  "border-rose-100 bg-gradient-to-br from-white to-rose-50",
];

const ModalPortal = ({ children }) => {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
};

const DoctorCard = ({ doctor }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [status, setStatus] = useState("Active");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const profilePictureUrl = doctor?.profilePicture
    ? `${BASE_URL}/${doctor.profilePicture.replace(/\\/g, "/")}`
    : null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      await dispatch(deleteDoctor(doctor._id)).unwrap();
      setShowConfirm(false);
    } catch (error) {
      console.log("Delete Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setStatus((prev) => (prev === "Active" ? "Inactive" : "Active"));
  };

  const cardColor =
    colors[parseInt(doctor?._id?.slice(-1), 16) % colors.length] ||
    "border-slate-200 bg-white";

  return (
    <>
      <div
        className={`relative rounded-3xl ${cardColor} p-6 pt-12 shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-xl`}
      >
        <div className="absolute -top-10 left-1/2 w-24 -translate-x-1/2 rounded-3xl border-4 border-white bg-white p-1 shadow-lg shadow-slate-300">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-2xl font-semibold text-slate-500">
            {profilePictureUrl ? (
              <img
                src={profilePictureUrl}
                alt="doctor"
                className="h-full w-full object-cover"
              />
            ) : (
              doctor?.name?.charAt(0)
            )}
          </div>
        </div>

        <div className="flex flex-col items-center text-center mt-4">
          <span
            className={`mb-3 rounded-full px-3 py-1 text-xs font-semibold ${
              status === "Active"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {status}
          </span>

          <h2 className="text-xl font-semibold text-slate-900">
            {doctor?.name}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            🩺 {doctor?.specializations?.join(", ") || "Specialization not set"}
          </p>

          <div className="mt-4 w-full rounded-2xl bg-white/80 p-4 text-sm text-slate-600 shadow-inner shadow-white">
            <div className="flex flex-col gap-2">
              <p>🎓 {doctor?.experience || 0} Years</p>
              <p>🏥 {doctor?.clinic?.name || "Clinic not added"}</p>
              <p>📧 {doctor?.email || "Email unavailable"}</p>
              <p>📞 {doctor?.phone || "Phone unavailable"}</p>
              <p>📅 {doctor?.availability || "Schedule not provided"}</p>
            </div>
          </div>

          <div className="mt-5 flex w-full flex-col gap-3 sm:flex-row">
            {user?.role === "admin" ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleToggle();
                  }}
                  className="flex-1 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
                >
                  Toggle Status
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowConfirm(true);
                  }}
                  className="flex-1 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                >
                  Delete
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowAppointment(true);
                }}
                className="flex-1 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:bg-blue-700"
              >
                Book Appointment
              </button>
            )}
          </div>
        </div>
      </div>

      {showConfirm && (
        <ModalPortal>
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 px-4 py-6"
            onClick={() => setShowConfirm(false)}
          >
            <div
              className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-slate-900">
                Delete Doctor
              </h3>
              <p className="mt-3 text-sm text-slate-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-800">
                  {doctor?.name}
                </span>
                ?
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleDelete(doctor?._id)}
                  className="flex-1 rounded-2xl bg-rose-600 py-2 text-sm font-semibold text-white shadow shadow-rose-500/40 transition hover:bg-rose-700 disabled:opacity-60"
                >
                  {loading ? "Deleting..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {showAppointment && (
        <ModalPortal>
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 px-4 py-6"
            onClick={() => setShowAppointment(false)}
          >
            <div
              className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <AppointmentForm
                doctorName={doctor?.name}
                clinicName={doctor?.clinic?.name}
                doctorId={doctor?._id}
                clinicId={doctor?.clinic?._id}
                onClose={() => setShowAppointment(false)}
              />
            </div>
          </div>
        </ModalPortal>
      )}
    </>
  );
};

export default DoctorCard;