import Doctor from "../../model/doctorModel/doctorModel.js";
import Assistant from "../../model/assistantModel/assistantModel.js";
import bcrypt from "bcrypt";

const addAssistant = async (req, res) => {
  try {
    const doctorId = req.user;
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // can create only 1 assistant per doctor
    const existingAssistantForDoctor = await Assistant.findOne({
      doctor: doctorId,
    });

    if (existingAssistantForDoctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor already has an assistant",
      });
    }

    // ✅ Check: Email already used?
    const existingAssistant = await Assistant.findOne({ email });

    if (existingAssistant) {
      return res.status(400).json({
        success: false,
        message: "Assistant with this email already exists",
      });
    }

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });

    }

 



    const newAssistant = new Assistant({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      clinic: doctor.clinic,
      doctor: doctorId,
    });

    await newAssistant.save();

    return res.status(201).json({
      success: true,
      assistant: newAssistant,
      message: "Assistant added successfully",
    });

  } catch (error) {
    console.log("ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const getAssistants = async (req, res) => {
    try {
        const role = req.role;
        const query = role === "admin" ? {} : { doctor: req.user };
        const assistants = await Assistant.find(query)
          .populate("doctor", "name email")
          .populate("clinic", "name");
        return res.status(200).json({
            success: true,
            assistants
        });
    }   catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const deleteAssistant = async (req, res) => {
    try {
        const doctorId = req.user;
        const assistantId = req.params.id;
        const assistant = await Assistant.findOne({ _id: assistantId, doctor: doctorId });
        if (!assistant) {
            return res.status(404).json({
                success: false,
                message: "Assistant not found"
            });
        }
        await Assistant.deleteOne({ _id: assistantId });
        return res.status(200).json({
            success: true,
            message: "Assistant deleted successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}




const assistantController = {
    addAssistant,
    getAssistants,
    deleteAssistant
}

export default assistantController;
