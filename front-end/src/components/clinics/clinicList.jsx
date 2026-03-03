import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { deleteClinic, getClinics } from "../../redux/clinicThunk/clinicThunk";
import ClinicItem from "./clinicItems";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";

const ClinicList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clinics = useSelector((state) => state.clinics.clinics);
  const loading = useSelector((state) => state.clinics.loading);
  const message = useSelector((state) => state.clinics.message);
  const { user } = useSelector((state) => state.user);
  const lowerCaseRole = user?.role?.toLowerCase();

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getClinics());
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const filteredClinics = search
    ? clinics?.filter((clinic) =>
        clinic?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : clinics;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-10 md:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
            Clinics
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">
                Discover care locations
              </h1>
              <p className="text-sm text-slate-500">
                Browse clinics, filter results, and manage your network in a single view.
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
              <span>Total</span>
              <span className="text-lg font-semibold text-slate-900">
                {filteredClinics?.length || 0}
              </span>
              <span>Clinics</span>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Search Clinics
              </label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-600 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                <span className="text-slate-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search clinic..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {lowerCaseRole === "admin" && (
              <NavLink to="/addClinic" className="w-full md:w-auto">
                <button className="w-full rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:bg-blue-700">
                  + Add Clinic
                </button>
              </NavLink>
            )}
          </div>
        </section>

        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
            <p className="text-sm font-semibold text-blue-600">Loading clinics...</p>
            <div className="mt-4 space-y-3">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          </div>
        )}

        {!loading && (
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40">
            {filteredClinics?.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center text-slate-500">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
                  🏥
                </div>
                <p className="text-lg font-semibold text-slate-800">
                  No clinics found
                </p>
                <p className="text-sm text-slate-500">
                  Try adjusting your search keywords or add a new clinic if you’re an admin.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredClinics.map((clinic) => (
                  <NavLink
                    to={`/clinics/${clinic._id}`}
                    key={clinic._id || clinic.id}
                    className="group rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-[2px] shadow-md transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                  >
                    <div className="h-full rounded-[28px] bg-white p-4">
                      <ClinicItem clinic={clinic} />
                    </div>
                  </NavLink>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default ClinicList;