import React, { useEffect, useMemo, useState } from "react";
import { addPharmacy } from "../../../redux/pharmacyThunk/pharmacyThunk";
import { resetPharmacyState } from "../../../redux/pharmcySlice/pharmacySlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const initialForm = {
  logo: null,
  pharmacyName: "",
  licenseNo: "",
  taxNo: "",
  ownerName: "",
  managerName: "",
  phone: "",
  whatsapp: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "Pakistan",
  zip: "",
  openingTime: "09:00",
  closingTime: "21:00",
  workingDays: {
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: true,
    sun: false,
  },
  services: {
    consultation: false,
    homeDelivery: true,
    vaccination: false,
    labCollection: false,
    onlineOrders: true,
  },
  minOrderAmount: "",
  deliveryFee: "",
  emergencyContact: "",
  status: "active",
  notes: "",
  password: "",
};

export default function AddPharmacy() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message, error, loading, success } = useSelector(
    (state) => state.pharmacy
  );

  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [logoPreviewName, setLogoPreviewName] = useState("");

  const setField = (name, value) => setForm((p) => ({ ...p, [name]: value }));
  const markTouched = (name) => setTouched((t) => ({ ...t, [name]: true }));

  useEffect(() => {
    if (success) {
      setShowPopup(true);
      setForm(initialForm);
      setTouched({});
      setLogoPreviewName("");
    }
  }, [success]);

  useEffect(() => {
    return () => {
      dispatch(resetPharmacyState());
    };
  }, [dispatch]);

  const toggleWorkingDay = (dayKey) => {
    setForm((prev) => ({
      ...prev,
      workingDays: { ...prev.workingDays, [dayKey]: !prev.workingDays[dayKey] },
    }));
  };

  const toggleService = (serviceKey) => {
    setForm((prev) => ({
      ...prev,
      services: { ...prev.services, [serviceKey]: !prev.services[serviceKey] },
    }));
  };

  const isEmailValid = (email) => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const normalizeNumber = (v) => (v || "").replace(/[^\d+]/g, "");

  const errors = useMemo(() => {
    const e = {};
    if (!form.logo) e.logo = "Pharmacy logo required";
    if (!form.pharmacyName.trim()) e.pharmacyName = "Pharmacy name required";
    if (!form.licenseNo.trim()) e.licenseNo = "License number required";
    if (!form.phone.trim()) e.phone = "Phone number required";
    if (form.phone.trim() && normalizeNumber(form.phone).length < 10) {
      e.phone = "Phone number looks too short";
    }
    if (!isEmailValid(form.email)) e.email = "Invalid email format";
    if (!form.addressLine1.trim()) e.addressLine1 = "Address required";
    if (!form.city.trim()) e.city = "City required";
    if (!form.country.trim()) e.country = "Country required";
    if (form.password && form.password.length < 6) {
      e.password = "Password should be at least 6 characters";
    }
    if (form.services.homeDelivery) {
      if (form.deliveryFee !== "" && Number(form.deliveryFee) < 0) {
        e.deliveryFee = "Delivery fee cannot be negative";
      }
      if (form.minOrderAmount !== "" && Number(form.minOrderAmount) < 0) {
        e.minOrderAmount = "Min order cannot be negative";
      }
    }
    return e;
  }, [form]);

  const hasErrors = Object.keys(errors).length > 0;

  const onSubmit = async (e) => {
    e.preventDefault();

    dispatch(resetPharmacyState());

    setTouched((prev) => ({
      ...prev,
      logo: true,
      pharmacyName: true,
      licenseNo: true,
      phone: true,
      email: true,
      addressLine1: true,
      city: true,
      country: true,
      password: true,
    }));

    if (hasErrors) return;

    const payload = new FormData();
    payload.append("logo", form.logo);
    payload.append("pharmacyName", form.pharmacyName);
    payload.append("licenseNo", form.licenseNo);
    payload.append("taxNo", form.taxNo);
    payload.append("ownerName", form.ownerName);
    payload.append("managerName", form.managerName);
    payload.append("phone", normalizeNumber(form.phone));
    payload.append("whatsapp", normalizeNumber(form.whatsapp));
    payload.append("email", form.email);
    payload.append("password", form.password);
    payload.append("emergencyContact", normalizeNumber(form.emergencyContact));
    payload.append("openingTime", form.openingTime);
    payload.append("closingTime", form.closingTime);
    payload.append("minOrderAmount", form.minOrderAmount);
    payload.append("deliveryFee", form.deliveryFee);
    payload.append("status", form.status);
    payload.append("notes", form.notes);
    payload.append("workingDays", JSON.stringify(form.workingDays));
    payload.append("services", JSON.stringify(form.services));
    payload.append(
      "address",
      JSON.stringify({
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        city: form.city,
        state: form.state,
        country: form.country,
        zip: form.zip,
      })
    );

    try {
      await dispatch(addPharmacy(payload)).unwrap();
    } catch (_err) {
      // Error UI comes from redux state; no alert needed here.
    }
  };

  const resetFormForAnother = () => {
    setForm(initialForm);
    setTouched({});
    setShowPopup(false);
    setLogoPreviewName("");
    dispatch(resetPharmacyState());
  };

  const inputBase =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const labelBase = "text-sm font-semibold text-slate-600";
  const sectionCard = "rounded-2xl border border-slate-200 bg-slate-50 p-6";
  const sectionTitle = "text-slate-900 font-bold";
  const errorText = "text-xs text-red-600 mt-1";

  const fieldError = (name) => touched[name] && errors[name];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-10 md:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-500">
            Pharmacy Management
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Add a new pharmacy
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Basic info, contact, address, timings and services fill karein.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl shadow-slate-200/60">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className={sectionCard}>
              <h3 className={sectionTitle}>Basic Info</h3>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-3">
                  <label className={labelBase}>Pharmacy Logo *</label>
                  <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-white px-6 py-8 text-center text-slate-500 transition hover:border-blue-400 hover:bg-blue-50/50">
                    <span className="text-3xl">📤</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        Drag & drop or click to upload
                      </p>
                      <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setField("logo", file);
                        setLogoPreviewName(file ? file.name : "");
                        markTouched("logo");
                      }}
                    />
                  </label>
                  {logoPreviewName && (
                    <p className="mt-2 text-xs text-blue-600">
                      Selected: <span className="font-medium">{logoPreviewName}</span>
                    </p>
                  )}
                  {fieldError("logo") ? <p className={errorText}>{errors.logo}</p> : null}
                </div>

                <div>
                  <label className={labelBase}>Pharmacy Name *</label>
                  <input
                    className={inputBase}
                    value={form.pharmacyName}
                    onChange={(e) => setField("pharmacyName", e.target.value)}
                    onBlur={() => markTouched("pharmacyName")}
                    placeholder="e.g. City Care Pharmacy"
                  />
                  {fieldError("pharmacyName") ? (
                    <p className={errorText}>{errors.pharmacyName}</p>
                  ) : null}
                </div>

                <div>
                  <label className={labelBase}>License No *</label>
                  <input
                    className={inputBase}
                    value={form.licenseNo}
                    onChange={(e) => setField("licenseNo", e.target.value)}
                    onBlur={() => markTouched("licenseNo")}
                    placeholder="e.g. PH-12345"
                  />
                  {fieldError("licenseNo") ? (
                    <p className={errorText}>{errors.licenseNo}</p>
                  ) : null}
                </div>

                <div>
                  <label className={labelBase}>Tax / GST No (optional)</label>
                  <input
                    className={inputBase}
                    value={form.taxNo}
                    onChange={(e) => setField("taxNo", e.target.value)}
                    placeholder="e.g. GST-000123"
                  />
                </div>

                <div>
                  <label className={labelBase}>Owner Name (optional)</label>
                  <input
                    className={inputBase}
                    value={form.ownerName}
                    onChange={(e) => setField("ownerName", e.target.value)}
                    placeholder="e.g. Muhammad Ali"
                  />
                </div>

                <div>
                  <label className={labelBase}>Manager Name (optional)</label>
                  <input
                    className={inputBase}
                    value={form.managerName}
                    onChange={(e) => setField("managerName", e.target.value)}
                    placeholder="e.g. Sara Khan"
                  />
                </div>

                <div>
                  <label className={labelBase}>Status</label>
                  <select
                    className={inputBase}
                    value={form.status}
                    onChange={(e) => setField("status", e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={sectionCard}>
              <h3 className={sectionTitle}>Contact</h3>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className={labelBase}>Phone *</label>
                  <input
                    className={inputBase}
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    onBlur={() => markTouched("phone")}
                    placeholder="e.g. 03001234567"
                  />
                  {fieldError("phone") ? <p className={errorText}>{errors.phone}</p> : null}
                </div>

                <div>
                  <label className={labelBase}>WhatsApp (optional)</label>
                  <input
                    className={inputBase}
                    value={form.whatsapp}
                    onChange={(e) => setField("whatsapp", e.target.value)}
                    placeholder="e.g. 03001234567"
                  />
                </div>

                <div>
                  <label className={labelBase}>Email (optional)</label>
                  <input
                    className={inputBase}
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    onBlur={() => markTouched("email")}
                    placeholder="e.g. pharmacy@email.com"
                  />
                  {fieldError("email") ? <p className={errorText}>{errors.email}</p> : null}
                </div>

                <div>
                  <label className={labelBase}>Password (optional)</label>
                  <input
                    type="password"
                    className={inputBase}
                    value={form.password}
                    onChange={(e) => setField("password", e.target.value)}
                    onBlur={() => markTouched("password")}
                    placeholder="Set a custom password"
                  />
                  {fieldError("password") ? <p className={errorText}>{errors.password}</p> : null}
                </div>

                <div className="md:col-span-3">
                  <label className={labelBase}>Emergency Contact (optional)</label>
                  <input
                    className={inputBase}
                    value={form.emergencyContact}
                    onChange={(e) => setField("emergencyContact", e.target.value)}
                    placeholder="e.g. 03211234567"
                  />
                </div>
              </div>
            </div>

            <div className={sectionCard}>
              <h3 className={sectionTitle}>Address</h3>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelBase}>Address Line 1 *</label>
                  <input
                    className={inputBase}
                    value={form.addressLine1}
                    onChange={(e) => setField("addressLine1", e.target.value)}
                    onBlur={() => markTouched("addressLine1")}
                    placeholder="Street / Plaza / Area"
                  />
                  {fieldError("addressLine1") ? (
                    <p className={errorText}>{errors.addressLine1}</p>
                  ) : null}
                </div>

                <div>
                  <label className={labelBase}>Address Line 2 (optional)</label>
                  <input
                    className={inputBase}
                    value={form.addressLine2}
                    onChange={(e) => setField("addressLine2", e.target.value)}
                    placeholder="Near landmark"
                  />
                </div>

                <div>
                  <label className={labelBase}>City *</label>
                  <input
                    className={inputBase}
                    value={form.city}
                    onChange={(e) => setField("city", e.target.value)}
                    onBlur={() => markTouched("city")}
                    placeholder="e.g. Lahore"
                  />
                  {fieldError("city") ? <p className={errorText}>{errors.city}</p> : null}
                </div>

                <div>
                  <label className={labelBase}>State / Province (optional)</label>
                  <input
                    className={inputBase}
                    value={form.state}
                    onChange={(e) => setField("state", e.target.value)}
                    placeholder="e.g. Punjab"
                  />
                </div>

                <div>
                  <label className={labelBase}>Country *</label>
                  <input
                    className={inputBase}
                    value={form.country}
                    onChange={(e) => setField("country", e.target.value)}
                    onBlur={() => markTouched("country")}
                    placeholder="Pakistan"
                  />
                  {fieldError("country") ? <p className={errorText}>{errors.country}</p> : null}
                </div>

                <div>
                  <label className={labelBase}>Zip / Postal Code (optional)</label>
                  <input
                    className={inputBase}
                    value={form.zip}
                    onChange={(e) => setField("zip", e.target.value)}
                    placeholder="e.g. 54000"
                  />
                </div>
              </div>
            </div>

            <div className={sectionCard}>
              <h3 className={sectionTitle}>Timings</h3>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className={labelBase}>Opening Time</label>
                  <input
                    type="time"
                    className={inputBase}
                    value={form.openingTime}
                    onChange={(e) => setField("openingTime", e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelBase}>Closing Time</label>
                  <input
                    type="time"
                    className={inputBase}
                    value={form.closingTime}
                    onChange={(e) => setField("closingTime", e.target.value)}
                  />
                </div>

                <div className="md:col-span-3">
                  <label className={labelBase}>Working Days</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[
                      ["mon", "Mon"],
                      ["tue", "Tue"],
                      ["wed", "Wed"],
                      ["thu", "Thu"],
                      ["fri", "Fri"],
                      ["sat", "Sat"],
                      ["sun", "Sun"],
                    ].map(([key, label]) => {
                      const active = !!form.workingDays[key];
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => toggleWorkingDay(key)}
                          className={`rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                            active
                              ? "border-blue-300 bg-blue-50 text-blue-700"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className={sectionCard}>
              <h3 className={sectionTitle}>Services</h3>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                {[
                  ["consultation", "Consultation"],
                  ["homeDelivery", "Home Delivery"],
                  ["vaccination", "Vaccination"],
                  ["labCollection", "Lab Sample Collection"],
                  ["onlineOrders", "Online Orders"],
                ].map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={!!form.services[key]}
                      onChange={() => toggleService(key)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-200"
                    />
                    <span className="text-sm font-semibold">{label}</span>
                  </label>
                ))}
              </div>

              {form.services.homeDelivery ? (
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelBase}>Min Order Amount (optional)</label>
                    <input
                      type="number"
                      className={inputBase}
                      value={form.minOrderAmount}
                      onChange={(e) => setField("minOrderAmount", e.target.value)}
                      placeholder="e.g. 500"
                    />
                    {fieldError("minOrderAmount") ? (
                      <p className={errorText}>{errors.minOrderAmount}</p>
                    ) : null}
                  </div>

                  <div>
                    <label className={labelBase}>Delivery Fee (optional)</label>
                    <input
                      type="number"
                      className={inputBase}
                      value={form.deliveryFee}
                      onChange={(e) => setField("deliveryFee", e.target.value)}
                      placeholder="e.g. 150"
                    />
                    {fieldError("deliveryFee") ? (
                      <p className={errorText}>{errors.deliveryFee}</p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>

            <div className={sectionCard}>
              <h3 className={sectionTitle}>Notes (optional)</h3>
              <textarea
                className={`${inputBase} min-h-[120px]`}
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
                placeholder="Extra details: location hint, delivery policy, etc."
              />
            </div>

            {message && !showPopup && (
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm text-green-700">{message}</p>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 p-4">
                <p className="text-sm text-red-700">Error: {error}</p>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={() => setField("notes", "")}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Clear Notes
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "Saving..." : "Add Pharmacy"}
              </button>
            </div>

            <div className="text-xs text-slate-500">
              Required fields: Logo, Pharmacy Name, License No, Phone, Address, City, Country.
            </div>
          </form>
        </section>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-2xl">
            <h2 className="text-2xl font-semibold text-emerald-600">
              Pharmacy added successfully
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              The pharmacy has been added and is now available in your system.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={resetFormForAnother}
                className="rounded-2xl border border-blue-500/30 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
              >
                Add another pharmacy
              </button>
              <button
                onClick={() => {
                  setShowPopup(false);
                  dispatch(resetPharmacyState());
                  navigate("/pharmacy");
                }}
                className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow shadow-emerald-400/40 transition hover:bg-emerald-600"
              >
                Visit pharmacy list
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
