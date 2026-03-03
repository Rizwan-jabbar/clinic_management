import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAppointment } from "../../redux/appointmentThunk/appointmentThunk";

const AppointmentForm = ({
  doctorName,
  clinicName,
  doctorId,
  clinicId,
  onClose,
}) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.appointment?.loading);

  const [formData, setFormData] = useState({
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setErrorMsg("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.appointmentDate || !formData.appointmentTime) {
        setErrorMsg("Date and time are required");
        return;
      }

      const combinedDateTime = new Date(
        `${formData.appointmentDate}T${formData.appointmentTime}`
      ).toISOString();

      await dispatch(
        createAppointment({
          doctorId,
          clinicId,
          appointmentDate: combinedDateTime,
          reason: formData.reason,
        })
      ).unwrap();

      setSuccess(true);
      setFormData({ appointmentDate: "", appointmentTime: "", reason: "" });
    } catch (error) {
      console.log("Appointment Error:", error);
      setErrorMsg(error || "Something went wrong");
    }
  };

  return (
    <div className="relative w-full max-w-xl overflow-y-auto
    rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-2xl shadow-slate-200/80">
      {/* Success overlay */}
      {success && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-black/50 backdrop-blur-sm">
          <div className="w-[90%] max-w-md rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-4xl text-emerald-600">
              ✔
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Appointment requested
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              You’ll receive confirmation shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow shadow-emerald-400/40 transition hover:bg-emerald-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className={success ? "pointer-events-none opacity-20" : ""}>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-500">
            Booking
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Schedule appointment
          </h2>
          <p className="text-sm text-slate-500">
            Choose a date, time, and tell us the reason for the visit.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <input
            type="text"
            value={doctorName || ""}
            disabled
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
          />
          <input
            type="text"
            value={clinicName || ""}
            disabled
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
          />
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <input
            type="time"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <textarea
            rows="3"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Reason for appointment..."
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          {errorMsg && (
            <p className="text-sm font-semibold text-rose-600">{errorMsg}</p>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow shadow-blue-500/30 transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Booking…" : "Confirm appointment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;