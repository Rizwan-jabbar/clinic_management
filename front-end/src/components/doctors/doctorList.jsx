import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDoctors,
  deleteDoctor,
  undoDeleteDoctor,
  updateDoctorStatus,
  updateDoctorDetails,
} from "../../redux/doctorThunk/doctorThunk";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";
import { getClinics } from "../../redux/clinicThunk/clinicThunk";
import {
  getAppointmentRequests,
  getMyAppointmentsRequests,
  sendAppointmentRequest,
} from "../../redux/appointmentRequestThunk/appointmentRequestThunk";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import { resetAppointmentRequestState } from "../../redux/appointmentRequestSlice/appointmentRequestSlice";
import {
  BriefcaseMedical,
  CalendarPlus,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Mail,
  MapPin,
  Power,
  Phone,
  RotateCcw,
  Search,
  SquarePen,
  Stethoscope,
  Trash2,
  UserRound,
} from "lucide-react";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const specializationsEnum = [
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Orthopedic",
  "Pediatrician",
  "Gynecologist",
  "Psychiatrist",
  "General Physician",
  "ENT Specialist",
  "Oncologist",
];

const qualificationsEnum = [
  "MBBS",
  "MD",
  "MS",
  "BDS",
  "MDS",
  "DM",
  "MCh",
  "DNB",
  "PhD",
  "BAMS",
  "BHMS",
];

const ModalPortal = ({ children }) => {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
};

