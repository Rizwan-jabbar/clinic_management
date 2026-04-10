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


    doctorFee: {
        type: Number,
        required: true,
        min: 0
    },

    paymentsHistory: [
        {
            amount: {
                type: Number,
                required: true,
                min: 0
            },
            date: {
                type: Date,
                default: Date.now
            },
            method: {
                type: String,
                enum: ["cash", "card", "online"],
                required: true
            }
        }
    ],

    paymentStatus: {
        type: String,
        enum: ["paid", "pending", "unpaid", "partial"],
        default: "unpaid"
    },


    amountToPay: {
        type: Number,
         default: 200
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

    doctorStatus: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
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

    Status : {
            type : String,
            default : "inactive"
    },

    serviceStatus : {
        type : String,
        default : "activated"
    },

    profilePicture: {
        type: String
    }

}, { timestamps: true });

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
