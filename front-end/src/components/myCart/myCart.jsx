import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearMyCart,
  decreaseCartItemQuantity,
  getCart,
  increaseCartItemQuantity,
  removeItemFromCart,
} from "../../redux/cartThunk/cartThunk";
import { useEffect, useMemo } from "react";
import {
  BadgeDollarSign,
  Minus,
  Package2,
  Pill,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  Wallet,
} from "lucide-react";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

function MyCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading, error, message } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const cartItems = cart?.items || [];

  const summary = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => {
        const unitPrice = Number(item?.medicineId?.sellingPrice ?? item?.medicineId?.price ?? 0);
        const quantity = Number(item?.quantity || 0);
        acc.totalUnits += quantity;
        acc.totalPrice += unitPrice * quantity;
        return acc;
      },
      { totalUnits: 0, totalPrice: 0 }
    );
  }, [cartItems]);

  const distinctItems = cartItems.length;

  const handleIncrease = (medicineId) => {
    dispatch(increaseCartItemQuantity(medicineId));
  };

  const handleDecrease = (medicineId) => {
    dispatch(decreaseCartItemQuantity(medicineId));
  };

  const handleRemove = (medicineId) => {
    dispatch(removeItemFromCart(medicineId));
  };

  const handleClearCart = () => {
    dispatch(clearMyCart());
  };

  if (loading && !cart) {
    return <div className="py-20 text-center text-lg text-slate-600">Loading cart...</div>;
  }

  if (error && !cart) {
    return <div className="py-20 text-center text-lg text-rose-600">{error}</div>;
  }

  return (
    <div className="space-y-5 font-clinic-body">
      <section className="rounded-[32px] border border-white/60 bg-white/85 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
              <ShoppingCart size={14} />
              My Cart
            </span>
            <div>
              <h1 className="font-clinic-heading text-[30px] font-semibold text-slate-900">
                Cart Summary
              </h1>
              <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-500">
                Review selected medicines, update quantities, and keep your order details in one clean place.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Cart Items</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{distinctItems}</p>
              <p className="mt-1 text-[11px] text-slate-500">Different medicines</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Total Units</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{summary.totalUnits}</p>
              <p className="mt-1 text-[11px] text-slate-500">All quantities combined</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Total Price</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-600">${summary.totalPrice.toFixed(2)}</p>
              <p className="mt-1 text-[11px] text-slate-500">Estimated medicine total</p>
            </div>
          </div>
        </div>
      </section>

      {message && !error && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700 shadow-sm">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-[13px] text-rose-700 shadow-sm">
          {error}
        </div>
      )}

      {cartItems.length === 0 ? (
        <section className="rounded-[32px] border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center text-slate-500 shadow-sm">
          No items in your cart yet.
        </section>
      ) : (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            {cartItems.map((item) => {
              const medicine = item?.medicineId;
              const quantity = Number(item?.quantity || 0);
              const unitPrice = Number(medicine?.sellingPrice ?? medicine?.price ?? 0);
              const stock = Number(medicine?.stock || 0);
              const remainingStock = Math.max(stock - quantity, 0);
              const itemTotal = unitPrice * quantity;
              const imageUrl = medicine?.image
                ? `${BASE_URL}/${medicine.image.replace(/\\/g, "/")}`
                : null;

              return (
                <article
                  key={item._id || medicine?._id}
                  className="rounded-[30px] border border-white/60 bg-white/90 p-4 shadow-lg shadow-slate-200/35"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="h-24 w-24 overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50 shadow-sm">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={medicine?.name || "Medicine"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sky-700">
                          <Package2 size={28} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="truncate text-[18px] font-semibold text-slate-900">
                              {medicine?.name || "Medicine"}
                            </h2>
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                                stock > 0
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-rose-100 text-rose-700"
                              }`}
                            >
                              {stock > 0 ? `${stock} in stock` : "Out of stock"}
                            </span>
                          </div>
                          <p className="mt-1 text-[12px] text-slate-500">
                            {medicine?.pharmacyName || "Unknown Pharmacy"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-600">
                            Item Total
                          </p>
                          <p className="mt-1 text-[18px] font-semibold text-emerald-700">
                            ${itemTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-4">
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                            Unit Price
                          </p>
                          <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-800">
                            <Wallet size={13} className="text-sky-700" />
                            ${unitPrice.toFixed(2)}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                            Quantity
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDecrease(medicine?._id)}
                              disabled={loading}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-sky-200 hover:text-sky-700 disabled:cursor-not-allowed disabled:text-slate-300"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="min-w-10 text-center text-[13px] font-semibold text-slate-800">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleIncrease(medicine?._id)}
                              disabled={loading || quantity >= stock}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-sky-200 hover:text-sky-700 disabled:cursor-not-allowed disabled:text-slate-300"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                            Price x Qty
                          </p>
                          <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-800">
                            <BadgeDollarSign size={13} className="text-teal-600" />
                            ${unitPrice.toFixed(2)} x {quantity}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                            Stock Left
                          </p>
                          <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-800">
                            <ShieldCheck size={13} className="text-emerald-600" />
                            {remainingStock} remaining
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                        <div className="inline-flex items-center gap-2 text-[12px] text-slate-500">
                          <Pill size={14} className="text-sky-700" />
                          Adjust quantity or remove this medicine from your cart.
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemove(medicine?._id)}
                          disabled={loading}
                          className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-white px-3 py-2 text-[12px] font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
                        >
                          <Trash2 size={14} />
                          Remove Item
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="h-fit rounded-[30px] border border-white/60 bg-white/90 p-5 shadow-xl shadow-slate-200/35">
            <h2 className="font-clinic-heading text-xl font-semibold text-slate-900">
              Order Summary
            </h2>
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span>Different medicines</span>
                <span className="font-semibold text-slate-900">{distinctItems}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span>Total quantity units</span>
                <span className="font-semibold text-slate-900">{summary.totalUnits}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span>Total price</span>
                <span className="font-semibold text-emerald-700">${summary.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-500 px-4 py-4 text-white shadow-lg shadow-sky-500/25">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/75">
                Estimated Checkout
              </p>
              <p className="mt-2 text-3xl font-semibold">${summary.totalPrice.toFixed(2)}</p>
              <p className="mt-2 text-[12px] leading-5 text-white/85">
                Distinct cart items, quantity control, and remove actions are all managed from this screen.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClearCart}
              disabled={loading || cartItems.length === 0}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
            >
              <Trash2 size={15} />
              {loading ? "Updating Cart..." : "Clear My Cart"}
            </button>

            <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
                Next Step
              </p>
              <p className="mt-2 text-[13px] leading-5 text-slate-600">
                Review your checkout details and confirm your order from the next page.
              </p>
              <button
                type="button"
                onClick={() => navigate("/myCheckOut")}
                disabled={cartItems.length === 0}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-500 px-4 py-3 text-[13px] font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-700 hover:to-teal-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                <ShoppingCart size={15} />
                Continue to Checkout
              </button>
            </div>
          </aside>
        </section>
      )}
    </div>
  );
}

export default MyCart;
