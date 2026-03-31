import mongoose from "mongoose"

const PatientNotification = mongoose.Schema({
    doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },


     clinicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic",
        required: true,
      },

    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    assistantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assistant",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean, 
        default: false, 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const NotificationForPatient = mongoose.model("NotificationForPatient", PatientNotification)

export default NotificationForPatient