import { useEffect, useMemo, useState } from "react";
import { getPharmacies } from "../../../redux/pharmacyThunk/pharmacyThunk";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Building2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Store,
  Truck,
} from "lucide-react";

function PharmacyList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pharmacies, loading, error } = useSelector((state) => state.pharmacy);
  const { user } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const BASE_URL =
    import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    dispatch(getPharmacies());
  }, [dispatch]);

  const filteredPharmacies = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return pharmacies || [];

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

      return haystack.includes(query);
    });
  }, [pharmacies, search]);

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

          {user?.role?.toLowerCase() === "admin" && (
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
        <div className="relative">
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
                    onClick={() => navigate(`/pharmacy/${pharmacy._id}`)}
                  key={pharmacy._id}
                    className="border-t border-slate-100 transition hover:bg-sky-50/40 cursor-pointer"
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
    </div>
  );
}

export default PharmacyList;
