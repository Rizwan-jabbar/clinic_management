import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  BadgeDollarSign,
  Banknote,
  CheckCircle2,
  ChevronLeft,
  ClipboardList,
  CreditCard,
  MapPin,
  PackageCheck,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";
import { clearMyCart, getCart } from "../../redux/cartThunk/cartThunk";
import { createOrder } from "../../redux/orderThunk/orderThunk";

function MyCheckOut() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const {
    loading: orderLoading,
    error: orderError,
    success: orderSuccess,
    message: orderMessage,
  } = useSelector((state) => state.order);

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [deliveryType, setDeliveryType] = useState("home");
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [showPlacedState, setShowPlacedState] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    city: "",
    addressLine1: "",
    addressLine2: "",
    postalCode: "",
    notes: "",
  });

  useEffect(() => {
    if (!cart) {
      dispatch(getCart());
    }
  }, [cart, dispatch]);

  const cartItems = cart?.items || [];

  const summary = useMemo(() => {
    const totals = cartItems.reduce(
      (acc, item) => {
        const quantity = Number(item?.quantity || 0);
        const price = Number(item?.medicineId?.sellingPrice ?? item?.medicineId?.price ?? 0);
        acc.totalUnits += quantity;
        acc.subtotal += price * quantity;
        return acc;
      },
      { distinctItems: cartItems.length, totalUnits: 0, subtotal: 0 }
    );

    const deliveryFee = cartItems.length > 0 ? 150 : 0;
    const serviceFee = cartItems.length > 0 ? 50 : 0;

    return {
      ...totals,
      deliveryFee,
      serviceFee,
      grandTotal: totals.subtotal + deliveryFee + serviceFee,
    };
  }, [cartItems]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitError("");
  };

  const validateCheckoutForm = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required";
    if (!form.email.trim()) nextErrors.email = "Email address is required";
    if (!form.city.trim()) nextErrors.city = "City is required";
    if (!form.addressLine1.trim()) nextErrors.addressLine1 = "Address line 1 is required";
    if (!form.postalCode.trim()) nextErrors.postalCode = "Postal code is required";
    if (!deliveryType) nextErrors.deliveryType = "Delivery method is required";
    if (!paymentMethod) nextErrors.paymentMethod = "Payment method is required";
    if (cartItems.length === 0) nextErrors.cart = "Your cart is empty";

    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }

    setValidationErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePlaceOrderClick = () => {
    if (!validateCheckoutForm()) {
      setSubmitError("Please complete all required checkout details before placing the order.");
      return;
    }

    setSubmitError("");
    setShowConfirmBox(true);
  };

  const handleConfirmPlaceOrder = () => {
    const orderPayload = {
      items: cartItems.map((item) => ({
        medicineId: item?.medicineId?._id,
        quantity: Number(item?.quantity || 0),
        price: Number(item?.medicineId?.sellingPrice ?? item?.medicineId?.price ?? 0),
      })),
      totalAmount: Number(summary.subtotal.toFixed(2)),
      customerInfo: {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
      },
      deliveryAddress: {
        city: form.city.trim(),
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2.trim(),
        postalCode: form.postalCode.trim(),
        notes: form.notes.trim(),
      },
      deliveryType,
      paymentMethod,
    };

    dispatch(createOrder(orderPayload))
      .unwrap()
      .then(() => {
        dispatch(clearMyCart())
          .unwrap()
          .catch(() => {});
        setValidationErrors({});
        setSubmitError("");
        setShowConfirmBox(false);
        setShowPlacedState(true);
      })
      .catch(() => {});
  };

  if (loading && !cart) {
    return (
      <div className="py-20 text-center text-lg text-slate-600">
        Loading checkout...
      </div>
    );
  }

  return (
    <div className="space-y-5 font-clinic-body">
      <section className="rounded-[32px] border border-white/60 bg-white/85 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
              <ClipboardList size={14} />
              Checkout
            </span>
            <div>
              <h1 className="font-clinic-heading text-[30px] font-semibold text-slate-900">
                Complete Your Order
              </h1>
              <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-500">
                Fill in delivery details, review your medicines, and use the place order button when you are ready.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/myCart")}
            className="inline-flex items-center gap-2 self-start rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
          >
            <ChevronLeft size={15} />
            Back to Cart
          </button>
        </div>
      </section>

      {showPlacedState && (
        <div className="rounded-[28px] border border-emerald-100 bg-emerald-50 px-5 py-4 text-emerald-700 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-[14px] font-semibold">Order placed confirmation UI</p>
                <p className="mt-1 text-[12px] leading-5 text-emerald-700/90">
                  {orderMessage || "Order has been created successfully."}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowPlacedState(false)}
              className="rounded-2xl bg-white px-4 py-2 text-[12px] font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {orderError && (
        <div className="rounded-[28px] border border-rose-100 bg-rose-50 px-5 py-4 text-[13px] text-rose-700 shadow-sm">
          {orderError}
        </div>
      )}

      {submitError && (
        <div className="rounded-[28px] border border-amber-100 bg-amber-50 px-5 py-4 text-[13px] text-amber-700 shadow-sm">
          {submitError}
        </div>
      )}

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <div className="rounded-[30px] border border-white/60 bg-white/90 p-5 shadow-lg shadow-slate-200/35">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                <UserRound size={18} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Patient Information</h2>
                <p className="text-[12px] text-slate-500">
                  Add the information usually needed before placing a medicine order.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[12px] font-semibold text-slate-600">Full Name</span>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleFieldChange}
                  placeholder="Enter full name"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
                {validationErrors.fullName && (
                  <p className="text-[11px] text-rose-600">{validationErrors.fullName}</p>
                )}
              </label>

              <label className="space-y-2">
                <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-600">
                  <Phone size={13} className="text-sky-700" />
                  Phone Number
                </span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleFieldChange}
                  placeholder="03xx-xxxxxxx"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
                {validationErrors.phone && (
                  <p className="text-[11px] text-rose-600">{validationErrors.phone}</p>
                )}
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-[12px] font-semibold text-slate-600">Email Address</span>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleFieldChange}
                  placeholder="Enter email address"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
                {validationErrors.email && (
                  <p className="text-[11px] text-rose-600">{validationErrors.email}</p>
                )}
              </label>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/60 bg-white/90 p-5 shadow-lg shadow-slate-200/35">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-teal-100 p-3 text-teal-700">
                <MapPin size={18} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Delivery Details</h2>
                <p className="text-[12px] text-slate-500">
                  Complete shipping information for home delivery or pharmacy pickup.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[12px] font-semibold text-slate-600">City</span>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleFieldChange}
                  placeholder="City"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
                {validationErrors.city && (
                  <p className="text-[11px] text-rose-600">{validationErrors.city}</p>
                )}
              </label>

              <label className="space-y-2">
                <span className="text-[12px] font-semibold text-slate-600">Postal Code</span>
                <input
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleFieldChange}
                  placeholder="Postal code"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
                {validationErrors.postalCode && (
                  <p className="text-[11px] text-rose-600">{validationErrors.postalCode}</p>
                )}
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-[12px] font-semibold text-slate-600">Address Line 1</span>
                <input
                  name="addressLine1"
                  value={form.addressLine1}
                  onChange={handleFieldChange}
                  placeholder="House no, street, area"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
                {validationErrors.addressLine1 && (
                  <p className="text-[11px] text-rose-600">{validationErrors.addressLine1}</p>
                )}
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-[12px] font-semibold text-slate-600">Address Line 2</span>
                <input
                  name="addressLine2"
                  value={form.addressLine2}
                  onChange={handleFieldChange}
                  placeholder="Apartment, landmark, optional details"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-[12px] font-semibold text-slate-600">Order Notes</span>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleFieldChange}
                  rows={4}
                  placeholder="Add delivery notes, medicine timing note, or special instructions"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
              </label>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-[30px] border border-white/60 bg-white/90 p-5 shadow-lg shadow-slate-200/35">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                  <Truck size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Delivery Method</h2>
                  <p className="text-[12px] text-slate-500">
                    Choose how the order should be handed over.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {[ 
                  {
                    id: "home",
                    title: "Home Delivery",
                    text: "Medicine will be delivered to the provided address.",
                  },
                  {
                    id: "pickup",
                    title: "Pharmacy Pickup",
                    text: "Keep the order ready for pickup from the pharmacy counter.",
                  },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setDeliveryType(option.id)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                      deliveryType === option.id
                        ? "border-sky-300 bg-sky-50 shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:border-sky-200 hover:bg-white"
                    }`}
                  >
                    <p className="text-[13px] font-semibold text-slate-900">{option.title}</p>
                    <p className="mt-1 text-[12px] leading-5 text-slate-500">{option.text}</p>
                  </button>
                ))}
                {validationErrors.deliveryType && (
                  <p className="text-[11px] text-rose-600">{validationErrors.deliveryType}</p>
                )}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/60 bg-white/90 p-5 shadow-lg shadow-slate-200/35">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                  <CreditCard size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Payment Method</h2>
                  <p className="text-[12px] text-slate-500">
                    UI-only selection for the final checkout screen.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  {
                    id: "cash",
                    title: "Cash on Delivery",
                    text: "Pay when the medicines arrive at your address.",
                    icon: Banknote,
                  },
                  {
                    id: "card",
                    title: "Card Payment",
                    text: "Use this as a placeholder for future online payment.",
                    icon: CreditCard,
                  },
                ].map((option) => {
                  const Icon = option.icon;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setPaymentMethod(option.id)}
                      className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-4 text-left transition ${
                        paymentMethod === option.id
                          ? "border-emerald-300 bg-emerald-50 shadow-sm"
                          : "border-slate-200 bg-slate-50 hover:border-emerald-200 hover:bg-white"
                      }`}
                    >
                      <div className="rounded-xl bg-white p-2 text-slate-700 shadow-sm">
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-slate-900">{option.title}</p>
                        <p className="mt-1 text-[12px] leading-5 text-slate-500">{option.text}</p>
                      </div>
                    </button>
                  );
                })}
                {validationErrors.paymentMethod && (
                  <p className="text-[11px] text-rose-600">{validationErrors.paymentMethod}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[30px] border border-white/60 bg-white/90 p-5 shadow-xl shadow-slate-200/35">
            <h2 className="text-xl font-semibold text-slate-900">Order Summary</h2>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span>Different medicines</span>
                <span className="font-semibold text-slate-900">{summary.distinctItems}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span>Total units</span>
                <span className="font-semibold text-slate-900">{summary.totalUnits}</span>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {cartItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-[13px] text-slate-500">
                  Your cart is empty. Add medicines before reviewing checkout details.
                </div>
              ) : (
                cartItems.map((item) => {
                  const medicine = item?.medicineId;
                  const quantity = Number(item?.quantity || 0);
                  const unitPrice = Number(medicine?.sellingPrice ?? medicine?.price ?? 0);

                  return (
                    <div
                      key={item._id || medicine?._id}
                      className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-slate-900">
                            {medicine?.name || "Medicine"}
                          </p>
                          <p className="mt-1 text-[11px] text-slate-500">
                            {medicine?.pharmacyName || "Unknown Pharmacy"}
                          </p>
                        </div>
                        <p className="text-[12px] font-semibold text-emerald-700">
                          ${(unitPrice * quantity).toFixed(2)}
                        </p>
                      </div>
                      <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                        <BadgeDollarSign size={12} className="text-teal-600" />
                        ${unitPrice.toFixed(2)} x {quantity}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">${summary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Delivery Fee</span>
                <span className="font-semibold text-slate-900">${summary.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Service Fee</span>
                <span className="font-semibold text-slate-900">${summary.serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-slate-700">
                <span className="font-semibold">Estimated Total</span>
                <span className="text-lg font-semibold text-emerald-700">
                  ${summary.grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-500 px-4 py-4 text-white shadow-lg shadow-sky-500/25">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/75">
                Secure Checkout
              </p>
              <p className="mt-2 text-[13px] leading-6 text-white/90">
                Review your order details carefully before sending the create-order request.
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-sky-700" />
                <div className="text-[12px] leading-5 text-slate-600">
                  Delivery address, contact details, payment method, and delivery method are required before order placement.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrderClick}
              disabled={cartItems.length === 0 || orderLoading}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-500 px-4 py-3 text-[13px] font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-700 hover:to-teal-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              <PackageCheck size={16} />
              {orderLoading ? "Placing Order..." : "Place Order"}
            </button>
          </div>

          <div className="rounded-[30px] border border-white/60 bg-white/90 p-5 shadow-lg shadow-slate-200/35">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Checklist</h2>
                <p className="text-[12px] text-slate-500">
                  Common fields and review points for a medicine checkout screen.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                "Patient full name and contact number",
                "Email and delivery address details",
                "Delivery method and payment method selection",
                "Order notes for dosage or timing instructions",
                "Medicine-wise order summary before confirmation",
              ].map((item) => (
                <div
                  key={item}
                  className="inline-flex w-full items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-[12px] text-slate-600"
                >
                  <ShoppingBag size={14} className="shrink-0 text-teal-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {showConfirmBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
          <div className="w-full max-w-md rounded-[30px] border border-white/70 bg-white p-6 shadow-2xl shadow-slate-900/20">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                <PackageCheck size={18} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Confirm Place Order</h3>
                <p className="mt-2 text-[13px] leading-6 text-slate-500">
                  Confirm karne par `createOrder` API call hogi aur current cart items order me send honge.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-4 text-[13px] text-slate-600">
              <p>
                Estimated total: <span className="font-semibold text-slate-900">${summary.grandTotal.toFixed(2)}</span>
              </p>
              <p className="mt-2">
                Items in order: <span className="font-semibold text-slate-900">{summary.distinctItems}</span>
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowConfirmBox(false)}
                className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPlaceOrder}
                disabled={orderLoading}
                className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-600 to-teal-500 px-4 py-3 text-[13px] font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-700 hover:to-teal-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {orderLoading ? "Sending..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyCheckOut;
