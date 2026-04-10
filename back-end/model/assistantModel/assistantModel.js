import mongoose from "mongoose";

const assistantSchema = new mongoose.Schema({
    name: {
        type: String,   
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,   
        required: true
    },
    role: { 
        type: String,
        enum: ['assistant'],
        default: 'assistant'
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    clinic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinic',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
}, { timestamps: true });


const Assistant = mongoose.model("Assistant", assistantSchema);

export default Assistant;