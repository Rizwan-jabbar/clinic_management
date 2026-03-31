import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
    items: [
    {
      medicineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
        required: true,
      },
        quantity: {
        type: Number,
        required: true,
        min: 1,
        },
    },
  ],
});
const Cart = mongoose.model("Cart", cartSchema);
export default Cart;