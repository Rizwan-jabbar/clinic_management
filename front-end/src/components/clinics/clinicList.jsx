import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteClinic,
  getClinics,
  updateClinicStatus,
  updateClinic,
} from "../../redux/clinicThunk/clinicThunk";
import { fetchUserProfile } from "../../redux/userThunk/userThunk";
import { createPortal } from "react-dom";
import {
  Building2,
  ChevronDown,
  Clock3,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

const ModalPortal = ({ children }) => {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
};

const ClinicList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clinics = useSelector((state) => state.clinics.clinics);
  const loading = useSelector((state) => state.clinics.loading);
  const { user } = useSelector((state) => state.user);

  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    dispatch(getClinics());
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const filteredClinics = useMemo(() => {
    return (clinics || []).filter((clinic) => {
      const matchesSearch = search
        ? clinic?.name?.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesStatus =
        statusFilter === "All" || clinic?.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [clinics, search, statusFilter]);

  const openEditModal = (clinic) => {
    setSelectedClinic(clinic);
    setFormData(clinic);
    setShowEditForm(true);
  };

  const openDeleteModal = (clinic) => {
    setSelectedClinic(clinic);
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    dispatch(deleteClinic(selectedClinic._id));
    setShowDeleteConfirm(false);
  };

  const handleStatusToggle = (clinic) => {
    dispatch(
      updateClinicStatus({
        clinicId: clinic._id,
        newStatus: clinic.status === "Active" ? "Inactive" : "Active",
      })
    );
  };

  const handleUpdateSubmit = () => {
    dispatch(
      updateClinic({
        clinicId: selectedClinic._id,
        updatedData: formData,
      })
    );
    setShowEditForm(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-5 font-clinic-body">
      <section className="rounded-[32px] border border-white/60 bg-white/85 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
              <Building2 size={14} />
              Clinics
            </span>
            <div>
              <h1 className="font-clinic-heading text-[30px] font-semibold text-slate-900">
                Clinics Management
              </h1>
              <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-500">
                Manage branches, check clinic status, and review key details in a cleaner clinic-style dashboard.
              </p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => navigate("/addClinic")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-500 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-700 hover:to-teal-600"
            >
              <Plus size={15} />
              Add Clinic
            </button>
          )}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/60 bg-white/85 p-5 shadow-lg shadow-slate-200/30">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-sky-50 p-3 text-sky-700">
              <Building2 size={18} />
            </span>
            <div>
              <p className="text-[12px] text-slate-500">Total Clinics</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{filteredClinics?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-white/60 bg-white/85 p-5 shadow-lg shadow-slate-200/30">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
              <ShieldCheck size={18} />
            </span>
            <div>
              <p className="text-[12px] text-slate-500">Active Clinics</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-600">
                {filteredClinics?.filter((clinic) => clinic.status === "Active").length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-white/60 bg-white/85 p-5 shadow-lg shadow-slate-200/30">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
              <Users size={18} />
            </span>
            <div>
              <p className="text-[12px] text-slate-500">Overview</p>
              <p className="mt-1 text-[13px] leading-6 text-slate-600">Quick branch review with simple management actions.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/60 bg-white/85 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search clinic"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-[13px] text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div className="relative min-w-[210px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-10 text-[13px] text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[32px] border border-white/60 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="min-w-[960px] w-full text-left text-[13px] text-slate-700">
            <thead className="bg-slate-50/80 text-[11px] uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-5 py-4">Clinic</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">Doctors</th>
                <th className="px-5 py-4">Capacity</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Timings</th>
                <th className="px-5 py-4">Status</th>
                {isAdmin && <th className="px-5 py-4">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredClinics?.map((clinic) => (
                <tr
                  key={clinic._id}
                  onClick={() => navigate(`/clinics/${clinic._id}`)}
                  className="cursor-pointer border-t border-slate-100 transition hover:bg-sky-50/40"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                        <Building2 size={18} />
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900">{clinic.name}</p>
                        <p className="mt-1 text-[11px] text-slate-500">Clinic branch</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <MapPin size={13} className="text-slate-400" />
                      {clinic.location}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{clinic.doctors}</td>
                  <td className="px-5 py-4 text-slate-600">{clinic.capacity}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 text-slate-600">
                      <Phone size={13} className="text-slate-400" />
                      {clinic.phone}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 text-slate-600">
                      <Clock3 size={13} className="text-slate-400" />
                      {clinic.openingTime} - {clinic.closingTime}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                        clinic.status === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {clinic.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(clinic);
                          }}
                          className="rounded-xl bg-sky-50 px-3 py-2 text-[12px] font-semibold text-sky-700 transition hover:bg-sky-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(clinic);
                          }}
                          className="rounded-xl bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          Delete
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusToggle(clinic);
                          }}
                          className="rounded-xl bg-amber-50 px-3 py-2 text-[12px] font-semibold text-amber-700 transition hover:bg-amber-100"
                        >
                          {clinic.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && filteredClinics?.length === 0 && (
          <div className="px-6 py-16 text-center text-slate-500">No clinics found.</div>
        )}
      </section>

      {showDeleteConfirm && (
        <ModalPortal>
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[28px] border border-white/60 bg-white p-6 shadow-2xl shadow-slate-400/20">
              <h2 className="font-clinic-heading text-xl font-semibold text-slate-900">Delete Clinic?</h2>
              <p className="mt-2 text-[13px] leading-6 text-slate-500">
                This action cannot be undone and will remove the selected clinic.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
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

      {showEditForm && (
        <ModalPortal>
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
            <div className="w-full max-w-3xl rounded-[28px] border border-white/60 bg-white p-6 shadow-2xl shadow-slate-400/20">
              <h2 className="mb-5 font-clinic-heading text-xl font-semibold text-slate-900">Edit Clinic</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.keys(formData).map((key) => (
                  <input
                    key={key}
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleChange}
                    placeholder={key}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  />
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowEditForm(false)}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-[13px] font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSubmit}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-500 px-4 py-3 text-[13px] font-semibold text-white"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
};

export default ClinicList;
