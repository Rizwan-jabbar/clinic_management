import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HiOutlineClock,
  HiOutlineUserCircle,
  HiOutlineBuildingOffice,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineInbox,
} from "react-icons/hi2";
import { getMyAppointmentsRequests } from "../../redux/appointmentRequestThunk/appointmentRequestThunk";

const filterOptions = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "all", label: "All" },
];

const statusChip = (status = "pending") => {
  const palette = {
    approved: "text-emerald-700 bg-emerald-50 border-emerald-200",
    rejected: "text-rose-700 bg-rose-50 border-rose-200",
    pending: "text-amber-700 bg-amber-50 border-amber-200",
  };
  return palette[status.toLowerCase()] || palette.pending;
};

function MyAppointmentRequest() {
  const dispatch = useDispatch();
  const { appointmentRequests = [], loading = false, error = null } =
    useSelector((state) => state.appointmentRequest);

  const [activeFilter, setActiveFilter] = useState("pending");

  useEffect(() => {
    dispatch(getMyAppointmentsRequests());
  }, [dispatch]);

  const filteredRows = useMemo(() => {
    if (activeFilter === "all") return appointmentRequests;
    return appointmentRequests.filter(
      (req) => (req.status || "pending").toLowerCase() === activeFilter
    );
  }, [appointmentRequests, activeFilter]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 px-4 py-8 sm:px-6 md:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Appointment Desk
              </p>
              <h1 className="mt-1 text-3xl font-semibold text-slate-900">
                My Appointment Requests
              </h1>
              <p className="text-sm text-slate-600">
                Review, filter, and track every request you have submitted to doctors.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <HiOutlineInbox className="text-slate-400" />
              Showing
              <span className="text-lg font-semibold text-slate-900">
                {filteredRows.length}
              </span>
              records
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <HiOutlineAdjustmentsHorizontal className="text-slate-500" />
              Filter
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map(({ id, label }) => {
                const active = id === activeFilter;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveFilter(id)}
                    className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3 rounded-3xl border border-slate-200 bg-white px-4 py-6 shadow-sm">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl text-blue-500">
              <HiOutlineClock />
            </div>
            <p className="text-lg font-semibold text-slate-800">
              No requests in this category
            </p>
            <p className="text-sm text-slate-500">
              Switch the filter above or submit a new appointment request.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto rounded-[28px]">
              <table className="min-w-full table-auto">
                <thead className="hidden bg-slate-50 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 md:table-header-group">
                  <tr>
                    {["Doctor", "Clinic", "Requested", "Status"].map((heading) => (
                      <th key={heading} className="px-5 py-4 text-left">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRows.map((req) => (
                    <tr
                      key={req._id}
                      className="hidden items-center gap-6 px-6 py-5 text-sm text-slate-600 border-b border-slate-100 hover:bg-slate-50 md:table-row"
                    >
                      <td className="align-top p-6">
                        <div className="flex items-center gap-3">
                          <div className="hidden h-10 w-10 rounded-2xl bg-slate-100 text-slate-500 md:flex md:items-center md:justify-center">
                            <HiOutlineUserCircle />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {req?.doctor?.name || req?.doctorName || "—"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {req?.doctor?.specializations?.join(", ") ||
                                req?.doctorSpecialty ||
                                "Not provided"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="">
                        <p className="font-semibold text-slate-800">
                          {req?.clinic?.name || req?.clinicName || "—"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {req?.clinic?.address || req?.clinicAddress || ""}
                        </p>
                      </td>
                      <td className="">
                        <p>{req?.preferredDate ? new Date(req.preferredDate).toLocaleString() : "—"}</p>
                        <p className="text-xs text-slate-500">
                          {req?.notes || "No additional notes"}
                        </p>
                      </td>
                      <td className="">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusChip(
                            req?.status
                          )}`}
                        >
                          {req?.status?.charAt(0).toUpperCase() +
                            req?.status?.slice(1) || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* mobile cards */}
              <div className="md:hidden">
                {filteredRows.map((req) => (
                  <div
                    key={req._id}
                    className="mb-5 rounded-[28px] border border-slate-200 bg-white px-5 py-5 text-sm text-slate-600 shadow-[0_18px_40px_-12px_rgba(15,23,42,0.12)]"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {req?.doctor?.name || req?.doctorName || "—"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {req?.clinic?.name || req?.clinicName || "—"}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusChip(
                          req?.status
                        )}`}
                      >
                        {req?.status?.charAt(0).toUpperCase() +
                          req?.status?.slice(1) || "Pending"}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                      <p>
                        Date:{" "}
                        <span className="font-semibold text-slate-800">
                          {req?.preferredDate
                            ? new Date(req.preferredDate).toLocaleString()
                            : "—"}
                        </span>
                      </p>
                      <p>
                        Notes:{" "}
                        <span className="font-semibold text-slate-800">
                          {req?.notes || "—"}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default MyAppointmentRequest;