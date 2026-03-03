import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DoctorCard from "./doctoeCard";
import { getDoctors } from "../../redux/doctorThunk/doctorThunk";
import { NavLink } from "react-router-dom";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";

const DoctorsList = () => {
  const dispatch = useDispatch();

  const { doctors, loading } = useSelector((state) => state.doctors);
  console.log("DOCTORS IN LIST ===>", doctors);

  const [search, setSearch] = useState("");

  /* ================= FETCH DOCTORS ================= */
  useEffect(() => {
    dispatch(getDoctors());
  }, [dispatch]);


const onlyDoctors = doctors?.filter((doc) => doc.role === "doctor" || doc.role === "Doctor");
  /* ================= FILTER ================= */
  const filteredDoctors = onlyDoctors?.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  console.log("FILTERED DOCTORS ===>", filteredDoctors);


  const {user} = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch , user?._id]);

  return (
    <div className="p-6">

      {/* ================= TOP BAR ================= */}
      <div className="flex flex-wrap gap-4 justify-between mb-10">

        <input
          type="text"
          placeholder="Search doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-xl w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

      {user?.role === "admin" && (
          <NavLink to="/addDoctor">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition">
            + Add Doctor
          </button>
        </NavLink>
      )}

      </div>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="text-center text-gray-500 text-lg">
          Loading doctors...
        </div>
      )}

      {/* ================= EMPTY STATE ================= */}
      {!loading && filteredDoctors?.length === 0 && (
        <div className="text-center text-gray-500 text-lg">
          No Doctors Found
        </div>
      )}

      {/* ================= DOCTOR GRID ================= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors?.map((doctor) => (
            <NavLink key={doctor._id} to={`/doctors/${doctor._id}`}>
              <DoctorCard doctor={doctor} />
            </NavLink>
        ))}
      </div>

    </div>
  );
};

export default DoctorsList;