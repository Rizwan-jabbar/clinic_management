import Doctor from "../../model/doctorModel/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const doctor = await Doctor.findOne({ email });

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, doctor.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            { id: doctor._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            doctor: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                role: doctor.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


/**
 * 👨‍⚕️ Get Doctor Profile
 */
const userLoginProfile = async (req, res) => {
    try {

        const doctor = await Doctor.findById(req.user);

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        res.status(200).json({
            message: "Profile fetched successfully",
            doctor
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching profile",
            error: error.message
        });
    }
};

const doctorController = {
    loginUser,
    userLoginProfile
};

export default doctorController;