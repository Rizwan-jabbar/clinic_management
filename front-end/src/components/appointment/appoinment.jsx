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

    /* ✅ Safe loading from redux */
    const loading = useSelector(
        (state) => state.appointment?.loading
    );

    const [formData, setFormData] = useState({
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
    });

    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    /* ===============================
       ✅ HANDLE CHANGE
    ================================*/
    const handleChange = (e) => {
        setErrorMsg("");

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    /* ===============================
       ✅ SUBMIT FORM
    ================================*/
    const handleSubmit = async () => {
        try {
            if (
                !formData.appointmentDate ||
                !formData.appointmentTime
            ) {
                setErrorMsg("Date and Time are required");
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

            // ✅ Reset form after success
            setFormData({
                appointmentDate: "",
                appointmentTime: "",
                reason: "",
            });

            console.log({
                doctorId,
                clinicId,
                appointmentDate: combinedDateTime,
            });

        } catch (error) {
            console.log("Appointment Error:", error);
            setErrorMsg(error || "Something went wrong");
        }
    };


    return (
        <div className="relative bg-white w-full max-w-xl mx-auto rounded-3xl shadow-2xl p-6 md:p-8">

          {/* ================= SUCCESS BOX (IMPROVED UI) ================= */}
{success && (
  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-3xl z-50 transition-all duration-300">

    <div className="bg-white w-[90%] max-w-md rounded-3xl shadow-2xl p-8 text-center animate-fadeIn">

      {/* Icon */}
      <div className="flex justify-center mb-5">
        <div className="bg-green-100 text-green-600 text-5xl p-4 rounded-full shadow-md">
          ✔
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-3">
        Appointment Requested
      </h2>

      {/* Description */}
      <p className="text-gray-500 text-sm mb-6">
        Your appointment has been successfully submitted.
        You will receive confirmation shortly.
      </p>

      {/* Button */}
      <button
        onClick={onClose}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
      >
        Close
      </button>

    </div>

  </div>
)}

            {/* ================= FORM ================= */}
            <div className={`${success ? "opacity-20 pointer-events-none" : ""}`}>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        📅 Book Appointment
                    </h2>
                </div>

                <div className="space-y-5">

                    {/* Doctor */}
                    <input
                        type="text"
                        value={doctorName || ""}
                        disabled
                        className="w-full bg-gray-100 border rounded-xl px-4 py-3 cursor-not-allowed"
                    />

                    {/* Clinic */}
                    <input
                        type="text"
                        value={clinicName || ""}
                        disabled
                        className="w-full bg-gray-100 border rounded-xl px-4 py-3 cursor-not-allowed"
                    />

                    {/* Date */}
                    <input
                        type="date"
                        name="appointmentDate"
                        value={formData.appointmentDate}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Time */}
                    <input
                        type="time"
                        name="appointmentTime"
                        value={formData.appointmentTime}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Reason */}
                    <textarea
                        rows="3"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        placeholder="Reason for appointment..."
                        className="w-full border rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Error Message */}
                    {errorMsg && (
                        <p className="text-red-500 text-sm">
                            {errorMsg}
                        </p>
                    )}

                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-6">

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-xl font-semibold"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
                    >
                        {loading ? "Booking..." : "Confirm Appointment"}
                    </button>

                </div>

            </div>
        </div>
    );
};

export default AppointmentForm;