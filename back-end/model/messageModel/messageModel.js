import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",  // ✅ sirf doctor collection
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",  // ✅ same collection
      required: true,
    },

    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);