import Doctor from "../../model/doctorModel/doctorModel.js";
import Assistant from "../../model/assistantModel/assistantModel.js";
import Patient from "../../model/registerPatientModel/registerPatientModel.js";
import Pharmacy from "../../model/pharmacyModel/pharmacyModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminUser = {
    id: "static-admin",
    name: "Admin",
    email: "admin@clinic.com",
    password: "admin123",
    role: "admin"
};

/**
 * Login User (Admin | Doctor | Assistant | Patient | Pharmacy)
 */
const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        email = email?.trim();
        password = password?.trim();

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        if (email === adminUser.email && password === adminUser.password) {
            const token = jwt.sign(
                { id: adminUser.id, email: adminUser.email, role: adminUser.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.status(200).json({
                message: "Admin login successful",
                token,
                user: {
                    id: adminUser.id,
                    name: adminUser.name,
                    email: adminUser.email,
                    role: adminUser.role
                }
            });
        }

        let user = await Doctor.findOne({ email });
        let role = "doctor";

        if (!user) {
            user = await Assistant.findOne({ email });
            role = "assistant";
        }

        if (!user) {
            user = await Patient.findOne({ email });
            role = "patient";
        }

        if (!user) {
            user = await Pharmacy.findOne({ email });
            role = "pharmacy";
        }

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            { id: user._id, role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name || user.pharmacyName,
                email: user.email,
                role
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

/**
 * Get Logged In Profile
 */
const userLoginProfile = async (req, res) => {
    try {
        if (req.role === adminUser.role && req.user === adminUser.id) {
            return res.status(200).json({
                message: "Profile fetched successfully",
                user: {
                    id: adminUser.id,
                    name: adminUser.name,
                    email: adminUser.email,
                    role: adminUser.role
                }
            });
        }

        let user =
            await Doctor.findById(req.user) ||
            await Assistant.findById(req.user) ||
            await Patient.findById(req.user) ||
            await Pharmacy.findById(req.user);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile fetched successfully",
            user
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching profile",
            error: error.message
        });
    }
};

export default {
    loginUser,
    userLoginProfile
};
