import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMedicine,
  getMedicines,
} from "../../redux/medicineThunk/medicineThunk";
import {
  Boxes,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Filter,
  Package,
  Package2,
  Pill,
  Search,
  ShieldCheck,
  Tag,
  Trash2,
} from "lucide-react";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const categoriesEnum = ["All", "Tablet", "Capsule", "Syrup", "Injection", "Other"];
const stockEnum = ["All", "In Stock", "Out of Stock"];

function MedicineList() {
  const dispatch = useDispatch();
  const { medicines, loading, error } = useSelector((state) => state.medicine);
  const { user } = useSelector((state) => state.user);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [openDropdown, setOpenDropdown] = useState(null);

  const isAdmin = user?.role?.toLowerCase() === "admin";

  useEffect(() => {
    dispatch(getMedicines());
  }, [dispatch]);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((med) => {
      const searchLower = search.toLowerCase();
      const matchesSearch = [med.name, med.brand, med.manufacturer]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(searchLower));

      const matchesCategory =
        categoryFilter === "All" || med.category === categoryFilter;

      const matchesStock =
        stockFilter === "All" ||
        (stockFilter === "In Stock" && med.stock > 0) ||
        (stockFilter === "Out of Stock" && med.stock === 0);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [medicines, search, categoryFilter, stockFilter]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      dispatch(deleteMedicine(id));
    }
  };

  const handleFilterSelect = (type, value) => {
    if (type === "category") {
      setCategoryFilter(value);
    }

    if (type === "stock") {
      setStockFilter(value);
    }

    setOpenDropdown(null);
  };

  if (loading) {
    return <div className="py-20 text-center text-lg text-slate-600">Loading medicines...</div>;
  }

  if (error) {
    return <div className="py-20 text-center text-lg text-rose-600">{error}</div>;
  }

  if (medicines.length === 0) {
    return <div className="py-20 text-center text-lg text-slate-500">No medicines found.</div>;
  }

  return (
    <div className="space-y-5 font-clinic-body">
      <section className="rounded-[32px] border border-white/60 bg-white/85 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
              <ClipboardList size={14} />
              Pharmacy Stock
            </span>
            <div>
              <h1 className="font-clinic-heading text-[30px] font-semibold text-slate-900">Medicine Stock List</h1>
              <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-500">
                Manage your added medicines in a cleaner tabular inventory view with quick stock scanning and delete access.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Items</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{filteredMedicines.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">In Stock</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-600">
                {filteredMedicines.filter((med) => med.stock > 0).length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Actions</p>
              <p className="mt-1 text-[12px] font-medium text-slate-600">Delete only</p>
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
              placeholder="Search medicine"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-[13px] outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={`grid gap-3 ${isAdmin ? "sm:grid-cols-2" : "sm:grid-cols-1"}`}>
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown((prev) =>
                    prev === "category" ? null : "category"
                  )
                }
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] text-slate-700 transition hover:border-sky-300 hover:bg-white"
              >
                <span className="inline-flex items-center gap-2">
                  <Filter size={15} className="text-sky-700" />
                  Category: {categoryFilter}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition ${
                    openDropdown === "category" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openDropdown === "category" && (
                <div className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
                  {categoriesEnum.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleFilterSelect("category", cat)}
                      className={`block w-full px-4 py-3 text-left text-[13px] transition ${
                        categoryFilter === cat
                          ? "bg-sky-50 font-semibold text-sky-700"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isAdmin && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setOpenDropdown((prev) =>
                      prev === "stock" ? null : "stock"
                    )
                  }
                  className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] text-slate-700 transition hover:border-sky-300 hover:bg-white"
                >
                  <span className="inline-flex items-center gap-2">
                    <Pill size={15} className="text-teal-700" />
                    Stock: {stockFilter}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition ${
                      openDropdown === "stock" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openDropdown === "stock" && (
                  <div className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
                    {stockEnum.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleFilterSelect("stock", item)}
                        className={`block w-full px-4 py-3 text-left text-[13px] transition ${
                          stockFilter === item
                            ? "bg-teal-50 font-semibold text-teal-700"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[32px] border border-white/60 bg-white/90 shadow-xl shadow-slate-200/35">
        {filteredMedicines.length === 0 ? (
          <div className="px-6 py-16 text-center text-slate-500">
            No medicines match your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50/80">
                <tr className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  <th className="px-5 py-4 font-semibold">Medicine</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Buy / Sell</th>
                  <th className="px-5 py-4 font-semibold">Stock</th>
                  <th className="px-5 py-4 font-semibold">Details</th>
                  <th className="px-5 py-4 font-semibold">Expiry</th>
                  <th className="px-5 py-4 text-right font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredMedicines.map((med) => {
                  const imageUrl = med.image
                    ? `${BASE_URL}/${med.image.replace(/\\/g, "/")}`
                    : null;

                  return (
                    <tr
                      key={med._id}
                      className="align-top transition hover:bg-sky-50/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex min-w-[220px] items-start gap-3">
                          <div className="h-14 w-14 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={med.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-sky-700">
                                <Package2 size={22} />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-semibold text-slate-900">
                              {med.name}
                            </p>
                            <p className="mt-1 truncate text-[12px] text-slate-500">
                              {med.brand || "Generic brand"}
                            </p>
                            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-700">
                              <Package size={11} />
                              {med.dosageForm || "Dose not added"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-700">
                          <Pill size={12} />
                          {med.category}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-1 text-[12px]">
                          <p className="font-semibold text-slate-700">
                            Buy: ${Number(med.purchasePrice || 0).toFixed(2)}
                          </p>
                          <p className="font-semibold text-emerald-700">
                            Sell: ${Number(med.sellingPrice ?? med.price ?? 0).toFixed(2)}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                            med.stock > 0
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          <Boxes size={12} />
                          {med.stock > 0 ? `${med.stock} in stock` : "Out of stock"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-1 text-[12px] text-slate-500">
                          <p className="inline-flex items-center gap-1.5">
                            <Tag size={12} />
                            {med.manufacturer || "Unknown manufacturer"}
                          </p>
                          <p className="inline-flex items-center gap-1.5">
                            <ShieldCheck size={12} />
                            {med.strength || "Strength not added"}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-[12px] text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={12} />
                          {med.expiryDate
                            ? new Date(med.expiryDate).toLocaleDateString()
                            : "No expiry date"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDelete(med._id)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 py-2.5 text-[12px] font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default MedicineList;
