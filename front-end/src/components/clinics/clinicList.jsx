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

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    dispatch(getClinics());
    dispatch(fetchUserProfile());
  }, [dispatch]);

  /* ================= SEARCH FILTER ================= */
  const filteredClinics = search
    ? clinics?.filter((clinic) =>
      clinic?.name?.toLowerCase().includes(search.toLowerCase())
    )
    : clinics;


  return (
    <div className="p-6">

      {/* ================= SEARCH + ADD ================= */}
      <div className="flex justify-between items-center gap-3 mb-8">

        <input
          type="text"
          placeholder="🔍 Search clinic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {
          lowerCaseRole === "admin" && (
            <NavLink to="/addClinic">
               <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition whitespace-nowrap">
            + Add Clinic
          </button>
            </NavLink>
          )
        }

      </div>

      {/* ================= LOADING ================= */}
      {loading && (
        <p className="text-blue-600 font-semibold mb-4">
          Loading clinics...
        </p>
      )}



      {/* ================= CLINIC CARDS ================= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredClinics?.length === 0 ? (
          <p className="text-red-600 font-bold text-center col-span-full">
            No Clinics Found
          </p>
        ) : (
          filteredClinics?.map((clinic) => (
            <NavLink to={`/clinics/${clinic._id}`} key={clinic._id || clinic.id}>
              <ClinicItem clinic={clinic} />
            </NavLink>

          ))
        )}

      </div>

    </div>
  );
};

export default ClinicList;