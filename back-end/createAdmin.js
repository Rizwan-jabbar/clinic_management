import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Doctor from "./model/doctorModel/doctorModel.js";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ClinicManagement";

mongoose.connect(MONGO_URI);

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await Doctor.create({
  name: "Super Admin",
  email: "admin@gmail.com",
  password: hashedPassword,
  role: "admin",
  availability: "Full",
  experience: 0,
  phone: "0000000000",
  clinic: null
});

  console.log("Admin Created ✅");
  process.exit();
}

createAdmin();