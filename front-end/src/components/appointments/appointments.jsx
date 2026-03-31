import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAppointments,
  updateAppointmentStatus,
} from "../../redux/appointmentThunk/appointmentThunk";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";
import { addVisitToMedicalHistory } from "../../redux/medicalHistoryThunk/medicalHistoryThunk";

const statusBadges = {
  Pending: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  Confirmed: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  Completed: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  Cancelled: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
};

const emptyMedicine = {
  name: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
};

const emptyTest = {
  testName: "",
  result: "",
  normalRange: "",
  status: "Pending",
};

const initialVisitForm = {
  symptoms: "",
  diagnosis: "",
  advice: "",
  notes: "",
  followUpDate: "",
  bloodGroup: "",
  allergies: [""],
  chronicDiseases: [""],
  pastSurgeries: [{ surgeryName: "", year: "", notes: "" }],
  medicines: [emptyMedicine],
  tests: [emptyTest],
};

const FieldHeader = ({ label, helper }) => (
  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
    <span>{label}</span>
    {helper && <span className="text-slate-400 normal-case">{helper}</span>}
  </div>
);

function Appointments() {
  const dispatch = useDispatch();
  const { appointments, loading, error } = useSelector(
    (state) => state.appointments
  );
  console.log("🚀 Appointments Data:", appointments);
  const { user } = useSelector((state) => state.user);
  console.log("🚀 User Data:", user);
  const lowerCaseRole = user?.role?.toLowerCase();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [appointmentToComplete, setAppointmentToComplete] = useState(null);
  const [visitForm, setVisitForm] = useState(initialVisitForm);

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
      item?.doctor?._id === user?._id || item?.patient?._id === user?._id  || item?.assistant._id === user?._id
  );

  const filteredAppointments = userAppointments?.filter((item) => {
    const matchesSearch =
      item?.doctor?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item?.clinic?.name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item?.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleVisitFieldChange = (field, value) => {
    setVisitForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setVisitForm((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addStringItem = (field) =>
    setVisitForm((prev) => ({ ...prev, [field]: [...prev[field], ""] }));

  const updateStringItem = (field, index, value) =>
    setVisitForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, idx) => (idx === index ? value : item)),
    }));

  const removeStringItem = (field, index) =>
    setVisitForm((prev) => ({
      ...prev,
      [field]:
        prev[field].length > 1
          ? prev[field].filter((_, idx) => idx !== index)
          : prev[field],
    }));

  const addArrayItem = (arrayName) => {
    setVisitForm((prev) => ({
      ...prev,
      [arrayName]:
        arrayName === "medicines"
          ? [...prev[arrayName], { ...emptyMedicine }]
          : arrayName === "tests"
            ? [...prev[arrayName], { ...emptyTest }]
            : arrayName === "pastSurgeries"
              ? [...prev[arrayName], { surgeryName: "", year: "", notes: "" }]
              : prev[arrayName], // strings handled elsewhere
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setVisitForm((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].length > 1
        ? prev[arrayName].filter((_, idx) => idx !== index)
        : prev[arrayName],
    }));
  };

  const resetVisitForm = () => setVisitForm(initialVisitForm);

  const handleCompleteSubmit = async () => {
    const payload = {
      appointmentId: appointmentToComplete?._id,
      doctorId: appointmentToComplete?.doctor?._id,
      clinicId: appointmentToComplete?.clinic?._id,
      patientId: appointmentToComplete?.patient?._id,
      ...visitForm,
    };

    try {
      // ✅ 1. Medical History Add Karo
      await dispatch(addVisitToMedicalHistory(payload)).unwrap();

      // ✅ 2. Appointment Status Completed Karo
      await dispatch(
        updateAppointmentStatus({
          appointmentId: appointmentToComplete._id,
          status: "Completed",
        })
      ).unwrap();

      // ✅ 3. Refresh Appointments
      dispatch(getAppointments());

      // ✅ 4. Close Modal
      setShowCompleteForm(false);
      resetVisitForm();
    } catch (error) {
      console.error("Error saving medical history:", error);
    }
  };

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
                        className={`cursor-pointer border-t border-slate-100 transition hover:bg-slate-50 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
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
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusBadges[item?.status] ||
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
                                    setAppointmentToComplete(item);
                                    resetVisitForm();
                                    setShowCompleteForm(true);
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



      {showCompleteForm && appointmentToComplete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
          onClick={() => {
            setShowCompleteForm(false);
            resetVisitForm();
          }}
        >
          <div
            className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-slate-100 bg-gradient-to-br from-white via-slate-50 to-blue-50 p-8 shadow-[0_35px_60px_-15px_rgba(15,23,42,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <span className="inline-flex items-center rounded-full bg-blue-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Doctor action
                </span>
                <div>
                  <h2 className="text-3xl font-semibold text-slate-900">
                    Complete visit & prescription
                  </h2>
                  <p className="text-sm text-slate-500">
                    Fill out the clinical note before closing this appointment.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCompleteForm(false);
                  resetVisitForm();
                }}
                className="rounded-full border border-slate-200/80 p-2 text-slate-400 transition hover:border-slate-300 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* progress strip */}
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-900/5 px-5 py-3 text-sm text-slate-600">
              <div className="h-2 w-24 rounded-full bg-emerald-400" />
              <span className="font-semibold text-slate-800">Visit summary</span>
              <span className="text-slate-400">•</span>
              <span>{appointmentToComplete?.patient?.name}</span>
            </div>

            {/* form body */}
            <div className="mt-6 space-y-6 text-sm text-slate-700">
              <div className="grid gap-5 md:grid-cols-2">
                {/* symptoms */}
                <div className="md:col-span-2 space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm hover:border-blue-200/70">
                  <FieldHeader label="Symptoms" helper="Patient-reported complaints" />
                  <textarea
                    rows="3"
                    className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                    value={visitForm.symptoms}
                    onChange={(e) => handleVisitFieldChange("symptoms", e.target.value)}
                  />
                </div>
                {/* blood group */}
                <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                  <FieldHeader label="Blood Group" />
                  <input
                    type="text"
                    placeholder="e.g. O+, A-, B+"
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                    value={visitForm.bloodGroup}
                    onChange={(e) => handleVisitFieldChange("bloodGroup", e.target.value)}
                  />
                </div>

                {/* allergies */}
                <div className="md:col-span-2 space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                  <FieldHeader label="Allergies" />
                  {visitForm.allergies.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateStringItem("allergies", index, e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2"
                      />
                      <button onClick={() => removeStringItem("allergies", index)}>Remove</button>
                    </div>
                  ))}
                  <button onClick={() => addStringItem("allergies")}>+ Add Allergy</button>
                </div>

                {/* chronic diseases */}
                <div className="md:col-span-2 space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                  <FieldHeader label="Chronic Diseases" />

                  {visitForm.chronicDiseases.map((item, index) => (
                    <div key={index} className="flex gap-3">

                      <input
                        type="text"
                        value={item}
                        onChange={(e) =>
                          updateStringItem("chronicDiseases", index, e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2"
                      />

                      <button
                        onClick={() => removeStringItem("chronicDiseases", index)}
                        className="text-rose-500"
                      >
                        Remove
                      </button>

                    </div>
                  ))}

                  <button
                    onClick={() => addStringItem("chronicDiseases")}
                    className="rounded-xl bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600"
                  >
                    + Add Disease
                  </button>
                </div>

                {/* past surgeries */}

                <div className="md:col-span-2 space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                  <FieldHeader label="Past Surgeries" />
                  {visitForm.pastSurgeries.map((item, index) => (
                    <div key={index} className="grid gap-3 md:grid-cols-3">
                      <input
                        type="text"
                        placeholder="Surgery Name"
                        className="rounded-xl border px-3 py-2"
                        value={item.surgeryName}
                        onChange={(e) =>
                          handleArrayChange("pastSurgeries", index, "surgeryName", e.target.value)
                        }
                      />
                      <input
                        type="number"
                        placeholder="Year"
                        className="rounded-xl border px-3 py-2"
                        value={item.year}
                        onChange={(e) =>
                          handleArrayChange("pastSurgeries", index, "year", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        placeholder="Notes"
                        className="rounded-xl border px-3 py-2"
                        value={item.notes}
                        onChange={(e) =>
                          handleArrayChange("pastSurgeries", index, "notes", e.target.value)
                        }
                      />
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setVisitForm((prev) => ({
                        ...prev,
                        pastSurgeries: [...prev.pastSurgeries, { surgeryName: "", year: "", notes: "" }],
                      }))
                    }
                    className="rounded-xl bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600"
                  >
                    + Add Surgery
                  </button>
                </div>

                {/* diagnosis */}
                <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm hover:border-blue-200/70">
                  <FieldHeader label="Diagnosis" />
                  <input
                    type="text"
                    placeholder="Primary diagnosis"
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                    value={visitForm.diagnosis}
                    onChange={(e) => handleVisitFieldChange("diagnosis", e.target.value)}
                  />
                </div>

                {/* follow-up */}
                <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm hover:border-blue-200/70">
                  <FieldHeader label="Follow-up date" />
                  <div className="relative mt-3">
                    <input
                      type="date"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                      value={visitForm.followUpDate}
                      onChange={(e) => handleVisitFieldChange("followUpDate", e.target.value)}
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                      📅
                    </span>
                  </div>
                </div>

                {/* medicines */}
                <div className="md:col-span-2 space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm hover:border-blue-200/70">
                  <FieldHeader label="Medicines" helper="Include dosage, frequency, and duration" />
                  <div className="space-y-4">
                    {visitForm.medicines.map((medicine, index) => (
                      <div
                        key={`medicine-${index}`}
                        className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 shadow-sm"
                      >
                        <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
                          <span>Medicine #{index + 1}</span>
                          {visitForm.medicines.length > 1 && (
                            <button
                              onClick={() => removeArrayItem("medicines", index)}
                              className="text-rose-500 hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {["name", "dosage", "frequency", "duration", "instructions"].map((field) => (
                            <input
                              key={field}
                              type="text"
                              placeholder={field[0].toUpperCase() + field.slice(1)}
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                              value={medicine[field]}
                              onChange={(e) =>
                                handleArrayChange("medicines", index, field, e.target.value)
                              }
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addArrayItem("medicines")}
                    className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                  >
                    + Add medicine
                  </button>
                </div>

                {/* tests */}
                <div className="md:col-span-2 space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm hover:border-blue-200/70">
                  <FieldHeader label="Tests" helper="Lab or imaging investigations" />
                  <div className="space-y-4">
                    {visitForm.tests.map((test, index) => (
                      <div
                        key={`test-${index}`}
                        className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 shadow-sm"
                      >
                        <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
                          <span>Test #{index + 1}</span>
                          {visitForm.tests.length > 1 && (
                            <button
                              onClick={() => removeArrayItem("tests", index)}
                              className="text-rose-500 hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                          <input
                            type="text"
                            placeholder="Test name"
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                            value={test.testName}
                            onChange={(e) =>
                              handleArrayChange("tests", index, "testName", e.target.value)
                            }
                          />
                          <input
                            type="text"
                            placeholder="Result"
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                            value={test.result}
                            onChange={(e) =>
                              handleArrayChange("tests", index, "result", e.target.value)
                            }
                          />
                          <input
                            type="text"
                            placeholder="Normal range"
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                            value={test.normalRange}
                            onChange={(e) =>
                              handleArrayChange("tests", index, "normalRange", e.target.value)
                            }
                          />
                          <select
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                            value={test.status}
                            onChange={(e) => handleArrayChange("tests", index, "status", e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Normal">Normal</option>
                            <option value="Abnormal">Abnormal</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addArrayItem("tests")}
                    className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                  >
                    + Add test
                  </button>
                </div>

                {/* advice */}
                <div className="md:col-span-2 space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm hover:border-blue-200/70">
                  <FieldHeader label="Advice" helper="Lifestyle / precautions" />
                  <textarea
                    rows="2"
                    className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                    value={visitForm.advice}
                    onChange={(e) => handleVisitFieldChange("advice", e.target.value)}
                  />
                </div>

                {/* notes */}
                <div className="md:col-span-2 space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm hover:border-blue-200/70">
                  <FieldHeader label="Private notes" helper="Visible only to clinicians" />
                  <textarea
                    rows="2"
                    className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                    value={visitForm.notes}
                    onChange={(e) => handleVisitFieldChange("notes", e.target.value)}
                  />
                </div>
              </div>

              {/* action bar */}
              <div className="flex flex-col gap-4 rounded-2xl bg-slate-900/5 p-5 sm:flex-row sm:items-center">
                <p className="text-sm text-slate-500 sm:flex-1">
                  All entries mirror the MedicalHistory schema, so you can push this payload straight to the backend.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => {
                      setShowCompleteForm(false);
                      resetVisitForm();
                    }}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
                  >
                    Save draft
                  </button>
                  <button
                    onClick={handleCompleteSubmit}
                    className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:from-emerald-400 hover:to-teal-400"
                  >
                    Submit & Complete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;