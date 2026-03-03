import mongoose from "mongoose";
import Clinic from "../../model/clinicModel/clinicModel.js";

/* ================= ADD CLINIC ================= */

const addClinic = async (req, res) => {
  try {
    const {
      name,
      doctors,
      capacity,
      location,
      phone,
      openingTime,
      closingTime,
      description,
      status = "Active", // ✅ Default value
    } = req.body;

    // ✅ Required validation
    if (
      !name ||
      !doctors ||
      !capacity ||
      !location ||
      !phone ||
      !openingTime ||
      !closingTime ||
      !description
    ) {
      return res.status(400).json({
        isSuccess: false,
        message: "Please fill all required fields",
      });
    }

    const newClinic = await Clinic.create({
      name,
      doctors,
      capacity,
      location,
      phone,
      openingTime,
      closingTime,
      description,
      status,
    });

    return res.status(201).json({
      isSuccess: true,
      message: "Clinic added successfully",
      clinic: newClinic,
    });

  } catch (error) {
    console.error("Add Clinic Error:", error);

    return res.status(500).json({
      isSuccess: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/* ================= GET CLINICS ================= */

const getClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find().sort({ createdAt: -1 });

    return res.status(200).json({
      isSuccess: true,
      clinics,
    });

  } catch (error) {
    console.error("Get Clinics Error:", error);

    return res.status(500).json({
      isSuccess: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/* ================= DELETE CLINIC ================= */

const deleteClinic = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ID format (BEST PRACTICE)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid Clinic ID",
      });
    }

    const deletedClinic = await Clinic.findByIdAndDelete(id);

    if (!deletedClinic) {
      return res.status(404).json({
        isSuccess: false,
        message: "Clinic not found",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      message: "Clinic deleted successfully",
      deletedId: deletedClinic._id, // ✅ Better for frontend
    });

  } catch (error) {
    console.error("Delete Clinic Error:", error);

    return res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


/* ================= UPDATE CLINIC STATUS ================= */

const updateClinicStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ✅ Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid Clinic ID",
      });
    }

    // ✅ Update Data
    const updatedClinic = await Clinic.findByIdAndUpdate(
      id,
      { status }, // ✅ update data
      {
        returnDocument: "after", // 🔥 NEW WAY (Fix warning)
        runValidators: true,     // ✅ Best Practice
      }
    );

    if (!updatedClinic) {
      return res.status(404).json({
        isSuccess: false,
        message: "Clinic not found",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      message: "Clinic status updated successfully",
      clinic: updatedClinic,
    });

  } catch (error) {
    console.error("Update Clinic Status Error:", error);

    return res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


/* ================= UPDATE CLINIC ================= */

const updateClinic = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Check ID Valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid Clinic ID",
      });
    }

    const updateData = req.body;

    // ✅ Update Clinic
    const updatedClinic = await Clinic.findByIdAndUpdate(
      id,
      updateData,
      {
        returnDocument: "after", // ✅ NEW WAY (No Warning)
        runValidators: true,     // ✅ Validate Data
      }
    );

    if (!updatedClinic) {
      return res.status(404).json({
        isSuccess: false,
        message: "Clinic not found",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      message: "Clinic updated successfully",
      clinic: updatedClinic,
    });

  } catch (error) {
    console.error("Update Clinic Error:", error);

    return res.status(500).json({
      isSuccess: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/* ================= EXPORT ================= */

const clinicController = {
  addClinic,
  getClinics,
  deleteClinic,
  updateClinicStatus,
  updateClinic,
};

export default clinicController;