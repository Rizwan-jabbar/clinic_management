import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dosage: {
    type: String, // 500mg
    required: true,
  },
  frequency: {
    type: String, // 1+1+1
    required: true,
  },
  duration: {
    type: String, // 5 days
    required: true,
  },
  instructions: {
    type: String, // After meal
  },
});

const testSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true,
  },
  result: {
    type: String,
  },
  normalRange: {
    type: String,
  },
  status: {
    type: String, // Normal / Abnormal / Pending
    enum: ["Normal", "Abnormal", "Pending"],
    default: "Pending",
  },
});

const visitSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
  },

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

  visitDate: {
    type: Date,
    default: Date.now,
  },

  symptoms: {
    type: String,
  },

  diagnosis: {
    type: String,
  },

  medicines: [medicineSchema],

  tests: [testSchema],

  advice: {
    type: String,
  },

  followUpDate: {
    type: Date,
  },

  notes: {
    type: String,
  },
});

const medicalHistorySchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient", // ya Patient model
      required: true,
      unique: true,
    },

    bloodGroup: {
      type: String,
    },

    allergies: [
      {
        type: String,
      },
    ],

    chronicDiseases: [
      {
        type: String, // Diabetes, Hypertension
      },
    ],

    pastSurgeries: [
      {
        surgeryName: String,
        year: Number,
        notes: String,
      },
    ],

    familyHistory: {
      type: String,
    },

    socialHistory: {
      type: String, // Smoking, Alcohol
    },

    visits: [visitSchema], // 🔥 All appointments history
  },
  { timestamps: true }
);

export default mongoose.model("MedicalHistory", medicalHistorySchema);