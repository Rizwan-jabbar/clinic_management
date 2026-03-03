import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import DoctorCard from "./doctoeCard";
import { getDoctors } from "../../redux/doctorThunk/doctorThunk";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";

const DoctorsList = () => {
  const dispatch = useDispatch();
  const { doctors, loading } = useSelector((state) => state.doctors);
  const { user } = useSelector((state) => state.user);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getDoctors());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch, user?._id]);

  const onlyDoctors = doctors?.filter(
    (doc) => doc.role === "doctor" || doc.role === "Doctor"
  );

  const filteredDoctors = onlyDoctors?.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalDoctors = filteredDoctors?.length || 0;
  const isAdmin = user?.role?.toLowerCase() === "admin";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-10 md:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Directory
              </p>
              <h1 className="text-3xl font-semibold text-slate-900">
                Meet Our Doctors
              </h1>
              <p className="text-sm text-slate-500">
                Search, browse, and manage clinic specialists.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
              <span>Total</span>
              <span className="text-lg font-semibold text-slate-900">
                {totalDoctors}
              </span>
              <span>Doctors</span>
            </div>
          </div>
        </section>

        {/* Filters & actions */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="w-full md:max-w-md">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Search
              </label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-600 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                <span className="text-slate-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search doctor by name..."
                  className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {isAdmin && (
              <NavLink to="/addDoctor" className="w-full md:w-auto">
                <button className="w-full rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:bg-blue-700">
                  + Add Doctor
                </button>
              </NavLink>
            )}
          </div>
        </section>

        {/* Loading state */}
        {loading && (
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="h-28 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && totalDoctors === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-lg shadow-slate-200/40">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl text-blue-500">
              🩺
            </div>
            <p className="text-lg font-semibold text-slate-800">
              No Doctors Found
            </p>
            <p className="text-sm text-slate-500">
              Try a different name, or add a new doctor if you’re an admin.
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && totalDoctors > 0 && (
          <section className="grid gap-6 sm:grid-cols-2 ">
            {filteredDoctors?.map((doctor) => (
              <NavLink
                key={doctor._id}
                to={`/doctors/${doctor._id}`}
                className="group relative rounded-3xl border border-slate-200 bg-white p-[2px] shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >
                <div className="h-full rounded-[28px] bg-gradient-to-b from-white to-slate-50 p-4">
                  <DoctorCard doctor={doctor} />
                </div>
                <span className="pointer-events-none absolute inset-0 rounded-[28px] border border-transparent transition group-hover:border-blue-100" />
              </NavLink>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;