const DoctorsList = () => {
  const dispatch = useDispatch();

  const { doctors, loading } = useSelector((state) => state.doctors);
  const { clinics } = useSelector((state) => state.clinics);
  const { user } = useSelector((state) => state.user);
  const { appointmentRequests, error, message } = useSelector(
    (state) => state.appointmentRequest
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showUndoDelete, setShowUndoDelete] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [previewName, setPreviewName] = useState("");
  const [updateForm, setUpdateForm] = useState({
    name: "",
    specializations: [],
    qualifications: [],
    clinic: "",
    phone: "",
    email: "",
    experience: "",
    availability: "",
    doctorFee: "",
    profilePicture: null,
  });

  useEffect(() => {
    dispatch(getDoctors());
    dispatch(getClinics());
    dispatch(fetchUserProfile());
    dispatch(getAppointmentRequests());
    dispatch(getMyAppointmentsRequests());
  }, [dispatch]);

  const isAdmin = user?.role?.toLowerCase() === "admin";

  const onlyDoctors = useMemo(() => {
    const doctorRecords =
      doctors?.filter((doc) => doc.role?.toLowerCase() === "doctor") || [];

    if (isAdmin) {
      return doctorRecords;
    }

    return doctorRecords.filter((doc) => {
      const doctorStatus = String(doc?.doctorStatus || "active").toLowerCase();
      const serviceStatus = String(doc?.serviceStatus || "activated").toLowerCase();

      return doctorStatus === "active" && serviceStatus !== "deactivated";
    });
  }, [doctors, isAdmin]);

  const filteredDoctors = useMemo(
    () =>
      onlyDoctors.filter((doc) => {
        const matchesSearch = doc.name?.toLowerCase().includes(search.toLowerCase());
        const doctorStatus = String(doc?.doctorStatus || "active").toLowerCase();
        const serviceStatus = String(doc?.serviceStatus || "activated").toLowerCase();
        const matchesStatus =
          statusFilter === "all" ||
          doctorStatus === statusFilter ||
          serviceStatus === statusFilter;

        return matchesSearch && matchesStatus;
      }),
    [onlyDoctors, search, statusFilter]
  );

  const handleDelete = async () => {
    await dispatch(deleteDoctor(selectedDoctor._id));
    await dispatch(getDoctors());
    setShowDelete(false);
    setSelectedDoctor(null);
  };

  useEffect(() => {
    if (showRequest) {
      dispatch(resetAppointmentRequestState());
    }
  }, [showRequest, dispatch]);

  const handleAppointmentRequest = async () => {
    if (!selectedDoctor) return;

    const existingRequest = appointmentRequests?.some(
      (req) =>
        req.patient?._id === user?._id &&
        req.doctor?._id === selectedDoctor._id &&
        req.status !== "approved"
    );

    if (existingRequest) {
      alert("You have already sent a request to this doctor.");
      setShowRequest(false);
      return;
    }

    try {
      await dispatch(sendAppointmentRequest(selectedDoctor._id)).unwrap();
      setTimeout(() => {
        setShowRequest(false);
      }, 2000);
    } catch (err) {
      console.error("Appointment request failed:", err);
    }
  };


  const handleDoctorStatusChange = async (doctorId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await dispatch(updateDoctorStatus({ doctorId, status: newStatus })).unwrap();
      setShowStatusModal(false);
      setSelectedDoctor(null);
    } catch (err) {
      console.error("Failed to update doctor status:", err);
    }
  };


  const handleUndoDelete = async (doctorId) => {
    try {
      await dispatch(undoDeleteDoctor(doctorId)).unwrap();
      setShowUndoDelete(false);
      setSelectedDoctor(null);
    } catch (err) {
      console.error("Failed to undo delete doctor:", err);
    }
  };

  const resetUpdateFlow = () => {
    setShowUpdateForm(false);
    setShowUpdateConfirm(false);
    setUpdateLoading(false);
    setUpdateError("");
    setPreviewName("");
    setSelectedDoctor(null);
    setUpdateForm({
      name: "",
      specializations: [],
      qualifications: [],
      clinic: "",
      phone: "",
      email: "",
      experience: "",
      availability: "",
      doctorFee: "",
      profilePicture: null,
    });
  };

  const openUpdateForm = (doctor) => {
    setSelectedDoctor(doctor);
    setUpdateError("");
    setPreviewName("");
    setUpdateForm({
      name: doctor?.name || "",
      specializations: doctor?.specializations || [],
      qualifications: doctor?.qualifications || [],
      clinic: doctor?.clinic?._id || doctor?.clinic || "",
      phone: doctor?.phone || "",
      email: doctor?.email || "",
      experience: doctor?.experience ?? "",
      availability: doctor?.availability || "",
      doctorFee: doctor?.doctorFee ?? "",
      profilePicture: null,
    });
    setShowUpdateForm(true);
  };

  const handleUpdateSpecialization = (value) => {
    if (!value || updateForm.specializations.includes(value)) return;

    setUpdateForm((prev) => ({
      ...prev,
      specializations: [...prev.specializations, value],
    }));
  };

  const removeUpdateSpecialization = (value) => {
    setUpdateForm((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((item) => item !== value),
    }));
  };

  const toggleUpdateQualification = (value) => {
    setUpdateForm((prev) => ({
      ...prev,
      qualifications: prev.qualifications.includes(value)
        ? prev.qualifications.filter((item) => item !== value)
        : [...prev.qualifications, value],
    }));
  };

  const handleOpenUpdateConfirm = (e) => {
    e.preventDefault();

    if (!updateForm.specializations.length || !updateForm.qualifications.length) {
      setUpdateError("Please select specialization and qualification.");
      return;
    }

    setUpdateError("");
    setShowUpdateConfirm(true);
  };

  const handleConfirmUpdate = async () => {
    if (!selectedDoctor?._id) return;

    const formData = new FormData();
    formData.append("name", updateForm.name);
    updateForm.specializations.forEach((item) =>
      formData.append("specializations", item)
    );
    updateForm.qualifications.forEach((item) =>
      formData.append("qualifications", item)
    );
    formData.append("clinic", updateForm.clinic);
    formData.append("phone", updateForm.phone);
    formData.append("email", updateForm.email);
    formData.append("experience", updateForm.experience);
    formData.append("availability", updateForm.availability);
    formData.append("doctorFee", updateForm.doctorFee);

    if (updateForm.profilePicture) {
      formData.append("profilePicture", updateForm.profilePicture);
    }

    try {
      setUpdateLoading(true);
      await dispatch(
        updateDoctorDetails({
          doctorId: selectedDoctor._id,
          doctorData: formData,
        })
      ).unwrap();
      await dispatch(getDoctors());
      setShowUpdateConfirm(false);
      setShowUpdateForm(false);
      setShowUpdateSuccess(true);
      setUpdateError("");
    } catch (err) {
      setShowUpdateConfirm(false);
      setUpdateError(err || "Failed to update doctor details.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const sharedInput =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100";

  return (
    <div className="space-y-5 font-clinic-body">
      <section className="rounded-[32px] border border-white/60 bg-white/85 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
              <Stethoscope size={14} />
              Doctors
            </span>
            <div>
              <h1 className="font-clinic-heading text-[30px] font-semibold text-slate-900">
                Doctors Directory
              </h1>
              <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-500">
                Clear doctor information, clinic details, and quick appointment actions in one easier-to-use view.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-[240px]">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search doctor"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-[13px] text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <div className="relative min-w-[200px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-10 text-[13px] text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              >
                <option value="all">All Doctors</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="deactivated">Removed</option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {isAdmin && (
              <NavLink
                to="/addDoctor"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-500 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-700 hover:to-teal-600"
              >
                <CalendarPlus size={15} />
                Add Doctor
              </NavLink>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/60 bg-white/85 p-5 shadow-lg shadow-slate-200/30">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-sky-50 p-3 text-sky-700">
              <Stethoscope size={18} />
            </span>
            <div>
              <p className="text-[12px] text-slate-500">Total Doctors</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{filteredDoctors.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-white/60 bg-white/85 p-5 shadow-lg shadow-slate-200/30">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-teal-50 p-3 text-teal-700">
              <BriefcaseMedical size={18} />
            </span>
            <div>
              <p className="text-[12px] text-slate-500">Clinic Ready</p>
              <p className="mt-1 text-[13px] leading-6 text-slate-600">Simple details for patients and staff.</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-white/60 bg-white/85 p-5 shadow-lg shadow-slate-200/30">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
              <CalendarPlus size={18} />
            </span>
            <div>
              <p className="text-[12px] text-slate-500">Appointments</p>
              <p className="mt-1 text-[13px] leading-6 text-slate-600">Faster request flow with clearer actions.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[32px] border border-white/60 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="min-w-[1040px] w-full text-left text-[13px] text-slate-700">
            <thead className="bg-slate-50/80 text-[11px] uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-5 py-4">Doctor</th>
                <th className="px-5 py-4">Specialization</th>
                <th className="px-5 py-4">Experience</th>
                <th className="px-5 py-4">Clinic</th>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4">Availability</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor) => {
                const profilePictureUrl = doctor?.profilePicture
                  ? `${BASE_URL}/${doctor.profilePicture.replace(/\\/g, "/")}`
                  : null;

                return (
                  <tr
                    key={doctor._id}
                    className="border-t border-slate-100 transition hover:bg-sky-50/40"
                  >
                    <td className="px-5 py-5">
                      <NavLink
                        to={`/doctors/${doctor._id}`}
                        className="flex items-center gap-4"
                      >
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[22px] border border-slate-200 bg-gradient-to-br from-sky-100 via-white to-teal-100 text-sky-700 shadow-sm">
                          {profilePictureUrl ? (
                            <img
                              src={profilePictureUrl}
                              alt={doctor.name}
                              className="h-full w-full object-cover object-top"
                            />
                          ) : (
                            <UserRound size={22} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[15px] font-semibold text-slate-900">{doctor.name}</p>
                          <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                            <Stethoscope size={12} />
                            Doctor profile
                          </p>
                        </div>
                      </NavLink>
                    </td>
                    <td className="px-5 py-5 text-slate-600">
                      {doctor.specializations?.join(", ") || "-"}
                    </td>
                    <td className="px-5 py-5">
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-[12px] font-medium text-slate-700">
                        <Clock3 size={13} className="text-slate-400" />
                        {doctor.experience || 0} Years
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <NavLink
                        to={`/clinics/${doctor?.clinic?._id}`}
                        className="inline-flex items-center gap-2 font-medium text-sky-700 hover:text-sky-800"
                      >
                        <MapPin size={13} />
                        {doctor?.clinic?.name || "-"}
                      </NavLink>
                    </td>
                    <td className="px-5 py-5">
                      <div className="space-y-1.5 text-[12px] text-slate-600">
                        <p className="inline-flex items-center gap-2">
                          <Mail size={13} className="text-slate-400" />
                          {doctor.email}
                        </p>
                        <p className="inline-flex items-center gap-2">
                          <Phone size={13} className="text-slate-400" />
                          {doctor.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-5 text-slate-600">{doctor.availability || "-"}</td>
                    <td className="px-5 py-5">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                          doctor?.doctorStatus === "inactive"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        <CheckCircle2 size={12} />
                        {doctor?.doctorStatus || "active"}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      {isAdmin ? (
                        <div className="flex flex-wrap gap-2">
                          {(doctor?.serviceStatus || doctor?.doctorStatus || "active") === "activated" ||
                          (doctor?.serviceStatus || doctor?.doctorStatus || "active") === "active" ? (
                            <>
                              <button
                                type="button"
                                onClick={() => openUpdateForm(doctor)}
                                className="inline-flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-[12px] font-semibold text-sky-700 transition hover:bg-sky-100"
                              >
                                <SquarePen size={14} />
                                Update
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedDoctor(doctor);
                                  setShowDelete(true);
                                }}
                                className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-700 transition hover:bg-rose-100"
                              >
                                <Trash2 size={14} />
                                Remove
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedDoctor(doctor);
                                  setShowStatusModal(true);
                                }}
                                className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-[12px] font-semibold text-amber-700 transition hover:bg-amber-100"
                              >
                                <Power size={14} />
                                Inactive
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDoctor(doctor);
                                setShowUndoDelete(true);
                              }}
                              className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-[12px] font-semibold text-emerald-700 transition hover:bg-emerald-100"
                            >
                              <RotateCcw size={14} />
                              Undo
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedDoctor(doctor);
                            setShowRequest(true);
                          }}
                          className="inline-flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-[12px] font-semibold text-sky-700 transition hover:bg-sky-100"
                        >
                          <CalendarPlus size={14} />
                          Request
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!loading && filteredDoctors.length === 0 && (
          <div className="px-6 py-16 text-center text-slate-500">No doctors found.</div>
        )}
      </section>

      {showDelete && (
        <ModalPortal>
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[28px] border border-white/60 bg-white p-6 shadow-2xl shadow-slate-400/20">
              <h2 className="font-clinic-heading text-xl font-semibold text-slate-900">Remove Doctor</h2>
              <p className="mt-2 text-[13px] leading-6 text-slate-500">
                Are you sure you want to remove
                <span className="font-semibold text-slate-700"> {selectedDoctor?.name}</span>?
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowDelete(false)}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-[13px] font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 rounded-2xl bg-rose-600 px-4 py-3 text-[13px] font-semibold text-white"
                >
                  Confirm Remove
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {showRequest && (
        <ModalPortal>
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-[28px] border border-white/60 bg-white p-6 shadow-2xl shadow-slate-400/20">
              <h2 className="font-clinic-heading text-xl font-semibold text-slate-900">
                Confirm Appointment Request
              </h2>
              <p className="mt-2 text-[13px] leading-6 text-slate-500">
                Send an appointment request to
                <span className="font-semibold text-slate-700"> {selectedDoctor?.name}</span>?
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowRequest(false)}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-[13px] font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAppointmentRequest}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-500 px-4 py-3 text-[13px] font-semibold text-white"
                >
                  Send Request
                </button>
              </div>

              {error && (
                <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
                  {error.message}
                </div>
              )}

              {message && (
                <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
                  {message}
                </div>
              )}
            </div>
          </div>
        </ModalPortal>
      )}

      {showUpdateForm && (
        <ModalPortal>
          <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm">
            <div className="mx-auto my-8 w-full max-w-4xl rounded-[28px] border border-white/60 bg-white p-6 shadow-2xl shadow-slate-400/20 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-clinic-heading text-xl font-semibold text-slate-900">
                    Update Doctor Details
                  </h2>
                  <p className="mt-2 text-[13px] leading-6 text-slate-500">
                    Form me current doctor ka data pehle se fill hai. Change kar ke update karein.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetUpdateFlow}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-[13px] font-medium text-slate-600"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleOpenUpdateConfirm} className="mt-6 grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  required
                  placeholder="Doctor Name"
                  className={sharedInput}
                  value={updateForm.name}
                  onChange={(e) =>
                    setUpdateForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <input
                  type="text"
                  required
                  placeholder="Phone"
                  className={sharedInput}
                  value={updateForm.phone}
                  onChange={(e) =>
                    setUpdateForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  className={sharedInput}
                  value={updateForm.email}
                  onChange={(e) =>
                    setUpdateForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Experience (Years)"
                  className={sharedInput}
                  value={updateForm.experience}
                  onChange={(e) =>
                    setUpdateForm((prev) => ({ ...prev, experience: e.target.value }))
                  }
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="Doctor Fee"
                  className={sharedInput}
                  value={updateForm.doctorFee}
                  onChange={(e) =>
                    setUpdateForm((prev) => ({ ...prev, doctorFee: e.target.value }))
                  }
                />
                <select
                  required
                  className={sharedInput}
                  value={updateForm.clinic}
                  onChange={(e) =>
                    setUpdateForm((prev) => ({ ...prev, clinic: e.target.value }))
                  }
                >
                  <option value="">Select Clinic</option>
                  {clinics?.map((clinic) => (
                    <option key={clinic._id} value={clinic._id}>
                      {clinic.name}
                    </option>
                  ))}
                </select>
                <div className="md:col-span-2">
                  <input
                    type="text"
                    required
                    placeholder="Availability"
                    className={sharedInput}
                    value={updateForm.availability}
                    onChange={(e) =>
                      setUpdateForm((prev) => ({
                        ...prev,
                        availability: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-600">
                    Specializations
                  </label>
                  <select
                    className={sharedInput}
                    defaultValue=""
                    onChange={(e) => handleUpdateSpecialization(e.target.value)}
                  >
                    <option value="">Select Specialization</option>
                    {specializationsEnum.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-2">
                    {updateForm.specializations.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => removeUpdateSpecialization(item)}
                        className="rounded-full bg-sky-50 px-3 py-1 text-[12px] font-medium text-sky-700 hover:bg-sky-100"
                      >
                        {item} x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <p className="text-sm font-semibold text-slate-600">Qualifications</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {qualificationsEnum.map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
                      >
                        <input
                          type="checkbox"
                          checked={updateForm.qualifications.includes(item)}
                          onChange={() => toggleUpdateQualification(item)}
                          className="rounded border-slate-300 text-sky-600 focus:ring-sky-200"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <p className="text-sm font-semibold text-slate-600">Profile Picture</p>
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center text-slate-500 transition hover:border-sky-400 hover:bg-sky-50/50">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        Click to upload new image
                      </p>
                      <p className="text-xs text-slate-400">
                        New image select na karen to purani image hi rahegi
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setUpdateForm((prev) => ({ ...prev, profilePicture: file }));
                        setPreviewName(file?.name || "");
                      }}
                    />
                  </label>
                  {previewName && (
                    <p className="text-[12px] text-sky-700">
                      Selected: <span className="font-medium">{previewName}</span>
                    </p>
                  )}
                </div>

                {updateError && (
                  <div className="md:col-span-2 rounded-2xl bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
                    {updateError}
                  </div>
                )}

                <div className="md:col-span-2 flex gap-3">
                  <button
                    type="button"
                    onClick={resetUpdateFlow}
                    className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-[13px] font-medium text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-500 px-4 py-3 text-[13px] font-semibold text-white"
                  >
                    Update Doctor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {showUpdateConfirm && (
        <ModalPortal>
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[28px] border border-white/60 bg-white p-6 shadow-2xl shadow-slate-400/20">
              <h2 className="font-clinic-heading text-xl font-semibold text-slate-900">
                Confirm Update
              </h2>
              <p className="mt-2 text-[13px] leading-6 text-slate-500">
                Kya aap
                <span className="font-semibold text-slate-700"> {selectedDoctor?.name}</span>
                {" "}ki details update karna chahte hain?
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowUpdateConfirm(false)}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-[13px] font-medium text-slate-700"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={updateLoading}
                  onClick={handleConfirmUpdate}
                  className="flex-1 rounded-2xl bg-sky-600 px-4 py-3 text-[13px] font-semibold text-white disabled:opacity-60"
                >
                  {updateLoading ? "Updating..." : "Confirm Update"}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {showUpdateSuccess && (
        <ModalPortal>
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[28px] border border-emerald-100 bg-white p-6 text-center shadow-2xl shadow-slate-400/20">
              <h2 className="font-clinic-heading text-xl font-semibold text-emerald-600">
                Doctor updated successfully
              </h2>
              <p className="mt-2 text-[13px] leading-6 text-slate-500">
                Updated doctor data list me refresh ho gaya hai.
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowUpdateSuccess(false);
                  resetUpdateFlow();
                }}
                className="mt-6 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-[13px] font-semibold text-white hover:bg-emerald-700"
              >
                Close
              </button>
            </div>
          </div>
        </ModalPortal>
      )}

      {showStatusModal && (
        <ModalPortal>
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[28px] border border-white/60 bg-white p-6 shadow-2xl shadow-slate-400/20">
              <h2 className="font-clinic-heading text-xl font-semibold text-slate-900">
                Update Doctor Status
              </h2>
              <p className="mt-2 text-[13px] leading-6 text-slate-500">
                Change
                <span className="font-semibold text-slate-700"> {selectedDoctor?.name}</span>
                {" "}status to
                <span className="font-semibold text-slate-700">
                  {" "}
                  {selectedDoctor?.doctorStatus === "inactive" ? "active" : "inactive"}
                </span>
                ?
              </p>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                  Current Status
                </p>
                <span
                  className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                    selectedDoctor?.doctorStatus === "inactive"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  <CheckCircle2 size={12} />
                  {selectedDoctor?.doctorStatus || "active"}
                </span>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedDoctor(null);
                  }}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-[13px] font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleDoctorStatusChange(
                      selectedDoctor?._id,
                      selectedDoctor?.doctorStatus || "active"
                    )
                  }
                  className={`flex-1 rounded-2xl px-4 py-3 text-[13px] font-semibold text-white ${
                    selectedDoctor?.doctorStatus === "inactive"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-amber-600 hover:bg-amber-700"
                  }`}
                >
                  {selectedDoctor?.doctorStatus === "inactive" ? "Active" : "Inactive"}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {showUndoDelete && (
        <ModalPortal>
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[28px] border border-white/60 bg-white p-6 shadow-2xl shadow-slate-400/20">
              <h2 className="font-clinic-heading text-xl font-semibold text-slate-900">
                Restore Doctor
              </h2>
              <p className="mt-2 text-[13px] leading-6 text-slate-500">
                Restore
                <span className="font-semibold text-slate-700"> {selectedDoctor?.name}</span>
                {" "}to active doctor services?
              </p>

              <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
                This will make the doctor visible again and set the status back to active.
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowUndoDelete(false);
                    setSelectedDoctor(null);
                  }}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-[13px] font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUndoDelete(selectedDoctor?._id)}
                  className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 text-[13px] font-semibold text-white hover:bg-emerald-700"
                >
                  Confirm Restore
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
};

export default DoctorsList;
