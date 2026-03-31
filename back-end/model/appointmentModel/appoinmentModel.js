import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: false,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: false,
    },

    assistant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assistant",
      required: false,
    },

    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    reason: {
      type: String,
    },

    // ✅ Important Field
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Completed", "Cancelled"],
      default: "Pending",
    },

    // Optional (Future Use)
    notes: String,
    paymentStatus: { 
      type: String,
      enum: ["Unpaid", "Paid", "Refunded"],
      default: "Unpaid",
    },
  },
  { timestamps: true }
);

const Appointment  = mongoose.model("Appointment", appointmentSchema);

export default Appointment;