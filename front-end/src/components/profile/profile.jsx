import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

function Profile() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <p className="text-lg font-semibold text-blue-600">Loading profile…</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <p className="text-lg font-semibold text-rose-600">
          {error || "User not found"}
        </p>
      </div>
    );
  }

  const profileImage = user.profilePicture
    ? `${BASE_URL}/${user.profilePicture.replace(/\\/g, "/")}`
    : "https://via.placeholder.com/150";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-10 md:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Hero */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-3xl border-4 border-white bg-slate-100 shadow-lg">
              <img
                src={profileImage}
                alt="profile"
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-500">
                Profile
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                {user.name}
              </h1>
              <p className="text-sm text-slate-500">
                Role · {user.role || "N/A"}
              </p>
              <p className="mt-1 text-xs text-slate-400">ID: {user._id}</p>
            </div>
          </div>
        </section>

        {/* Info grid */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
          <div className="grid gap-4 sm:grid-cols-2">
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
        </section>
      </div>
    </div>
  );
}

function InfoCard({ title, icon, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-inner shadow-white">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {icon} {title}
      </p>
      <p className="mt-2 text-lg font-semibold text-slate-900 break-words">
        {children}
      </p>
    </div>
  );
}

export default Profile;