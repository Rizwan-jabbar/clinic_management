import Clinic from "../../model/clinicModel/clinicModel.js";
import Doctor from "../../model/doctorModel/doctorModel.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";



const addDoctor = async (req, res) => {
    try {

        const {
            name,
            specializations,
            qualifications,
            clinic,
            phone,
            email,
            password,
            experience,
            availability
        } = req.body;

        // ✅ Image
        const profilePicture = req.file ? req.file.path : null;

        // 🔴 Validation
        if (!name || !phone || !email || !password || !availability || !clinic) {
            return res.status(400).json({
                message: "Required fields missing"
            });
        }

        // ✅ Validate Clinic ID
        if (!mongoose.Types.ObjectId.isValid(clinic)) {
            return res.status(400).json({
                message: "Invalid clinic ID"
            });
        }

        // ✅ Check if clinic exists
        const clinicExists = await Clinic.findById(clinic);

        if (!clinicExists) {
            return res.status(404).json({
                message: "Clinic not found"
            });
        }

        // ✅ Check duplicate email
        const existingDoctor = await Doctor.findOne({ email });

        if (existingDoctor) {
            return res.status(409).json({
                message: "Doctor with this email already exists"
            });
        }


        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Before hash:", password);
        console.log("After hash:", hashedPassword);
        // ✅ Create Doctor
        const doctor = new Doctor({
            name,
            specializations,
            qualifications,
            clinic,
            phone,
            email,
            password: hashedPassword,
            experience,
            availability,
            profilePicture
        });

        await doctor.save();

        // ✅ Increase Clinic Doctor Count (SAFE + ATOMIC)
        await Clinic.findByIdAndUpdate(
            clinic,
            { $inc: { doctors: 1 } },
            { new: true }
        );



        return res.status(201).json({
            message: "Doctor added successfully",
            doctor,
        });

    } catch (error) {

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Validation Error",
                errors: error.errors
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Duplicate field"
            });
        }

        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};



const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().populate("clinic", "name");
        return res.status(200).json({
            message: "Doctors retrieved successfully",
            doctors
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};



const deleteDoctor = async (req, res) => {
    try {

        const { id } = req.params;

        // ✅ Find doctor first (so we get clinic ID)
        const doctor = await Doctor.findById(id);

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        const clinicId = doctor.clinic;

        // ✅ Delete Doctor
        await Doctor.findByIdAndDelete(id);

        // ✅ Decrease clinic doctor count safely
        if (clinicId) {
            await Clinic.findOneAndUpdate(
                {
                    _id: clinicId,
                    doctors: { $gt: 0 }
                },
                {
                    $inc: { doctors: -1 }
                },
                { new: true }
            );
        }

        return res.status(200).json({
            message: "Doctor deleted successfully"
        });

    } catch (error) {

        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
};

const doctorController = {
    addDoctor,
    getDoctors,
    deleteDoctor
};
export default doctorController;