import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteDoctor } from "../../redux/doctorThunk/doctorThunk";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";
import AppointmentForm from "../appointment/appoinment";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const colors = [
  "bg-blue-100 border-blue-400",
  "bg-green-100 border-green-400",
  "bg-purple-100 border-purple-400",
  "bg-pink-100 border-pink-400",
  "bg-yellow-100 border-yellow-400",
];

const DoctorCard = ({ doctor }) => {
  const dispatch = useDispatch();

  const [status, setStatus] = useState("Active");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.user);

  /* ✅ Fetch user once */
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  /* ✅ Random Card Color */
  const cardColor =
    colors[parseInt(doctor?._id?.slice(-1), 16) % colors.length] ||
    "bg-gray-100 border-gray-400";

  /* ✅ Image */
  const profilePictureUrl = doctor?.profilePicture
    ? `${BASE_URL}/${doctor.profilePicture.replace(/\\/g, "/")}`
    : null;

  /* ✅ Delete Doctor */
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

  /* ✅ Toggle Status */
  const handleToggle = () => {
    setStatus((prev) => (prev === "Active" ? "Inactive" : "Active"));
  };

  return (
    <>
      {/* ================= CARD ================= */}
      <div
        className={`relative rounded-3xl shadow-lg p-6 border-2 transition hover:shadow-2xl mb-8 mt-6 ${cardColor}`}
      >
        {/* Image */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
          <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
            {doctor?.profilePicture ? (
              <img
                src={profilePictureUrl}
                alt="doctor"
                className="w-full h-full object-cover"
              />
            ) : (
              doctor?.name?.charAt(0)
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mt-12 text-center">
          <h2 className="text-xl font-bold">{doctor?.name}</h2>

          <p className="text-sm text-gray-700 mt-1">
            🩺 {doctor?.specializations?.join(", ")}
          </p>

          <div className="mt-3 space-y-1 text-sm">
            <p>🎓 {doctor?.experience} Years</p>
            <p>🏥 {doctor?.clinic?.name}</p>
            <p>📧 {doctor?.email}</p>
            <p>📞 {doctor?.phone}</p>
            <p>📅 {doctor?.availability}</p>
          </div>

          {/* Status */}
          <div className="mt-3">
            <span
              className={`text-xs px-3 py-1 rounded-full text-white ${
                status === "Active" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {status}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-4">
            {user?.role === "admin" ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleToggle();
                  } }
                  type="button"
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-xl text-sm"
                >
                  Toggle Status
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowConfirm(true)
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl text-sm"
                >
                  Delete
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowAppointment(true);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm"
              >
                Book Appointment
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= DELETE MODAL ================= */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center">
            <h3 className="text-lg font-bold">Delete Doctor</h3>

            <p className="text-sm mt-3">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{doctor?.name}</span>?
            </p>

            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowConfirm(false);
                }}
                className="flex-1 bg-gray-300 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleDelete(doctor?._id);
                  setShowConfirm(false);
                }}
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg"
              >
                {loading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= APPOINTMENT MODAL ================= */}
      {showAppointment && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
          onClick={() => setShowAppointment(false)} // ✅ close outside click
        >
          <div onClick={(e) =>{
            e.preventDefault();
             e.stopPropagation()}}>
            <AppointmentForm
              doctorName={doctor?.name}
              clinicName={doctor?.clinic?.name}
              doctorId={doctor?._id}
              clinicId={doctor?.clinic?._id}
              onClose={() => setShowAppointment(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorCard;