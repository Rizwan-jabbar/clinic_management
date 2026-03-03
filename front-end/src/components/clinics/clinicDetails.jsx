import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getClinics } from "../../redux/clinicThunk/clinicThunk";
import { getDoctors } from "../../redux/doctorThunk/doctorThunk";

const ClinicDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { clinics, loading } = useSelector((state) => state.clinics);
  const { doctors } = useSelector((state) => state.doctors);

  const clinicDoctors = doctors?.filter(
    (doc) => doc?.clinic?._id === id
  );

  useEffect(() => {
    if (!clinics || clinics.length === 0) {
      dispatch(getClinics());
      dispatch(getDoctors());
    }
  }, [dispatch]);

  const clinic = clinics?.find((item) => item._id === id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-blue-600 font-semibold text-lg">
          Loading clinic details...
        </p>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-bold text-xl">
          Clinic Not Found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/* ===== MAIN WRAPPER (FULL WIDTH) ===== */}
      <div className="w-full bg-white rounded-xl shadow-md p-4 md:p-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            🏥 {clinic.name}
          </h1>

          <span
            className={`px-3 py-1 text-xs md:text-sm rounded-full text-white w-fit ${clinic.status === "Active"
                ? "bg-green-600"
                : "bg-red-600"
              }`}
          >
            {clinic.status}
          </span>
        </div>

        {/* ===== DETAILS GRID ===== */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <DetailBox title="👨‍⚕️ Doctors" value={clinic.doctors} />
          <DetailBox title="🏥 Capacity" value={clinic.capacity} />
          <DetailBox title="📍 Location" value={clinic.location} />
          <DetailBox title="📞 Phone" value={clinic.phone} />

          <DetailBox
            title="🕒 Timings"
            value={`${clinic.openingTime} - ${clinic.closingTime}`}
          />

          <div className="sm:col-span-2 lg:col-span-3">
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg border">
              <p className="text-sm font-semibold text-gray-600 mb-1">
                📝 Description
              </p>
              <p className="text-gray-700 text-sm md:text-base">
                {clinic.description}
              </p>
            </div>
          </div>
        </div>

        {/* ===== DOCTORS TABLE ===== */}
        <div className="mt-8">

          <h2 className="text-lg md:text-xl font-bold mb-3">
            👨‍⚕️ Assigned Doctors
          </h2>

          <div className="w-full overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[600px] text-sm md:text-base">

              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Specialization</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Email</th>
                </tr>
              </thead>

              <tbody>
                {clinicDoctors?.length > 0 ? (
                  clinicDoctors.map((doc) => (
                    <tr
                      key={doc._id}
                      className="border-t hover:bg-blue-50 transition"
                    >
                      {/* ✅ NAME WITH NAVLINK */}
                      <td className="p-3">
                        <NavLink
                          to={`/doctors/${doc._id}`}
                          className="text-blue-600 font-medium hover:underline"
                        >
                          {doc.name}
                        </NavLink>
                      </td>

                      <td className="p-3">
                        {doc.specializations?.join(", ") || "N/A"}
                      </td>

                      <td className="p-3">
                        {doc.phone || "N/A"}
                      </td>

                      <td className="p-3 break-all">
                        {doc.email || "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-4 text-center text-gray-500"
                    >
                      No Doctors Assigned
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

        </div>

      </div>
    </div>
  );
};

/* ================= DETAIL BOX ================= */

const DetailBox = ({ title, value }) => (
  <div className="bg-gray-50 border rounded-lg p-3 md:p-4 hover:shadow-sm transition">
    <p className="text-xs md:text-sm text-gray-500">{title}</p>
    <p className="text-sm md:text-base font-semibold mt-1">
      {value ?? "N/A"}
    </p>
  </div>
);

export default ClinicDetails;