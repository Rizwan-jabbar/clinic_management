import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAppointments } from "../../redux/appointmentThunk/appointmentThunk";
import { updateAppointmentStatus } from "../../redux/appointmentThunk/appointmentThunk";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";
import { NavLink } from "react-router-dom";

function Appointments() {
  const dispatch = useDispatch();

  const { appointments, loading, error } = useSelector(
    (state) => state.appointments
  );

  const { user } = useSelector((state) => state.user);
  const lowerCaseRole = user?.role?.toLowerCase();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  /* ===============================
     ✅ POPUP STATE
  ===============================*/
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(getAppointments());
  }, [dispatch]);

  const handleStatusUpdate = (id, status) => {
    dispatch(updateAppointmentStatus({ appointmentId: id, status }));
    dispatch(getAppointments());
  };

  const userAppointments = appointments?.filter((item) => {
    return (
      item?.doctor?._id === user?._id ||
      item?.patient?._id === user?._id
    );
  });

  const filteredAppointments = userAppointments?.filter((item) => {
    const matchesSearch =
      item?.doctor?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item?.clinic?.name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item?.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">📅 Appointments</h2>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search..."
            className="border p-2 rounded-lg w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border p-2 rounded-lg"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Doctor</th>
                <th className="p-3">Patient</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAppointments?.length > 0 ? (
                filteredAppointments.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedAppointment(item)} // ✅ OPEN POPUP
                  >
                    <NavLink
                      onClick={(e) => e.stopPropagation()}
                      to={`/doctors/${item?.doctor?._id}`}>
                      <td className="p-3 text-blue-400">{item?.doctor?.name}</td>
                    </NavLink>
                    <td className="p-3">{item?.patient?.name}</td>
                    <td className="p-3">
                      {new Date(item?.appointmentDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${item?.status === "Completed"
                          ? "bg-green-200 text-green-700"
                          : item?.status === "Pending"
                            ? "bg-yellow-200 text-yellow-700"
                            : item?.status === "Confirmed"
                              ? "bg-blue-200 text-blue-700"
                              : "bg-red-200 text-red-700"
                          }`}
                      >
                        {item?.status}
                      </span>
                    </td>

                    <td className="p-3">
                      {lowerCaseRole === "doctor" && (
                        <>
                          {item?.status === "Pending" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(item._id, "Confirmed");
                              }}
                              className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm mr-2"
                            >
                              Accept
                            </button>
                          )}

                          {item?.status === "Confirmed" && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusUpdate(item._id, "Completed");
                                }}
                                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm mr-2"
                              >
                                Complete
                              </button>

                            </>
                          )}
                        </>
                      )}

                        {
                          item?.status === "Confirmed" && (
                            <>
                            {
                              lowerCaseRole === "doctor" || lowerCaseRole === "user" ? (
                                 <button
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   handleStatusUpdate(item._id, "Cancelled");
                                }}
                                className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                              >
                                Cancel
                              </button>
                              ) :(<span className="text-gray-500">No Action Available</span>)
                            }
                            </>
                          )
                        }
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-6 text-gray-500"
                  >
                    No Appointments Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= POPUP MODAL ================= */}
      {selectedAppointment && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50"
          onClick={() => setSelectedAppointment(null)} // ✅ close outside
        >
          <div
            className="bg-white p-6 rounded-2xl shadow-xl w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">
              Appointment Details
            </h3>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Doctor:</strong>{" "}
                {selectedAppointment?.doctor?.name}
              </p>

              <p>
                <strong>Patient:</strong>{" "}
                {selectedAppointment?.patient?.name}
              </p>

              <p>
                <strong>Clinic:</strong>{" "}
                {selectedAppointment?.clinic?.name}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(
                  selectedAppointment?.appointmentDate
                ).toLocaleString()}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedAppointment?.status}
              </p>

              <p>
                <strong>Payment:</strong>{" "}
                {selectedAppointment?.paymentStatus}
              </p>

              <p>
                <strong>Reason:</strong>{" "}
                {selectedAppointment?.reason || "N/A"}
              </p>
            </div>

            <button
              onClick={() => setSelectedAppointment(null)}
              className="mt-5 bg-red-600 text-white px-4 py-2 rounded-lg w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;