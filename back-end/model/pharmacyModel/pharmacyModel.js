import mongoose from "mongoose";

const pharmacySchema = new mongoose.Schema(
    {
        logo : {
            type: String,
            required: true,
        },
        pharmacyName: {
            type: String,
            required: true,
            trim: true,
        },

        licenseNo: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        taxNo: {
            type: String,
            trim: true,
        },

        ownerName: {
            type: String,
            trim: true,
        },

        managerName: {
            type: String,
            trim: true,
        },

        // 📞 Contact
        phone: {
            type: String,
            required: true,
        },

        whatsapp: {
            type: String,
        },

        email: {
            type: String,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required : true,
        },

        role : {
            type: String,
            default: "pharmacy",
        },

        emergencyContact: {
            type: String,
        },

        // 📍 Address
        address: {
            addressLine1: {
                type: String,
                required: true,
            },
            addressLine2: {
                type: String,
            },
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
            },
            country: {
                type: String,
                required: true,
                default: "Pakistan",
            },
            zip: {
                type: String,
            },
        },

        // ⏰ Timings
        openingTime: {
            type: String,
            default: "09:00",
        },

        closingTime: {
            type: String,
            default: "21:00",
        },

        workingDays: {
            mon: { type: Boolean, default: true },
            tue: { type: Boolean, default: true },
            wed: { type: Boolean, default: true },
            thu: { type: Boolean, default: true },
            fri: { type: Boolean, default: true },
            sat: { type: Boolean, default: true },
            sun: { type: Boolean, default: false },
        },

        // 🛠 Services
        services: {
            consultation: { type: Boolean, default: false },
            homeDelivery: { type: Boolean, default: true },
            vaccination: { type: Boolean, default: false },
            labCollection: { type: Boolean, default: false },
            onlineOrders: { type: Boolean, default: true },
        },

        minOrderAmount: {
            type: Number,
            default: 0,
        },

        deliveryFee: {
            type: Number,
            default: 0,
        },

        // 📌 Status
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },

        notes: {
            type: String,
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        serviceStatus: {
            type: String,
            default: "activated",
        },
    },
    {
        timestamps: true, // createdAt, updatedAt
    }
);

const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);

export default Pharmacy;
