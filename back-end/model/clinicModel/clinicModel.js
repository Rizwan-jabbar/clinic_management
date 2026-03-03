import mongoose from 'mongoose';


const ClinicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },

    doctors: {
        type: Number,
        default : 0
    },

    location: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,

    },
    openingTime: {
        type: String,
        required: true,
    },
    closingTime: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

const Clinic = mongoose.model('Clinic', ClinicSchema)

export default Clinic;