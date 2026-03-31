import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: {
    type: String,   
    required: true,
  },
  email: {

    type: String,
    required: true,
    unique: true,   
    },
    password: {
    type: String,
    required: true,
  },
  contact : {
    type: Number,
      required: true,  
      minlength: 10,
      maxlength: 11,
  },
  role: {
    type: String,
    default: "user",
  },

});
const Patient = mongoose.model("Patient", patientSchema);

export default Patient;