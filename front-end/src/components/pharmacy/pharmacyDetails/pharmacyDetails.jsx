import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPharmacies } from "../../../redux/pharmacyThunk/pharmacyThunk";
import { useEffect, useMemo } from "react";
import {
  BadgeCheck,
  Building2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Store,
  Tag,
  Truck,
  UserRound,
} from "lucide-react";

function PharmacyDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { pharmacies, loading, error } = useSelector((state) => state.pharmacy);

  useEffect(() => {
    if (!pharmacies?.length) {
      dispatch(getPharmacies());
    }
  }, [dispatch, pharmacies?.length]);

  const pharmacy = useMemo(() => {
    return (pharmacies || []).find((item) => item?._id === id);
  }, [pharmacies, id]);

  if (loading) {
    return <div className="py-20 text-center text-lg text-slate-600">Loading pharmacy details...</div>;
  }

  if (error) {
    return <div className="py-20 text-center text-lg text-rose-600">{error}</div>;
  }

  if (!pharmacy) {
    return <div className="py-20 text-center text-lg text-slate-500">Pharmacy not found.</div>;
  }

  const pharmacyName = pharmacy?.name || pharmacy?.pharmacyName || "Unnamed Pharmacy";
  const address = pharmacy?.address || {};
  const services = pharmacy?.services || {};
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";
  const logoUrl = pharmacy?.logo
    ? `${BASE_URL}/${pharmacy.logo.replace(/\\/g, "/")}`
    : null;

  const activeServices = Object.entries(services)
    .filter(([, value]) => value)
    .map(([key]) =>
      key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
    );

  const infoCards = [
    {
      label: "Status",
      value: pharmacy?.status || "inactive",
      icon: BadgeCheck,
      tone: "emerald",
    },
    {
      label: "City",
      value: address?.city || pharmacy?.city || "-",
      icon: Building2,
      tone: "sky",
    },
    {
      label: "Delivery",
      value: services?.homeDelivery ? "Available" : "Not available",
      icon: Truck,
      tone: "teal",
    },
  ];

  return (
    <div className="space-y-4 font-clinic-body">
      <section className="rounded-[30px] border border-white/60 bg-white/85 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="h-16 w-16 overflow-hidden rounded-3xl bg-gradient-to-br from-sky-100 to-teal-100 shadow-sm ring-1 ring-slate-200">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={pharmacyName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="inline-flex h-full w-full items-center justify-center text-sky-700">
                <Store size={24} />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-sky-700/75">
              Pharmacy Details
            </p>
            <h1 className="mt-2 font-clinic-heading text-[24px] font-semibold leading-tight text-slate-900 sm:text-[28px]">
              {pharmacyName}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium">
                License: {pharmacy?.licenseNo || "-"}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium capitalize">
                {pharmacy?.status || "inactive"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {infoCards.map((card) => {
          const Icon = card.icon;
          const toneClasses =
            card.tone === "emerald"
              ? "bg-emerald-50 text-emerald-700"
              : card.tone === "teal"
                ? "bg-teal-50 text-teal-700"
                : "bg-sky-50 text-sky-700";

          return (
            <div
              key={card.label}
              className="rounded-3xl border border-white/60 bg-white/90 p-4 shadow-lg shadow-slate-200/30"
            >
              <div className="flex items-center gap-3">
                <span className={`rounded-2xl p-3 ${toneClasses}`}>
                  <Icon size={16} />
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    {card.label}
                  </p>
                  <p className="mt-1 text-[13px] font-semibold capitalize text-slate-800">
                    {card.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[30px] border border-white/60 bg-white/90 p-5 shadow-xl shadow-slate-200/35">
          <h2 className="font-clinic-heading text-[18px] font-semibold text-slate-900">
            Contact
          </h2>
          <div className="mt-4 space-y-3 text-[12px] text-slate-600">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <Phone size={14} className="text-slate-400" />
              <span>{pharmacy?.phone || "-"}</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <Mail size={14} className="text-slate-400" />
              <span>{pharmacy?.email || "-"}</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <Phone size={14} className="text-slate-400" />
              <span>Emergency: {pharmacy?.emergencyContact || "-"}</span>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-white/60 bg-white/90 p-5 shadow-xl shadow-slate-200/35">
          <h2 className="font-clinic-heading text-[18px] font-semibold text-slate-900">
            Address
          </h2>
          <div className="mt-4 space-y-3 text-[12px] text-slate-600">
            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <MapPin size={14} className="mt-0.5 text-slate-400" />
              <div className="space-y-1 leading-5">
                <p>{address?.addressLine1 || pharmacy?.addressLine1 || "-"}</p>
                {(address?.addressLine2 || pharmacy?.addressLine2) && (
                  <p>{address?.addressLine2 || pharmacy?.addressLine2}</p>
                )}
                <p>
                  {address?.city || pharmacy?.city || "-"}, {address?.state || pharmacy?.state || "-"}
                </p>
                <p>
                  {address?.country || pharmacy?.country || "-"} {address?.zip || pharmacy?.zip || ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-white/60 bg-white/90 p-5 shadow-xl shadow-slate-200/35">
          <h2 className="font-clinic-heading text-[18px] font-semibold text-slate-900">
            Timings
          </h2>
          <div className="mt-4">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-[12px] text-slate-600">
              <Clock3 size={14} className="text-slate-400" />
              <span>
                {pharmacy?.openingTime || "-"} - {pharmacy?.closingTime || "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-white/60 bg-white/90 p-5 shadow-xl shadow-slate-200/35">
          <h2 className="font-clinic-heading text-[18px] font-semibold text-slate-900">
            Services
          </h2>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
            {activeServices.length > 0 ? (
              activeServices.map((service) => (
                <span
                  key={service}
                  className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-2 font-semibold text-teal-700"
                >
                  <Truck size={12} />
                  {service}
                </span>
              ))
            ) : (
              <p className="text-[12px] text-slate-500">No extra services available.</p>
            )}
          </div>
        </div>

        <div className="rounded-[30px] border border-white/60 bg-white/90 p-5 shadow-xl shadow-slate-200/35 lg:col-span-2">
          <h2 className="font-clinic-heading text-[18px] font-semibold text-slate-900">
            Additional Info
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 text-[12px] text-slate-600">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <Tag size={14} className="text-slate-400" />
              <span>Tax No: {pharmacy?.taxNo || "-"}</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <UserRound size={14} className="text-slate-400" />
              <span>Owner: {pharmacy?.ownerName || "-"}</span>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <span className="font-medium text-slate-500">Manager:</span> {pharmacy?.managerName || "-"}
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <span className="font-medium text-slate-500">Min Order Amount:</span> {pharmacy?.minOrderAmount || "-"}
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <span className="font-medium text-slate-500">Delivery Fee:</span> {pharmacy?.deliveryFee || "-"}
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 md:col-span-2">
              <span className="font-medium text-slate-500">Notes:</span> {pharmacy?.notes || "-"}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PharmacyDetails;
