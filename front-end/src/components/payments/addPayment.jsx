import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CreditCard,
  LoaderCircle,
  Search,
  Stethoscope,
  Wallet,
} from "lucide-react";
import { getDoctors } from "../../redux/doctorThunk/doctorThunk";
import { resetPaymentState } from "../../redux/paymentSlice/paymentSlice";
import { updatePayment } from "../../redux/paymentThunk/paymentThunk";

function AddPayment() {
  const dispatch = useDispatch();
  const { doctors, loading: doctorsLoading } = useSelector((state) => state.doctors);
  const { loading, error, success, paymentInfo } = useSelector((state) => state.payment);

  const [search, setSearch] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [payment, setPayment] = useState("");

  useEffect(() => {
    dispatch(getDoctors());

    return () => {
      dispatch(resetPaymentState());
    };
  }, [dispatch]);

  const filteredDoctors = useMemo(() => {
    const onlyDoctors =
      doctors?.filter((doctor) => doctor?.role?.toLowerCase() === "doctor") || [];

    if (!search.trim()) return onlyDoctors;

    return onlyDoctors.filter((doctor) =>
      doctor?.name?.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [doctors, search]);

  const selectedDoctor =
    filteredDoctors.find((doctor) => doctor._id === selectedDoctorId) ||
    doctors?.find((doctor) => doctor._id === selectedDoctorId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctorId || !payment) return;

    await dispatch(
      updatePayment({
        doctorId: selectedDoctorId,
        payment: Number(payment),
      })
    );
  };

  return (
    <div className="space-y-5 font-clinic-body">
      <section className="rounded-[32px] border border-white/60 bg-white/85 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl sm:p-7">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
            <Wallet size={14} />
            Add Payment
          </span>
          <div>
            <h1 className="font-clinic-heading text-[30px] font-semibold text-slate-900">
              Add Doctor Payment
            </h1>
            <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-500">
              Select a doctor and submit a payment amount through the update payment API.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-white/60 bg-white/90 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl sm:p-6">
          <div className="relative">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctor by name"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-[13px] text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div className="mt-5 max-h-[430px] space-y-3 overflow-y-auto pr-1">
            {doctorsLoading ? (
              <div className="flex min-h-[160px] items-center justify-center gap-3 text-slate-500">
                <LoaderCircle size={18} className="animate-spin" />
                Loading doctors...
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 px-5 py-14 text-center text-[13px] text-slate-500">
                No doctors found.
              </div>
            ) : (
              filteredDoctors.map((doctor) => {
                const isSelected = selectedDoctorId === doctor._id;

                return (
                  <button
                    key={doctor._id}
                    type="button"
                    onClick={() => setSelectedDoctorId(doctor._id)}
                    className={`flex w-full items-start justify-between rounded-3xl border p-4 text-left transition ${
                      isSelected
                        ? "border-sky-300 bg-sky-50 shadow-lg shadow-sky-100/60"
                        : "border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                        <Stethoscope size={18} />
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900">{doctor?.name}</p>
                        <p className="mt-1 text-[12px] text-slate-500">{doctor?.email || "-"}</p>
                        <p className="mt-2 text-[12px] text-slate-600">
                          Fee: PKR {Number(doctor?.doctorFee || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                      {doctor?.paymentStatus || "unpaid"}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <section className="rounded-[32px] border border-white/60 bg-white/90 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-3xl bg-gradient-to-br from-sky-600 to-teal-500 p-5 text-white shadow-lg shadow-sky-500/20">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">
                Payment Entry
              </p>
              <p className="mt-2 text-sm leading-6 text-white/90">
                Submit the entered amount for the selected doctor.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Selected Doctor
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {selectedDoctor?.name || "Choose a doctor"}
              </p>
              <p className="mt-1 text-[13px] text-slate-500">
                {selectedDoctor?.email || "Doctor email will appear here"}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Payment Amount
              </label>
              <div className="relative">
                <CreditCard
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                  placeholder="Enter payment amount"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-[13px] text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedDoctorId || !payment || loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-500 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-700 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <LoaderCircle size={16} className="animate-spin" /> : <Wallet size={16} />}
              {loading ? "Submitting..." : "Submit Payment"}
            </button>

            {error && (
              <div className="rounded-2xl bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
                {paymentInfo?.message || "Payment updated successfully."}
              </div>
            )}
          </form>
        </section>
      </section>
    </div>
  );
}

export default AddPayment;
