import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HiOutlineUserCircle,
  HiOutlineCalendar,
  HiOutlineBuildingOffice,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineInformationCircle,
} from "react-icons/hi2";
import { changeAppointmentRequestStatus, getAppointmentRequests } from "../../redux/appointmentRequestThunk/appointmentRequestThunk";
import { createAppointment } from "../../redux/appointmentThunk/appointmentThunk";
import { addPatientNotification } from "../../redux/patientNotificationThunk/patientNotificationThunk";

const statusBadge = (status = "pending") => {
  const map = {
    approved: "text-emerald-700 bg-emerald-50 border-emerald-200",
    rejected: "text-rose-700 bg-rose-50 border-rose-200",
    pending: "text-amber-700 bg-amber-50 border-amber-200",
  };
  return map[status.toLowerCase()] || map.pending;
};

const BookingPreviewModal = ({
  request,
  onClose,
  onConfirm,
  feedback,
  submitting,
}) => {
  if (!request) return null;

  const preferredDate = request.raw?.preferredDate
    ? new Date(request.raw.preferredDate)
    : null;
  const defaultDate = preferredDate
    ? preferredDate.toISOString().slice(0, 10)
    : "";
  const defaultTime = preferredDate
    ? preferredDate.toISOString().slice(11, 16)
    : "";

  const [slotDate, setSlotDate] = useState(defaultDate);
  const [slotTime, setSlotTime] = useState(defaultTime);

  useEffect(() => {
    setSlotDate(defaultDate);
    setSlotTime(defaultTime);
  }, [defaultDate, defaultTime]);

  const now = new Date();
  const todayISO = now.toISOString().slice(0, 10);
  const timeFloor = now.toISOString().slice(11, 16);
  const timeMin = slotDate === todayISO ? timeFloor : "00:00";

  const handleDateTimeCombo = (value) => {
    if (!value) return;
    const [datePart, timePart] = value.split("T");
    setSlotDate(datePart || "");
    setSlotTime(timePart?.slice(0, 5) || "");
  };

  const handleConfirmClick = () => onConfirm(request, slotDate, slotTime);

  return (
    <div
      className="fixed inset-0 z-[1200] bg-slate-950/70 px-4 py-10 sm:px-6 md:py-16"
      onClick={onClose}
    >
      <div className="mx-auto flex h-full max-w-3xl flex-col justify-center">
        <div
          className="relative max-h-[calc(100vh-4rem)] overflow-y-auto rounded-[32px] border border-white/10 bg-white/95 p-6 shadow-[0_50px_100px_rgba(15,23,42,0.35)] sm:p-8"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Schedule Preview
              </p>
              <h2 className="mt-1 text-3xl font-semibold text-slate-900">
                Confirm Appointment
              </h2>
              <p className="text-sm text-slate-600">
                Lock in a slot for {request.patient} with {request.doctor}.
              </p>
            </div>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <HiOutlineXCircle className="text-base" />
              Close
            </button>
          </div>

          <div className="mt-6 grid gap-4 rounded-3xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm text-slate-600 sm:grid-cols-2">
            <p>
              Patient:{" "}
              <span className="font-semibold text-slate-900">{request.patient}</span>
            </p>
            <p>
              Doctor:{" "}
              <span className="font-semibold text-slate-900">{request.doctor}</span>
            </p>
            <p>
              Clinic:{" "}
              <span className="font-semibold text-slate-900">{request.clinic}</span>
            </p>
            <p>
              Requested:{" "}
              <span className="font-semibold text-slate-900">{request.requestedDate}</span>
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-700">
                Visit Date
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <HiOutlineCalendar className="text-slate-400" />
                  <input
                    type="date"
                    min={todayISO}
                    value={slotDate}
                    onChange={(e) => setSlotDate(e.target.value)}
                    className="w-full bg-transparent text-slate-900 outline-none"
                  />
                </div>
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Visit Time
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <HiOutlineClock className="text-slate-400" />
                  <input
                    type="time"
                    min={timeMin}
                    value={slotTime}
                    onChange={(e) => setSlotTime(e.target.value)}
                    className="w-full bg-transparent text-slate-900 outline-none"
                  />
                </div>
              </label>
            </div>

            <label className="block text-sm font-semibold text-slate-700">
              Quick Slot Picker
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <HiOutlineCalendar className="text-slate-400" />
                <input
                  type="datetime-local"
                  min={now.toISOString().slice(0, 16)}
                  value={
                    slotDate && slotTime
                      ? `${slotDate}T${slotTime}`
                      : slotDate || slotTime
                  }
                  onChange={(e) => handleDateTimeCombo(e.target.value)}
                  className="w-full bg-transparent text-slate-900 outline-none"
                />
              </div>
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Room / Clinic Notes
              <div className="mt-2 flex items-start gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <HiOutlineMapPin className="mt-1 text-slate-400" />
                <textarea
                  rows={3}
                  placeholder="Add internal notes, e.g., Room 4, fasting required, etc."
                  className="w-full resize-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </label>
          </div>

          {feedback && (
            <div
              className={`mt-6 flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm ${
                feedback.type === "error"
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800"
              }`}
            >
              <HiOutlineInformationCircle className="text-lg" />
              <span>{feedback.message}</span>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleConfirmClick}
              disabled={submitting}
              className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-blue-500/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Booking..." : "Confirm Booking"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function AppointmentRequest() {
  const dispatch = useDispatch();
  const {
    appointmentRequests = [],
    isLoading = false,
    error = null,
  } = useSelector((state) => state.appointmentRequest);
  
  const { user } = useSelector((state) => state.user);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalFeedback, setModalFeedback] = useState(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);

  useEffect(() => {
    dispatch(getAppointmentRequests());
  }, [dispatch]);

  const rows = useMemo(() => {
    if (!Array.isArray(appointmentRequests)) return [];
    return appointmentRequests.map((req) => ({
      id: req?._id,
      patient: req?.patientName || req?.patient?.name || "—",
      doctor: req?.doctorName || req?.doctor?.name || "—",
      clinic: req?.clinicName || req?.clinic?.name || "—",
      requestedDate: req?.preferredDate
        ? new Date(req.preferredDate).toLocaleString()
        : "—",
      status: req?.status || "pending",
      raw: req,
    }));
  }, [appointmentRequests]);

  const pendingRows = useMemo(
    () => rows.filter((row) => row.status.toLowerCase() === "pending"),
    [rows]
  );

  const handleOpenBooking = (requestRow) => {
    if (requestRow.status.toLowerCase() !== "pending") return;
    setModalFeedback(null);
    setSelectedRequest(requestRow);
  };

  const handleReject = async (requestRow) => {
    try {
      await dispatch(
        changeAppointmentRequestStatus({
          requestId: requestRow.id,
          status: "rejected",
        })
      ).unwrap();
    } catch (err) {
      console.error("Failed to reject request:", err);
    }
  };

  const renderActions = (requestRow) => (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => handleOpenBooking(requestRow)}
        className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-100 disabled:opacity-60"
        disabled={requestRow.status.toLowerCase() !== "pending"}
      >
        <HiOutlineCheckCircle className="text-base" />
        Accept
      </button>
      <button
        type="button"
        onClick={() => handleReject(requestRow)}
        className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 shadow-sm transition hover:bg-rose-100 disabled:opacity-60"
        disabled={requestRow.status.toLowerCase() !== "pending"}
      >
        <HiOutlineXCircle className="text-base" />
        Reject
      </button>
    </div>
  );

  const handleConfirmAppointment = async (requestRow, slotDate, slotTime) => {
    if (!slotDate || !slotTime) {
      setModalFeedback({
        type: "error",
        message: "Please choose both a date and a time.",
      });
      return;
    }

    const payload = {
      doctorId: requestRow.raw?.doctorId || requestRow.raw?.doctor?._id,
      clinicId: requestRow.raw?.clinicId || requestRow.raw?.clinic?._id,
      patientId: requestRow.raw?.patientId || requestRow.raw?.patient?._id,
      assistantId: user?._id,
      appointmentDate: new Date(`${slotDate}T${slotTime}`),
    };

    try {
      setModalSubmitting(true);
      setModalFeedback(null);

      await dispatch(createAppointment(payload)).unwrap();
      await dispatch(
        changeAppointmentRequestStatus({
          requestId: requestRow.id,
          status: "approved",
        })
      ).unwrap();

      await dispatch(
        addPatientNotification({
          patientId: payload.patientId,
          clinicId: payload.clinicId,
          doctorId: payload.doctorId,
          assistantId: payload.assistantId,
          message: "Your appointment request has been approved.",
        })
      ).unwrap();

      setModalFeedback({
        type: "success",
        message: "Appointment confirmed and request marked as approved.",
      });

      setTimeout(() => {
        setSelectedRequest(null);
        setModalFeedback(null);
      }, 700);
    } catch (err) {

  console.log("BACKEND ERROR:", err);

  setModalFeedback({
    type: "error",
    message: err || "Something went wrong while confirming the appointment.",
  });

}finally {
      setModalSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Appointment Desk
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-900">
              Appointment Requests
            </h1>
            <p className="text-sm text-slate-600">
              Track incoming patient requests and respond directly from here,
              {user?.name ? ` ${user.name}` : ""}.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Pending Requests:
            <span className="text-lg font-semibold text-slate-900">
              {pendingRows.length}
            </span>
          </div>
        </header>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error.message}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3 rounded-3xl border border-slate-200 bg-white px-4 py-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-14 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : pendingRows.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-slate-600">
            <h3 className="text-2xl font-semibold text-slate-900">
              No pending requests
            </h3>
            <p className="mt-2">
              New appointment requests will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <div className="hidden min-w-[640px] gap-6 border-b border-slate-100 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 md:grid md:grid-cols-[1.3fr_1.2fr_1fr_1fr_1fr]">
                <span>Patient</span>
                <span>Doctor</span>
                <span>Clinic</span>
                <span>Requested</span>
                <span>Status / Actions</span>
              </div>
              <ul className="divide-y divide-slate-100">
                {pendingRows.map((req) => (
                  <li
                    key={req.id}
                    className="min-w-[640px] px-4 py-4 text-sm text-slate-700 md:grid md:grid-cols-[1.3fr_1.2fr_1fr_1fr_1fr] md:items-center md:gap-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="hidden h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 md:flex">
                        <HiOutlineUserCircle />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{req.patient}</p>
                        <p className="text-xs text-slate-500">Patient</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-slate-600 md:mt-0">
                      <HiOutlineUserCircle className="text-slate-400" />
                      <span>{req.doctor}</span>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-slate-600 md:mt-0">
                      <HiOutlineBuildingOffice className="text-slate-400" />
                      <span>{req.clinic}</span>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-slate-600 md:mt-0">
                      <HiOutlineCalendar className="text-slate-400" />
                      <span>{req.requestedDate}</span>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 md:mt-0">
                      <span
                        className={`inline-flex w-fit items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge(
                          req.status
                        )}`}
                      >
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                      {renderActions(req)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {selectedRequest && (
        <BookingPreviewModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onConfirm={handleConfirmAppointment}
          feedback={modalFeedback}
          submitting={modalSubmitting}
        />
      )}
    </section>
  );
}

export default AppointmentRequest;