import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartThunk/cartThunk";
import { getAllMedicines } from "../../redux/medicineThunk/medicineThunk";
import {
  MapPin,
  Package2,
  Search,
  ShoppingCart,
  Sparkles,
  Store,
  Wallet,
} from "lucide-react";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

function AllMedicine() {
  const dispatch = useDispatch();
  const { medicines, loading, error } = useSelector((state) => state.medicine);
  const { user } = useSelector((state) => state.user);
  const {
    loading: cartLoading,
    error: cartError,
    message: cartMessage,
  } = useSelector((state) => state.cart);

  const [search, setSearch] = useState("");
  const userRole = user?.role?.toLowerCase() || "";
  const canAddToCart = userRole === "patient" || userRole === "user";

  useEffect(() => {
    dispatch(getAllMedicines());
  }, [dispatch]);

  const filteredMedicines = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return medicines.filter((medicine) => {
      if (!searchValue) {
        return true;
      }

      return [medicine.name, medicine.brand, medicine.manufacturer, medicine.pharmacyName]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(searchValue));
    });
  }, [medicines, search]);

  const addToCartHandler = (medicineId) => {
    dispatch(
      addToCart({
        medicineId,
        quantity: 1,
      })
    );
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-lg text-slate-600">
        Loading medicines...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-lg text-rose-600">{error}</div>
    );
  }

  return (
    <div className="space-y-5 font-clinic-body">
      <section className="rounded-[32px] border border-white/60 bg-white/85 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
              <Sparkles size={14} />
              Pharmacy Shelf
            </span>
            <div>
              <h1 className="font-clinic-heading text-[30px] font-semibold text-slate-900">
                All Medicines
              </h1>
              <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-500">
                Browse medicines in a simple clinic-style catalog with images,
                clean details, and quick add-to-cart access.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Total
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {filteredMedicines.length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                In Stock
              </p>
              <p className="mt-1 text-2xl font-semibold text-emerald-600">
                {filteredMedicines.filter((medicine) => medicine.stock > 0).length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                View
              </p>
              <p className="mt-1 text-[12px] font-medium text-slate-600">
                Compact cards
              </p>
            </div>
          </div>
        </div>
      </section>

      {(cartMessage || cartError) && (
        <div
          className={`rounded-2xl border px-4 py-3 text-[13px] shadow-sm ${
            cartError
              ? "border-rose-100 bg-rose-50 text-rose-700"
              : "border-emerald-100 bg-emerald-50 text-emerald-700"
          }`}
        >
          {cartError || cartMessage}
        </div>
      )}

      <section className="rounded-[32px] border border-white/60 bg-white/85 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search medicine, pharmacy, brand"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-[13px] outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-500">
            {user?.role?.toLowerCase() === "pharmacy"
              ? "Browse all medicines while managing your own stock separately."
              : "Quick medicine browsing with product image and stock visibility."}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filteredMedicines.length === 0 ? (
          <div className="col-span-full rounded-[32px] border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center text-slate-500">
            No medicines match your search.
          </div>
        ) : (
          filteredMedicines.map((medicine) => {
            const imageUrl = medicine.image
              ? `${BASE_URL}/${medicine.image.replace(/\\/g, "/")}`
              : null;

            return (
              <article
                key={medicine._id}
                className="overflow-hidden rounded-[30px] border border-white/60 bg-white/95 shadow-lg shadow-slate-200/35 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-300/30"
              >
                <div className="border-b border-slate-100 bg-gradient-to-b from-sky-50 via-white to-teal-50 px-4 py-3">
                  <div className="mx-auto h-20 w-20 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-md shadow-slate-200/50">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={medicine.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sky-700">
                        <Package2 size={30} />
                      </div>
                    )}
                  </div>

                  <div className="mt-3 text-center">
                    <h2 className="line-clamp-2 text-[14px] font-semibold leading-5 text-slate-900">
                      {medicine.name}
                    </h2>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {medicine.brand || "Generic brand"}
                    </p>
                    <span className="mt-2 inline-flex rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-700">
                      {medicine.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 p-4">
                  <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-3 text-[11px] text-slate-600">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                        Price
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1.5 font-semibold text-slate-800">
                        <Wallet size={12} className="text-sky-700" />
                        ${Number(medicine.sellingPrice ?? medicine.price ?? 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                        Stock
                      </p>
                      <p
                        className={`mt-1 font-semibold ${
                          medicine.stock > 0 ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {medicine.stock > 0 ? `${medicine.stock} available` : "Out of stock"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                        Pharmacy
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1.5 font-medium text-slate-700">
                        <Store size={12} className="text-teal-600" />
                        {medicine.addedBy?.pharmacyName ||
                          medicine.pharmacyName ||
                          "Unknown Pharmacy"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white px-3 py-2.5 text-[11px] text-slate-500">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Pharmacy Address
                    </p>
                    <p className="mt-1 inline-flex items-start gap-1.5 leading-5 text-[12px] text-slate-600">
                      <MapPin size={12} className="mt-0.5 shrink-0 text-teal-600" />
                      {medicine.addedBy?.address?.addressLine1 || "Address not available"}
                    </p>
                  </div>

                  {canAddToCart && (
                    <button
                      onClick={() => addToCartHandler(medicine._id)}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-3 py-3 text-[12px] font-semibold text-white shadow-sm transition ${
                        medicine.stock === 0 || cartLoading
                          ? "cursor-not-allowed bg-slate-300"
                          : "bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-700 hover:to-teal-600"
                      }`}
                      disabled={medicine.stock === 0 || cartLoading}
                    >
                      <ShoppingCart size={14} />
                      {cartLoading ? "Adding..." : "Add to Cart"}
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}

export default AllMedicine;
