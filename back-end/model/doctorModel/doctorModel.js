import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    specializations: {
        type: [String],
        required: true,
        enum: [
            "Cardiologist",
            "Dermatologist",
            "Neurologist",
            "Orthopedic",
            "Pediatrician",
            "Gynecologist",
            "Psychiatrist",
            "General Physician",
            "ENT Specialist",
            "Oncologist"
        ]
    },

    qualifications: {
        type: [String],
        required: true,
        enum: [
            "MBBS",
            "MD",
            "MS",
            "BDS",
            "MDS",
            "DM",
            "MCh",
            "DNB",
            "PhD",
            "BAMS",
            "BHMS"
        ]
    },

    clinic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic",
        required: false
    },

    phone: {
        type: String,
        default: "N/A"
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password : {
        type: String,
        required: true,
        minlength: 6,
    },

    role: {
        type: String,
        enum: ["admin", "doctor" , "user"],
        default: "doctor"
    },

    experience: {
        type: Number,
        default: 0,
        min: 0
    },

    availability: {
        type: String,
        default: "9 AM - 5 PM" 
    },

    profilePicture: {
        type: String
    }

}, { timestamps: true });

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;