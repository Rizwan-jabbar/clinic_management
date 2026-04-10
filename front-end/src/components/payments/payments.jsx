import axios from "axios";
import { useEffect, useState } from "react";
import {
  BadgeDollarSign,
  Building2,
  CircleDollarSign,
  CreditCard,
  Filter,
  LoaderCircle,
  ReceiptText,
  Search,
  Stethoscope,
  Wallet,
} from "lucide-react";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

const filterOptions = [
  { value: "doctor", label: "Doctor", icon: Stethoscope },
  { value: "pharmacy", label: "Pharmacy", icon: Building2 },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "partial", label: "Partial" },
  { value: "unpaid", label: "Unpaid" },
];

const getStatusClasses = (status) => {
  const normalizedStatus = String(status || "").toLowerCase();

  if (normalizedStatus === "paid" || normalizedStatus === "completed") {
    return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200";
  }

  if (normalizedStatus === "pending") {
    return "bg-amber-100 text-amber-700 ring-1 ring-amber-200";
  }

  if (normalizedStatus === "partial") {
    return "bg-sky-100 text-sky-700 ring-1 ring-sky-200";
  }

  if (normalizedStatus === "unpaid") {
    return "bg-rose-100 text-rose-700 ring-1 ring-rose-200";
  }

  if (normalizedStatus === "failed" || normalizedStatus === "rejected") {
    return "bg-rose-100 text-rose-700 ring-1 ring-rose-200";
  }

  return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
};

const getPaymentStatus = (payment) =>
  payment?.paymentStatus || payment?.status || "unknown";

