import Clinic from "../../model/clinicModel/clinicModel.js";
import Doctor from "../../model/doctorModel/doctorModel.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Assistant from "../../model/assistantModel/assistantModel.js";



const addDoctor = async (req, res) => {
    try {

        const {
            name,
            specializations,
            qualifications,
            doctorFee,
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
        if (!name || !phone || !email || !password || !availability || !clinic || doctorFee === undefined || doctorFee === null || doctorFee === "") {
            return res.status(400).json({
                message: "Required fields missing"
            });
        }

        const normalizedDoctorFee = Number(doctorFee);

        if (!Number.isFinite(normalizedDoctorFee) || normalizedDoctorFee < 0) {
            return res.status(400).json({
                message: "Doctor fee must be a valid positive amount"
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
            doctorFee: normalizedDoctorFee,
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

        doctor.serviceStatus = "deactivated";
        doctor.doctorStatus = "inactive";
        doctor.Status = "inactive";
        await doctor.save();


        await Assistant.updateMany(
            { doctor: doctor._id },
            { $set: { status: "inactive" } }
        );

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


const undoDoctorDeletion = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findById(id);

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }
        doctor.serviceStatus = "activated";
        doctor.doctorStatus = "active";
        doctor.Status = "active";
        await doctor.save();
        await Assistant.updateMany(
            { doctor: doctor._id },
            { $set: { status: "active" } }
        );
        return res.status(200).json({
            message: "Doctor restoration successful"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

const updateDoctorStatus = async (req, res) => {


    try {

        const doctorId = req.params.id;
        const newStatus = req.body.status;

        const checkDoctor = await Doctor.findById(doctorId);
        if (!checkDoctor) {
            return res.status(404).json({
                message: "Doctor not found"
            })
        }


        if (!["active", "inactive"].includes(String(newStatus || "").toLowerCase())) {
            return res.status(400).json({
                message: "Invalid doctor status"
            })
        }

        checkDoctor.doctorStatus = String(newStatus).toLowerCase();
        checkDoctor.Status = String(newStatus).toLowerCase();
        await checkDoctor.save();
        await Assistant.updateMany(
            { doctor: checkDoctor._id },
            { $set: { status: String(newStatus).toLowerCase() } }
        );
        return res.status(200).json({
            message: "Doctor status updated successfully",
            doctor: checkDoctor
        })

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }

}



const updateDoctorDetails = async (req, res) => {
    try {

        const userId = req.params.id;
        const updateData = req.body;


        const doctor = await Doctor.findById(userId);

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }


        // Update allowed fields
        const allowedFields = ["name", "specializations", "qualifications", "doctorFee", "clinic", "phone", "email", "experience", "availability"];
        const profilePicture = req.file ? req.file.path : null;
        allowedFields.forEach((field) => {
            if (updateData[field] !== undefined) {
                doctor[field] = updateData[field];
            }
        });

        if (profilePicture) {
            doctor.profilePicture = profilePicture;
        }
        await doctor.save();

        return res.status(200).json({
            message: "Doctor details updated successfully",
            doctor
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
    deleteDoctor,
    undoDoctorDeletion,
    updateDoctorStatus,
    updateDoctorDetails
};
export default doctorController;
