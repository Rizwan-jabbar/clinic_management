import mongoose from "mongoose";


const medicineSchema = new mongoose.Schema({
    image : {
        type: String,
        trim: true
    },
  name: {
    type: String,
    required: true,
    trim: true
  },
  genericName: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  manufacturer: {
    type: String,
    trim: true
  },

  category: {
    type: String,
    enum: ["Tablet", "Capsule", "Syrup", "Injection", "Other"],
    required: true
  },
  dosageForm: {
    type: String,
    trim: true
  },
  strength: {
    type: String,
    trim: true
  },
  purchasePrice: {
    type: Number,
    required: true,
    min: 0
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },

  expiryDate: {
    type: Date,
    required: true
  },
  batchNumber: {
    type: String,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  addedBy : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pharmacy",
    required: true
  },

  pharmacyName: {
    type: String,
    trim: true
  },

  pharmacyAddress: {
    type: String,
    trim: true
  },

}, {
  timestamps: true   // createdAt & updatedAt auto add karega
});

// Indexing (optional but useful)
medicineSchema.index({ name: 1 });
medicineSchema.index({ brand: 1 });

const Medicine = mongoose.model("Medicine", medicineSchema);

export default Medicine;
