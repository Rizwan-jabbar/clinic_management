import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

function Profile() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);
  console.log("USER PROFILE ===>", user);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        User Not Found
      </div>
    );
  }

  const profileImage = user.profilePicture
    ? `${BASE_URL}/${user.profilePicture.replace(/\\/g, "/")}`
    : "https://via.placeholder.com/150";

  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-6 flex justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-4 md:p-6 w-full max-w-6xl">

        {/* ===== HEADER ===== */}
        <div className="flex flex-col md:flex-row items-center gap-6">

          {/* IMAGE */}
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-blue-500 shadow">
            <img
              src={profileImage}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* INFO */}
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {user.name}
            </h1>

            <p className="text-blue-600 font-medium mt-1">
              🩺 {user.role || "N/A"}
            </p>

            <p className="text-gray-400 text-xs mt-1">
              🆔 ID: {user._id}
            </p>
          </div>
        </div>

        {/* ===== DETAILS ===== */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <InfoCard title="Email" icon="📧">
            {user.email || "N/A"}
          </InfoCard>

          <InfoCard title="Experience" icon="🎓">
            {user.experience || 0} Years
          </InfoCard>

          <InfoCard title="Phone" icon="📞">
            {user.phone || "N/A"}
          </InfoCard>

          <InfoCard title="Created At" icon="⏰">
            {user.createdAt
              ? new Date(user.createdAt).toLocaleString()
              : "N/A"}
          </InfoCard>

          <InfoCard title="Updated At" icon="🔄">
            {user.updatedAt
              ? new Date(user.updatedAt).toLocaleString()
              : "N/A"}
          </InfoCard>

        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE CARD ================= */

function InfoCard({ title, icon, children }) {
  return (
    <div className="bg-gray-50 p-3 md:p-4 rounded-xl shadow-sm hover:shadow-md transition border border-gray-200">
      <p className="text-xs md:text-sm text-gray-500 mb-1">
        {icon} {title}
      </p>

      <p className="text-sm md:text-base font-semibold text-gray-800 break-words">
        {children}
      </p>
    </div>
  );
}

export default Profile;