import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Doctor from "./model/doctorModel/doctorModel.js";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ClinicManagement";

mongoose.connect(MONGO_URI);

async function createUser() {
  const hashedPassword = await bcrypt.hash("user123", 10);

  await Doctor.create({
  name: "user",
  email: "user1@gmail.com",
  password: hashedPassword,
  role: "user",
  availability: "Full",
  experience: 0,
  phone: "0000000000",
  clinic: null
});

  console.log("User Created ✅");
  process.exit();
}

createUser();