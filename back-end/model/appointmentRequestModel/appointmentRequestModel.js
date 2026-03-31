import mongoose from "mongoose";

const appointmentRequestSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
assistant: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Assistant",
},
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const AppointmentRequest = mongoose.model(
  "AppointmentRequest",
  appointmentRequestSchema
);

export default AppointmentRequest;