function Payments() {
  const [selectedType, setSelectedType] = useState("doctor");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError("");

      try {
        const [doctorResponse, pharmacyResponse] = await Promise.all([
          axios.get(`${BASE_URL}/getDoctors`, {
            headers: getAuthHeaders(),
          }),
          axios.get(`${BASE_URL}/getPharmacies`, {
            headers: getAuthHeaders(),
          }),
        ]);

        const doctors = (doctorResponse?.data?.doctors || doctorResponse?.data || [])
          .filter((doctor) => doctor?.role?.toLowerCase() === "doctor")
          .map((doctor) => ({
            _id: doctor?._id,
            doctorId: doctor?._id,
            name: doctor?.name,
            email: doctor?.email,
            type: "doctor",
            paymentStatus: doctor?.paymentStatus,
            paymentId:
              doctor?.paymentsHistory?.[doctor?.paymentsHistory?.length - 1]?._id ||
              "-",
            paymentMethod:
              doctor?.paymentsHistory?.[doctor?.paymentsHistory?.length - 1]
                ?.method || "-",
            date:
              doctor?.paymentsHistory?.[doctor?.paymentsHistory?.length - 1]
                ?.date || doctor?.updatedAt,
            amountToPay:
              doctor?.amountToPay ??
              doctor?.ammountToPay ??
              doctor?.doctorFee ??
              0,
            amount:
              (doctor?.amountToPay ??
                doctor?.ammountToPay ??
                doctor?.doctorFee ??
                0),
            iconType: "doctor",
          }));

        const pharmacies = (pharmacyResponse?.data?.data || pharmacyResponse?.data?.pharmacies || [])
          .map((pharmacy) => ({
            _id: pharmacy?._id,
            pharmacyId: pharmacy?._id,
            name: pharmacy?.name || pharmacy?.pharmacyName,
            email: pharmacy?.email,
            type: "pharmacy",
            paymentStatus: pharmacy?.paymentStatus || "unpaid",
            paymentId:
              pharmacy?.paymentsHistory?.[pharmacy?.paymentsHistory?.length - 1]?._id ||
              "-",
            paymentMethod:
              pharmacy?.paymentsHistory?.[pharmacy?.paymentsHistory?.length - 1]
                ?.method || "-",
            date:
              pharmacy?.paymentsHistory?.[pharmacy?.paymentsHistory?.length - 1]
                ?.date || pharmacy?.updatedAt,
            amountToPay:
              pharmacy?.amountToPay ??
              pharmacy?.ammountToPay ??
              0,
            amount:
              (pharmacy?.amountToPay ??
                pharmacy?.ammountToPay ??
                0),
            iconType: "pharmacy",
          }));

        setPayments([...doctors, ...pharmacies]);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch payments data."
        );
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((item) => {
    const matchesType = selectedType ? item?.type === selectedType : true;
    const matchesStatus =
      selectedStatus === "all"
        ? true
        : String(getPaymentStatus(item) || "").toLowerCase() === selectedStatus;
    const matchesSearch = search.trim()
      ? item?.name?.toLowerCase().includes(search.trim().toLowerCase())
      : true;

    return matchesType && matchesStatus && matchesSearch;
  });

  const totalAmount = filteredPayments.reduce(
    (sum, item) => sum + Number(item?.amount || 0),
    0
  );
  const paidCount = filteredPayments.filter((item) =>
    ["paid", "completed"].includes(
      String(getPaymentStatus(item) || "").toLowerCase()
    )
  ).length;
  const pendingCount = filteredPayments.filter(
    (item) => String(getPaymentStatus(item) || "").toLowerCase() === "pending"
  ).length;
  const partialCount = filteredPayments.filter(
    (item) => String(getPaymentStatus(item) || "").toLowerCase() === "partial"
  ).length;

  return (
    <div className="space-y-5 font-clinic-body">
      <section className="rounded-[32px] border border-white/60 bg-white/85 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl sm:p-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
              <Wallet size={14} />
              Payments
            </span>
            <div>
              <h1 className="font-clinic-heading text-[30px] font-semibold text-slate-900">
                Payment Records
              </h1>
              <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-500">
                Review doctor and pharmacy payments in one focused workspace
                with quick filters and searchable records.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[420px]">
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                  <CircleDollarSign size={18} />
                </span>
                <div>
                  <p className="text-[12px] text-slate-500">Total Records</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {filteredPayments.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                  <BadgeDollarSign size={18} />
                </span>
                <div>
                  <p className="text-[12px] text-slate-500">Paid</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {paidCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                  <ReceiptText size={18} />
                </span>
                <div>
                  <p className="text-[12px] text-slate-500">Pending</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {pendingCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                  <Filter size={18} />
                </span>
                <div>
                  <p className="text-[12px] text-slate-500">Partial</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {partialCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/60 bg-white/85 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              {filterOptions.map((option) => {
                const Icon = option.icon;
                const isActive = selectedType === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedType(option.value)}
                    className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-[13px] font-semibold transition ${
                      isActive
                        ? "bg-gradient-to-r from-sky-600 to-teal-500 text-white shadow-lg shadow-sky-500/25"
                        : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon size={16} />
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:max-w-md">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${selectedType} by name`}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-[13px] text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => {
              const isActive = selectedStatus === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedStatus(option.value)}
                  className={`rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition ${
                    isActive
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-300/30"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/80 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
              Paid
            </p>
            <p className="mt-2 text-2xl font-semibold text-emerald-800">{paidCount}</p>
          </div>
          <div className="rounded-3xl border border-amber-100 bg-amber-50/80 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">
              Pending
            </p>
            <p className="mt-2 text-2xl font-semibold text-amber-800">{pendingCount}</p>
          </div>
          <div className="rounded-3xl border border-sky-100 bg-sky-50/80 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700">
              Partial
            </p>
            <p className="mt-2 text-2xl font-semibold text-sky-800">{partialCount}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
              Total Due
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              PKR {totalAmount.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-[12px] text-slate-500">
          <span className="rounded-full bg-sky-50 px-3 py-1 font-medium text-sky-700 capitalize">
            Showing {selectedType} payments
          </span>
          <span className="rounded-full bg-white px-3 py-1 font-medium text-slate-600 ring-1 ring-slate-200">
            Status: {selectedStatus}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
            Total Amount: PKR {totalAmount.toLocaleString()}
          </span>
        </div>
      </section>

      <section className="overflow-hidden rounded-[32px] border border-white/60 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur-xl">
        {loading ? (
          <div className="flex min-h-[280px] items-center justify-center gap-3 px-6 py-16 text-slate-500">
            <LoaderCircle size={20} className="animate-spin" />
            Loading payments...
          </div>
        ) : error ? (
          <div className="px-6 py-16 text-center text-rose-600">{error}</div>
        ) : filteredPayments.length === 0 ? (
          <div className="px-6 py-16 text-center text-slate-500">
            No payment records found.
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-[1120px] w-full text-left text-[13px] text-slate-700">
                <thead className="bg-slate-50/80 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Name</th>
                    <th className="px-5 py-4">Type</th>
                    <th className="px-5 py-4">Payment ID</th>
                    <th className="px-5 py-4">Method</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Current Due</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment, index) => {
                    const displayName =
                      payment?.name ||
                      payment?.doctorName ||
                      payment?.pharmacyName ||
                      payment?.userName ||
                      "Unknown";

                    return (
                      <tr
                        key={payment?._id || payment?.id || index}
                        className="border-t border-slate-100 transition hover:bg-sky-50/40"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className={`rounded-2xl p-3 ${
                              payment?.type === "pharmacy"
                                ? "bg-teal-50 text-teal-700"
                                : "bg-sky-50 text-sky-700"
                            }`}>
                              {payment?.type === "pharmacy" ? (
                                <Building2 size={16} />
                              ) : (
                                <Stethoscope size={16} />
                              )}
                            </span>
                            <div>
                              <p className="font-semibold text-slate-900">
                                {displayName}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {payment?.email || payment?.contact || "-"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                            {payment?.type || selectedType}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-medium text-slate-600">
                          {payment?.paymentId || payment?.transactionId || "-"}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-[12px] font-medium text-slate-700">
                            <CreditCard size={13} className="text-slate-400" />
                            {payment?.paymentMethod || payment?.method || "-"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {payment?.date || payment?.createdAt?.slice(0, 10) || "-"}
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-900">
                          PKR {Number(payment?.amountToPay || 0).toLocaleString()}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getStatusClasses(
                              getPaymentStatus(payment)
                            )}`}
                          >
                            {getPaymentStatus(payment)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-4 lg:hidden">
              {filteredPayments.map((payment, index) => {
                const displayName =
                  payment?.name ||
                  payment?.doctorName ||
                  payment?.pharmacyName ||
                  payment?.userName ||
                  "Unknown";

                return (
                  <article
                    key={payment?._id || payment?.id || index}
                    className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`rounded-2xl p-3 ${
                          payment?.type === "pharmacy"
                            ? "bg-teal-50 text-teal-700"
                            : "bg-sky-50 text-sky-700"
                        }`}>
                          {payment?.type === "pharmacy" ? (
                            <Building2 size={16} />
                          ) : (
                            <Stethoscope size={16} />
                          )}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {displayName}
                          </p>
                          <p className="text-[12px] text-slate-500 capitalize">
                            {payment?.type || selectedType}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getStatusClasses(
                          getPaymentStatus(payment)
                        )}`}
                      >
                        {getPaymentStatus(payment)}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 text-[12px] text-slate-600 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 px-3 py-2">
                        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">
                          Payment ID
                        </p>
                        <p className="mt-1 font-medium text-slate-700">
                          {payment?.paymentId || payment?.transactionId || "-"}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-3 py-2">
                        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">
                          Method
                        </p>
                        <p className="mt-1 font-medium text-slate-700">
                          {payment?.paymentMethod || payment?.method || "-"}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-3 py-2">
                        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">
                          Date
                        </p>
                        <p className="mt-1 font-medium text-slate-700">
                          {payment?.date || payment?.createdAt?.slice(0, 10) || "-"}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-3 py-2">
                        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">
                          Current Due
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">
                          PKR {Number(payment?.amountToPay || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Payments;
