import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDoctors, deleteDoctor } from "../../redux/doctorThunk/doctorThunk";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";
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
  Clock3,
  Mail,
  MapPin,
  Phone,
  Search,
  Stethoscope,
  Trash2,
  UserRound,
} from "lucide-react";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const ModalPortal = ({ children }) => {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
};

const DoctorsList = () => {
  const dispatch = useDispatch();

  const { doctors, loading } = useSelector((state) => state.doctors);
  const { user } = useSelector((state) => state.user);
  const { appointmentRequests, error, message } = useSelector(
    (state) => state.appointmentRequest
  );
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showRequest, setShowRequest] = useState(false);

  useEffect(() => {
    dispatch(getDoctors());
    dispatch(fetchUserProfile());
    dispatch(getAppointmentRequests());
    dispatch(getMyAppointmentsRequests());
  }, [dispatch]);

  const isAdmin = user?.role?.toLowerCase() === "admin";

  const onlyDoctors = useMemo(
    () => doctors?.filter((doc) => doc.role?.toLowerCase() === "doctor") || [],
    [doctors]
  );

  const filteredDoctors = useMemo(
    () =>
      onlyDoctors.filter((doc) =>
        doc.name?.toLowerCase().includes(search.toLowerCase())
      ),
    [onlyDoctors, search]
  );

  const handleDelete = async () => {
    await dispatch(deleteDoctor(selectedDoctor._id));
    setShowDelete(false);
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
                    <td className="px-5 py-4">
                      <NavLink
                        to={`/doctors/${doctor._id}`}
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-sky-50 text-sky-700">
                          {profilePictureUrl ? (
                            <img
                              src={profilePictureUrl}
                              alt={doctor.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <UserRound size={18} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{doctor.name}</p>
                          <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                            <Stethoscope size={12} />
                            Doctor profile
                          </p>
                        </div>
                      </NavLink>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {doctor.specializations?.join(", ") || "-"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-[12px] font-medium text-slate-700">
                        <Clock3 size={13} className="text-slate-400" />
                        {doctor.experience || 0} Years
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <NavLink
                        to={`/clinics/${doctor?.clinic?._id}`}
                        className="inline-flex items-center gap-2 font-medium text-sky-700 hover:text-sky-800"
                      >
                        <MapPin size={13} />
                        {doctor?.clinic?.name || "-"}
                      </NavLink>
                    </td>
                    <td className="px-5 py-4">
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
                    <td className="px-5 py-4 text-slate-600">{doctor.availability || "-"}</td>
                    <td className="px-5 py-4">
                      {isAdmin ? (
                        <button
                          onClick={() => {
                            setSelectedDoctor(doctor);
                            setShowDelete(true);
                          }}
                          className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
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
              <h2 className="font-clinic-heading text-xl font-semibold text-slate-900">Delete Doctor</h2>
              <p className="mt-2 text-[13px] leading-6 text-slate-500">
                Are you sure you want to delete
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
                  Delete
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
    </div>
  );
};

export default DoctorsList;
