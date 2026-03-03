import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getDoctors } from "../../redux/doctorThunk/doctorThunk";
import { useEffect, useState, useMemo } from "react";
import Messages from "../messages/messages";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

function DoctorDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { doctors, loading } = useSelector((state) => state.doctors);

  const {user} = useSelector((state) => state.user);
  const lowerCaseRole = user?.role?.toLowerCase();

  const [showMessageModal, setShowMessageModal] = useState(false);

  /* ================= SAFE DOCTOR FIND ================= */
  const doctor = useMemo(() => {
    return doctors?.find((doc) => doc?._id?.toString() === id);
  }, [doctors, id]);

  /* ================= FETCH DOCTORS ================= */
  useEffect(() => {
    if (!doctors || doctors.length === 0) {
      dispatch(getDoctors());
    }
  }, [dispatch, doctors]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        Doctor Not Found
      </div>
    );
  }

  const profilePictureUrl = doctor?.profilePicture
    ? `${BASE_URL}/${doctor.profilePicture.replace(/\\/g, "/")}`
    : "https://via.placeholder.com/150";

  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-6 flex justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-4 md:p-6 w-full max-w-6xl relative">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center gap-6">

          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow">
            <img
              src={profilePictureUrl}
              alt="doctor"
              className="w-full h-full object-cover"
            />
          </div>

          {
            lowerCaseRole === "admin" && (
              <button
            onClick={() => setShowMessageModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md"
          >
            Message Doctor
          </button>
            )
          }

          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-800">
              {doctor.name}
            </h1>

            <p className="text-blue-600 mt-1">
              🩺 {doctor.specializations?.join(", ") || "N/A"}
            </p>

            <p className="text-gray-500 text-sm mt-1">
              🏥 {doctor.clinic?.name || "No Clinic"}
            </p>
          </div>
        </div>

        {/* DETAILS */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard title="Experience" icon="🎓">
            {doctor.experience || 0} Years
          </InfoCard>

          <InfoCard title="Email" icon="📧">
            {doctor.email || "N/A"}
          </InfoCard>

          <InfoCard title="Phone" icon="📞">
            {doctor.phone || "N/A"}
          </InfoCard>

          <InfoCard title="Availability" icon="📅">
            {doctor.availability || "N/A"}
          </InfoCard>
        </div>

        {/* MESSAGE MODAL */}
        {showMessageModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-4 relative">

              <button
                onClick={() => setShowMessageModal(false)}
                className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
              >
                ✕
              </button>

              <Messages doctorId={doctor._id} />

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ title, icon, children }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200">
      <p className="text-sm text-gray-500 mb-1">
        {icon} {title}
      </p>
      <p className="font-semibold text-gray-800 break-words">
        {children}
      </p>
    </div>
  );
}

export default DoctorDetails;