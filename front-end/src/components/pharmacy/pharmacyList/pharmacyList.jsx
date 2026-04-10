import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import {
  deletePharmacy,
  getPharmacies,
  undoDeletePharmacy,
  updatePharmacyDetails,
  updatePharmacyStatus,
} from "../../../redux/pharmacyThunk/pharmacyThunk";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Building2,
  ChevronDown,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Plus,
  RotateCcw,
  Search,
  Store,
  Truck,
} from "lucide-react";

const ModalPortal = ({ children }) => {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
};

function PharmacyList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pharmacies, loading, error } = useSelector((state) => state.pharmacy);
  const { user } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showUndoDelete, setShowUndoDelete] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [formData, setFormData] = useState({});
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    dispatch(getPharmacies());
  }, [dispatch]);

  useEffect(() => {
    if (!showDeleteConfirm && !showEditForm && !showUndoDelete) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showDeleteConfirm, showEditForm, showUndoDelete]);

  const isAdmin = user?.role?.toLowerCase() === "admin";

  const handleStatusToggle = async (pharmacy) => {
    await dispatch(
      updatePharmacyStatus({
        pharmacyId: pharmacy._id,
        status: pharmacy?.status === "active" ? "inactive" : "active",
      })
    ).unwrap();
    await dispatch(getPharmacies());
  };

  const openDeleteModal = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setShowDeleteConfirm(true);
  };

  const openEditModal = (pharmacy) => {
    const address = pharmacy?.address || {};
    const services = pharmacy?.services || {};
    const workingDays = pharmacy?.workingDays || {};

    setSelectedPharmacy(pharmacy);
    setFormData({
      pharmacyName: pharmacy?.pharmacyName || pharmacy?.name || "",
      licenseNo: pharmacy?.licenseNo || "",
      taxNo: pharmacy?.taxNo || "",
      ownerName: pharmacy?.ownerName || "",
      managerName: pharmacy?.managerName || "",
      phone: pharmacy?.phone || "",
      whatsapp: pharmacy?.whatsapp || "",
      email: pharmacy?.email || "",
      emergencyContact: pharmacy?.emergencyContact || "",
      openingTime: pharmacy?.openingTime || "",
      closingTime: pharmacy?.closingTime || "",
      minOrderAmount: pharmacy?.minOrderAmount ?? "",
      deliveryFee: pharmacy?.deliveryFee ?? "",
      notes: pharmacy?.notes || "",
      status: pharmacy?.status || "active",
      addressLine1: address?.addressLine1 || "",
      addressLine2: address?.addressLine2 || "",
      city: address?.city || "",
      state: address?.state || "",
      country: address?.country || "",
      zip: address?.zip || "",
      consultation: !!services?.consultation,
      homeDelivery: !!services?.homeDelivery,
      vaccination: !!services?.vaccination,
      labCollection: !!services?.labCollection,
      onlineOrders: !!services?.onlineOrders,
      mon: !!workingDays?.mon,
      tue: !!workingDays?.tue,
      wed: !!workingDays?.wed,
      thu: !!workingDays?.thu,
      fri: !!workingDays?.fri,
      sat: !!workingDays?.sat,
      sun: !!workingDays?.sun,
      logo: null,
    });
    setShowEditForm(true);
  };

  const handleDelete = async () => {
    if (!selectedPharmacy?._id) return;
    await dispatch(deletePharmacy(selectedPharmacy._id)).unwrap();
    await dispatch(getPharmacies());
    setShowDeleteConfirm(false);
    setSelectedPharmacy(null);
  };

  const handleUndoDelete = async (pharmacyId) => {
    if (!pharmacyId) return;
    await dispatch(undoDeletePharmacy(pharmacyId)).unwrap();
    await dispatch(getPharmacies());
    setShowUndoDelete(false);
    setSelectedPharmacy(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files?.[0] || null : value,
    }));
  };

  const handleUpdateSubmit = () => {
    if (!selectedPharmacy?._id) return;

    const payload = new FormData();

    [
      "pharmacyName",
      "licenseNo",
      "taxNo",
      "ownerName",
      "managerName",
      "phone",
      "whatsapp",
      "email",
      "emergencyContact",
      "openingTime",
      "closingTime",
      "minOrderAmount",
      "deliveryFee",
      "notes",
      "status",
    ].forEach((field) => {
      payload.append(field, formData[field] ?? "");
    });

    payload.append(
      "address",
      JSON.stringify({
        addressLine1: formData.addressLine1 || "",
        addressLine2: formData.addressLine2 || "",
        city: formData.city || "",
        state: formData.state || "",
        country: formData.country || "",
        zip: formData.zip || "",
      })
    );

    payload.append(
      "services",
      JSON.stringify({
        consultation: !!formData.consultation,
        homeDelivery: !!formData.homeDelivery,
        vaccination: !!formData.vaccination,
        labCollection: !!formData.labCollection,
        onlineOrders: !!formData.onlineOrders,
      })
    );

    payload.append(
      "workingDays",
      JSON.stringify({
        mon: !!formData.mon,
        tue: !!formData.tue,
        wed: !!formData.wed,
        thu: !!formData.thu,
        fri: !!formData.fri,
        sat: !!formData.sat,
        sun: !!formData.sun,
      })
    );

    if (formData.logo) {
      payload.append("logo", formData.logo);
    }

    dispatch(
      updatePharmacyDetails({
        pharmacyId: selectedPharmacy._id,
        pharmacyData: payload,
      })
    );
    setShowEditForm(false);
    setSelectedPharmacy(null);
  };

  const filteredPharmacies = useMemo(() => {
    const query = search.trim().toLowerCase();

    return (pharmacies || []).filter((pharmacy) => {
      const haystack = [
        pharmacy?.name,
        pharmacy?.pharmacyName,
        pharmacy?.licenseNo,
        pharmacy?.email,
        pharmacy?.phone,
        pharmacy?.address?.city,
        pharmacy?.address?.country,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || haystack.includes(query);
      const currentStatus = String(pharmacy?.status || "inactive").toLowerCase();
      const serviceStatus = String(pharmacy?.serviceStatus || "activated").toLowerCase();
      const matchesStatus =
        statusFilter === "all" ||
        currentStatus === statusFilter ||
        serviceStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [pharmacies, search, statusFilter]);

  if (loading) {
    return <div className="py-20 text-center text-lg text-slate-600">Loading pharmacies...</div>;
  }

  if (error) {
    return <div className="py-20 text-center text-lg text-rose-600">{error}</div>;
  }

  return (
    <div className="space-y-5 font-clinic-body">
      <section className="rounded-[32px] border border-white/60 bg-white/85 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
              <Store size={14} />
              Pharmacy
            </span>
            <div>
              <h1 className="font-clinic-heading text-[30px] font-semibold text-slate-900">
                Pharmacy List
              </h1>
              <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-500">
                View all registered pharmacies in a clean tabular layout with contact, address, timings, and service information.
              </p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => navigate("/addPharmacy")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-500 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-700 hover:to-teal-600"
            >
              <Plus size={15} />
              Add Pharmacy
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
              <p className="text-[12px] text-slate-500">Total Pharmacies</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{filteredPharmacies.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-white/60 bg-white/85 p-5 shadow-lg shadow-slate-200/30">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
              <BadgeCheck size={18} />
            </span>
            <div>
              <p className="text-[12px] text-slate-500">Active Pharmacies</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-600">
                {filteredPharmacies.filter((item) => item?.status === "active").length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-white/60 bg-white/85 p-5 shadow-lg shadow-slate-200/30">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
              <Truck size={18} />
            </span>
            <div>
              <p className="text-[12px] text-slate-500">Services</p>
              <p className="mt-1 text-[13px] leading-6 text-slate-600">
                Quick overview of delivery and availability details.
              </p>
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
              placeholder="Search pharmacy by name, city, email, license or phone"
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
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="deactivated">Removed</option>
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
          <table className="min-w-[1180px] w-full text-left text-[13px] text-slate-700">
            <thead className="bg-slate-50/80 text-[11px] uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-5 py-4">Pharmacy</th>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4">Address</th>
                <th className="px-5 py-4">Timings</th>
                <th className="px-5 py-4">Services</th>
                <th className="px-5 py-4">Status</th>
                {isAdmin && <th className="px-5 py-4">Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredPharmacies.map((pharmacy) => {
                const pharmacyName = pharmacy?.name || pharmacy?.pharmacyName || "Unnamed Pharmacy";
                const city = pharmacy?.address?.city || pharmacy?.city || "-";
                const country = pharmacy?.address?.country || pharmacy?.country || "-";
                const logoUrl = pharmacy?.logo
                  ? `${BASE_URL}/${pharmacy.logo.replace(/\\/g, "/")}`
                  : null;
                const services = pharmacy?.services || {};
                const activeServices = Object.entries(services)
                  .filter(([, value]) => value)
                  .map(([key]) =>
                    key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())
                  );

                return (
                  <tr
                    key={pharmacy._id}
                    onClick={() => navigate(`/pharmacy/${pharmacy._id}`)}
                    className="cursor-pointer border-t border-slate-100 transition hover:bg-sky-50/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex flex-col items-start gap-2">
                        <div className="h-12 w-12 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 to-teal-100 shadow-sm ring-1 ring-slate-200">
                          {logoUrl ? (
                            <img
                              src={logoUrl}
                              alt={pharmacyName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="inline-flex h-full w-full items-center justify-center text-sky-700">
                              <Store size={18} />
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{pharmacyName}</p>
                          <p className="mt-1 text-[11px] text-slate-500">
                            License: {pharmacy?.licenseNo || "-"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1.5 text-[12px] text-slate-600">
                        <p className="inline-flex items-center gap-2">
                          <Phone size={13} className="text-slate-400" />
                          {pharmacy?.phone || "-"}
                        </p>
                        <p className="inline-flex items-center gap-2">
                          <Mail size={13} className="text-slate-400" />
                          {pharmacy?.email || "-"}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      <div className="space-y-1.5">
                        <p className="inline-flex items-center gap-2">
                          <MapPin size={13} className="text-slate-400" />
                          {pharmacy?.address?.addressLine1 || pharmacy?.addressLine1 || "-"}
                        </p>
                        <p className="text-[12px] text-slate-500">
                          {city}, {country}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-[12px] font-medium text-slate-700">
                        <Clock3 size={13} className="text-slate-400" />
                        {pharmacy?.openingTime || "-"} - {pharmacy?.closingTime || "-"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {activeServices.length > 0 ? (
                          activeServices.slice(0, 3).map((service) => (
                            <span
                              key={service}
                              className="rounded-full bg-teal-50 px-3 py-1 text-[11px] font-semibold text-teal-700"
                            >
                              {service}
                            </span>
                          ))
                        ) : (
                          <span className="text-[12px] text-slate-400">No extra services</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                          pharmacy?.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {pharmacy?.status || "inactive"}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-5 py-4">
                        <div className="flex flex-col flex-wrap gap-2">
                          {(pharmacy?.serviceStatus || pharmacy?.status || "active") === "deactivated" ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPharmacy(pharmacy);
                                setShowUndoDelete(true);
                              }}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-[12px] font-semibold text-emerald-700 transition hover:bg-emerald-100"
                            >
                              <RotateCcw size={14} />
                              Undo
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(pharmacy);
                                }}
                                className="rounded-xl bg-sky-50 px-3 py-2 text-[12px] font-semibold text-sky-700 transition hover:bg-sky-100"
                              >
                                Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteModal(pharmacy);
                                }}
                                className="rounded-xl bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-700 transition hover:bg-rose-100"
                              >
                                Delete
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusToggle(pharmacy);
                                }}
                                className="rounded-xl bg-amber-50 px-3 py-2 text-[12px] font-semibold text-amber-700 transition hover:bg-amber-100"
                              >
                                {pharmacy?.status === "active" ? "Deactivate" : "Activate"}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!loading && filteredPharmacies.length === 0 && (
          <div className="px-6 py-16 text-center text-slate-500">No pharmacies found.</div>
        )}
      </section>

      {showDeleteConfirm && (
        <ModalPortal>
          <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[28px] border border-white/60 bg-white p-6 shadow-2xl shadow-slate-400/20">
              <h2 className="font-clinic-heading text-xl font-semibold text-slate-900">Delete Pharmacy?</h2>
              <p className="mt-2 text-[13px] leading-6 text-slate-500">
                This will set pharmacy status to inactive and service status to deactivated.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedPharmacy(null);
                  }}
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

      {showUndoDelete && (
        <ModalPortal>
          <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[28px] border border-white/60 bg-white p-6 shadow-2xl shadow-slate-400/20">
              <h2 className="font-clinic-heading text-xl font-semibold text-slate-900">Restore Pharmacy</h2>
              <p className="mt-2 text-[13px] leading-6 text-slate-500">
                Restore
                <span className="font-semibold text-slate-700"> {selectedPharmacy?.name || selectedPharmacy?.pharmacyName}</span>
                {" "}to active services?
              </p>

              <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
                This will set status back to active and service status to activated.
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowUndoDelete(false);
                    setSelectedPharmacy(null);
                  }}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-[13px] font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUndoDelete(selectedPharmacy?._id)}
                  className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 text-[13px] font-semibold text-white hover:bg-emerald-700"
                >
                  Confirm Restore
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {showEditForm && (
        <ModalPortal>
          <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-2xl shadow-slate-900/15">
              <div className="border-b border-slate-200 bg-gradient-to-r from-sky-50 via-white to-teal-50 px-6 py-5">
                <h2 className="font-clinic-heading text-2xl font-semibold text-slate-900">Edit Pharmacy</h2>
                <p className="mt-1 text-[13px] text-slate-500">
                  Update pharmacy profile, timings, services, and contact details.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
                  <div className="space-y-6">
                    <section className="rounded-[26px] border border-slate-200 bg-slate-50/70 p-5">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Basic Info</h3>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <input name="pharmacyName" value={formData.pharmacyName || ""} onChange={handleChange} placeholder="Pharmacy Name" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                        <input name="licenseNo" value={formData.licenseNo || ""} onChange={handleChange} placeholder="License No" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                        <input name="taxNo" value={formData.taxNo || ""} onChange={handleChange} placeholder="Tax No" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                        <select name="status" value={formData.status || "active"} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100">
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                        <input name="ownerName" value={formData.ownerName || ""} onChange={handleChange} placeholder="Owner Name" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                        <input name="managerName" value={formData.managerName || ""} onChange={handleChange} placeholder="Manager Name" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                        <input name="logo" type="file" accept="image/*" onChange={handleChange} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-sky-100 file:px-3 file:py-2 file:text-sky-700 md:col-span-2" />
                      </div>
                    </section>

                    <section className="rounded-[26px] border border-slate-200 bg-slate-50/70 p-5">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Contact</h3>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <input name="phone" value={formData.phone || ""} onChange={handleChange} placeholder="Phone" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                        <input name="whatsapp" value={formData.whatsapp || ""} onChange={handleChange} placeholder="WhatsApp" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                        <input name="email" value={formData.email || ""} onChange={handleChange} placeholder="Email" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                        <input name="emergencyContact" value={formData.emergencyContact || ""} onChange={handleChange} placeholder="Emergency Contact" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                      </div>
                    </section>

                    <section className="rounded-[26px] border border-slate-200 bg-slate-50/70 p-5">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Location & Timings</h3>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <input name="addressLine1" value={formData.addressLine1 || ""} onChange={handleChange} placeholder="Address Line 1" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 md:col-span-2" />
                        <input name="addressLine2" value={formData.addressLine2 || ""} onChange={handleChange} placeholder="Address Line 2" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 md:col-span-2" />
                        <input name="city" value={formData.city || ""} onChange={handleChange} placeholder="City" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                        <input name="state" value={formData.state || ""} onChange={handleChange} placeholder="State" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                        <input name="country" value={formData.country || ""} onChange={handleChange} placeholder="Country" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                        <input name="zip" value={formData.zip || ""} onChange={handleChange} placeholder="Zip" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                        <input name="openingTime" type="time" value={formData.openingTime || ""} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                        <input name="closingTime" type="time" value={formData.closingTime || ""} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                      </div>
                    </section>
                  </div>

                  <div className="space-y-6">
                    <section className="rounded-[26px] border border-slate-200 bg-slate-50/70 p-5">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Delivery & Notes</h3>
                      <div className="mt-4 space-y-4">
                        <input name="minOrderAmount" type="number" value={formData.minOrderAmount ?? ""} onChange={handleChange} placeholder="Min Order Amount" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                        <input name="deliveryFee" type="number" value={formData.deliveryFee ?? ""} onChange={handleChange} placeholder="Delivery Fee" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                        <textarea name="notes" value={formData.notes || ""} onChange={handleChange} placeholder="Notes" className="min-h-[140px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                      </div>
                    </section>

                    <section className="rounded-[26px] border border-slate-200 bg-slate-50/70 p-5">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Services</h3>
                      <div className="mt-4 grid gap-3">
                        {[
                          ["consultation", "Consultation"],
                          ["homeDelivery", "Home Delivery"],
                          ["vaccination", "Vaccination"],
                          ["labCollection", "Lab Collection"],
                          ["onlineOrders", "Online Orders"],
                        ].map(([key, label]) => (
                          <label key={key} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
                            <input type="checkbox" name={key} checked={!!formData[key]} onChange={handleChange} className="h-4 w-4" />
                            {label}
                          </label>
                        ))}
                      </div>
                    </section>

                    <section className="rounded-[26px] border border-slate-200 bg-slate-50/70 p-5">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Working Days</h3>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {[
                          ["mon", "Monday"],
                          ["tue", "Tuesday"],
                          ["wed", "Wednesday"],
                          ["thu", "Thursday"],
                          ["fri", "Friday"],
                          ["sat", "Saturday"],
                          ["sun", "Sunday"],
                        ].map(([key, label]) => (
                          <label key={key} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
                            <input type="checkbox" name={key} checked={!!formData[key]} onChange={handleChange} className="h-4 w-4" />
                            {label}
                          </label>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-6 py-5 sm:flex-row">
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setSelectedPharmacy(null);
                  }}
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
}

export default PharmacyList;
