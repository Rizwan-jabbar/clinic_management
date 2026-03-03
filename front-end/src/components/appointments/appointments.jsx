import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAppointments,
  updateAppointmentStatus,
} from "../../redux/appointmentThunk/appointmentThunk";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";

const statusBadges = {
  Pending: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  Confirmed: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  Completed: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  Cancelled: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
};

function Appointments() {
  const dispatch = useDispatch();
  const { appointments, loading, error } = useSelector(
    (state) => state.appointments
  );
  const { user } = useSelector((state) => state.user);
  const lowerCaseRole = user?.role?.toLowerCase();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(getAppointments());
  }, [dispatch]);

  const handleStatusUpdate = (id, status) => {
    dispatch(updateAppointmentStatus({ appointmentId: id, status }));
    dispatch(getAppointments());
  };

  const userAppointments = appointments?.filter(
    (item) =>
      item?.doctor?._id === user?._id || item?.patient?._id === user?._id
  );

  const filteredAppointments = userAppointments?.filter((item) => {
    const matchesSearch =
      item?.doctor?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item?.clinic?.name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item?.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-10 md:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
                Schedule
              </p>
              <h1 className="text-3xl font-semibold text-slate-900">Appointments</h1>
              <p className="text-sm text-slate-500">
                View and manage all visits in one place.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
              <span className="hidden sm:inline">
                {filteredAppointments?.length || 0} active
              </span>
              <span className="text-slate-400">•</span>
              <span className="capitalize">
                {lowerCaseRole ? `${lowerCaseRole} view` : "Overview"}
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Search
              </label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-600 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                <span className="text-slate-400">🔍</span>
                <input
                  type="text"
                  placeholder="Type a doctor or clinic name"
                  className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </label>
              <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                <select
                  className="w-full bg-transparent text-sm text-slate-700 focus:outline-none"
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
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="space-y-3 p-6">
                  {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="h-12 animate-pulse rounded-2xl bg-slate-100" />
                  ))}
                </div>
              ) : error ? (
                <div className="p-6 text-center text-sm text-rose-500">{error}</div>
              ) : filteredAppointments?.length ? (
                <table className="min-w-full text-sm text-slate-700">
                  <thead>
                    <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-6 py-4">Doctor</th>
                      <th className="px-6 py-4">Patient</th>
                      <th className="px-6 py-4">Clinic</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((item, idx) => (
                      <tr
                        key={item._id}
                        className={`cursor-pointer border-t border-slate-100 transition hover:bg-slate-50 ${
                          idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                        }`}
                        onClick={() => setSelectedAppointment(item)}
                      >
                        <td className="px-6 py-4">
                          <NavLink
                            onClick={(e) => e.stopPropagation()}
                            to={`/doctors/${item?.doctor?._id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {item?.doctor?.name}
                          </NavLink>
                        </td>
                        <td className="px-6 py-4">{item?.patient?.name}</td>
                        <td className="px-6 py-4">{item?.clinic?.name}</td>
                        <td className="px-6 py-4">
                          {new Date(item?.appointmentDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                              statusBadges[item?.status] ||
                              "bg-slate-200 text-slate-700"
                            }`}
                          >
                            <span className="h-2 w-2 rounded-full bg-current" />
                            {item?.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            {lowerCaseRole === "doctor" &&
                              item?.status === "Pending" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(item._id, "Confirmed");
                                  }}
                                  className="rounded-xl bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow shadow-emerald-500/30 transition hover:bg-emerald-400"
                                >
                                  Accept
                                </button>
                              )}
                            {lowerCaseRole === "doctor" &&
                              item?.status === "Confirmed" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(item._id, "Completed");
                                  }}
                                  className="rounded-xl bg-sky-500 px-3 py-1 text-xs font-semibold text-white shadow shadow-sky-500/30 transition hover:bg-sky-400"
                                >
                                  Complete
                                </button>
                              )}
                            {item?.status === "Confirmed" &&
                              (lowerCaseRole === "doctor" ||
                                lowerCaseRole === "user") && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(item._id, "Cancelled");
                                  }}
                                  className="rounded-xl bg-rose-500 px-3 py-1 text-xs font-semibold text-white shadow shadow-rose-500/30 transition hover:bg-rose-400"
                                >
                                  Cancel
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="px-6 py-12 text-center text-slate-500">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
                    📭
                  </div>
                  <p className="text-lg font-semibold">No appointments found</p>
                  <p className="text-sm text-slate-400">
                    Try adjusting your search or filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {selectedAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
          onClick={() => setSelectedAppointment(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Appointment
                </p>
                <h3 className="text-2xl font-semibold">
                  {selectedAppointment?.doctor?.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="rounded-full border border-white/20 p-2 text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-200">
              <p>
                <span className="text-slate-400">Patient:</span>{" "}
                {selectedAppointment?.patient?.name}
              </p>
              <p>
                <span className="text-slate-400">Clinic:</span>{" "}
                {selectedAppointment?.clinic?.name}
              </p>
              <p>
                <span className="text-slate-400">Date:</span>{" "}
                {new Date(
                  selectedAppointment?.appointmentDate
                ).toLocaleString()}
              </p>
              <p>
                <span className="text-slate-400">Status:</span>{" "}
                {selectedAppointment?.status}
              </p>
              <p>
                <span className="text-slate-400">Payment:</span>{" "}
                {selectedAppointment?.paymentStatus}
              </p>
              <p>
                <span className="text-slate-400">Reason:</span>{" "}
                {selectedAppointment?.reason || "Not provided"}
              </p>
            </div>

            <button
              onClick={() => setSelectedAppointment(null)}
              className="mt-6 w-full rounded-2xl bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
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