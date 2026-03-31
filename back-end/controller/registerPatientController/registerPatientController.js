import Patient from "../../model/registerPatientModel/registerPatientModel.js";
import bcrypt from "bcrypt";

const RegisterPatient = async (req, res) => {
    try {
        const { name, email, password, contact } = req.body;

        if (!name || !email || !password || !contact) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }


        // Check if the email is already registered
        const existingPatient = await
            Patient.findOne({ email });
        if (existingPatient) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered",
            });
        }

        if (isNaN(contact) || contact.length < 10 || contact.length > 11) {
            return res.status(400).json({
                success: false,
                message: "Contact number must be a valid number with 10 to 11 digits",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
            });
        }

        // HASHING PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new patient
        const newPatient = new Patient({
            name,
            email,
            password: hashedPassword,
            contact,
        });



        await newPatient.save();
        res.status(201).json({
            success: true,
            message: "Patient registered successfully",
        });
    }
    catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

const registerPatientController = {
    RegisterPatient,
};

export default registerPatientController;