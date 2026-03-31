import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    patientId: {    
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },
    items: [
      {
        medicineId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Medicine",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
      }
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    customerInfo: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
      },
    },
    deliveryAddress: {
      city: {
        type: String,
        required: true,
        trim: true,
      },
      addressLine1: {
        type: String,
        required: true,
        trim: true,
      },
      addressLine2: {
        type: String,
        trim: true,
        default: "",
      },
      postalCode: {
        type: String,
        required: true,
        trim: true,
      },
      notes: {
        type: String,
        trim: true,
        default: "",
      },
    },
    deliveryType: {
      type: String,
      enum: ["home", "pickup"],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
      required: true,
    },
    orderStatus: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending"
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
