import Pharmacy from "../../model/pharmacyModel/pharmacyModel.js";
import bcrypt from "bcrypt";

const addPharmacy = async (req, res) => {
  try {
    const pharmacyData = req.body;


    if (typeof pharmacyData.workingDays === "string") {
      pharmacyData.workingDays = JSON.parse(pharmacyData.workingDays);
    }

    if (typeof pharmacyData.services === "string") {
      pharmacyData.services = JSON.parse(pharmacyData.services);
    }

    if (typeof pharmacyData.address === "string") {
      pharmacyData.address = JSON.parse(pharmacyData.address);
    }

    pharmacyData.name = pharmacyData.pharmacyName;
    pharmacyData.logo = req.file?.path || pharmacyData.logo || "";

    if (
      !pharmacyData.name ||
      !pharmacyData.licenseNo ||
      !pharmacyData.phone ||
      !pharmacyData.logo
    ) {
      return res.status(400).json({
        message: "Pharmacy Name, License No, Phone, and Logo are required",
      });
    }

    if (pharmacyData.email && !/^\S+@\S+\.\S+$/.test(pharmacyData.email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (pharmacyData.phone && !/^\d{10,15}$/.test(pharmacyData.phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    if (pharmacyData.whatsapp && !/^\d{10,15}$/.test(pharmacyData.whatsapp)) {
      return res.status(400).json({ message: "Invalid WhatsApp number format" });
    }

    const pharmacyExists = await Pharmacy.findOne({
      $or: [
        { name: pharmacyData.name },
        { email: pharmacyData.email },
        { licenseNo: pharmacyData.licenseNo },
      ],
    });

    if (pharmacyExists) {
      let message = "Pharmacy with this ";
      if (pharmacyExists.name === pharmacyData.name) message += "name ";
      else if (pharmacyExists.email === pharmacyData.email) message += "email ";
      else if (pharmacyExists.licenseNo === pharmacyData.licenseNo) {
        message += "license number ";
      }
      message += "already exists";

      return res.status(400).json({ message });
    }

    const salt = await bcrypt.genSalt(10);
    const rawPassword = pharmacyData.password || "pharmacy123";
    pharmacyData.password = await bcrypt.hash(rawPassword, salt);

    const newPharmacy = new Pharmacy(pharmacyData);
    const savedPharmacy = await newPharmacy.save();
    res.status(201).json({
      ...savedPharmacy._doc,
      message: "Pharmacy added successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding pharmacy", error });
  }
};

const getPharmacy = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find();
    res.status(200).json({ data: pharmacies });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pharmacies", error });
  }
};





const deletePharmacy = async (req, res) => {
    try {
        const { id } = req.params;

        const pharmacy = await Pharmacy.findById(id);

        if (!pharmacy) {
            return res.status(404).json({
                message: "Pharmacy not found"
            });
        }

        pharmacy.status = "inactive";
        pharmacy.serviceStatus = "deactivated";
        await pharmacy.save();

        return res.status(200).json({
            message: "Pharmacy deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const undoPharmacyDeletion = async (req, res) => {
    try {
        const { id } = req.params;

        const pharmacy = await Pharmacy.findById(id);

        if (!pharmacy) {
            return res.status(404).json({
                message: "Pharmacy not found"
            });
        }

        pharmacy.status = "active";
        pharmacy.serviceStatus = "activated";
        await pharmacy.save();

        return res.status(200).json({
            message: "Pharmacy restoration successful"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const updatePharmacyStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["active", "inactive"].includes(String(status || "").toLowerCase())) {
            return res.status(400).json({
                message: "Invalid status value. Must be 'active' or 'inactive'."
            });
        }

        const pharmacy = await Pharmacy.findById(id);

        if (!pharmacy) {
            return res.status(404).json({
                message: "Pharmacy not found"
            });
        }

        pharmacy.status = String(status).toLowerCase();
        await pharmacy.save();

        return res.status(200).json({
            message: "Pharmacy status updated successfully",
            pharmacy
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const updatePharmacyDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const pharmacy = await Pharmacy.findById(id);

        if (!pharmacy) {
            return res.status(404).json({
                message: "Pharmacy not found"
            });
        }

        if (typeof updateData.workingDays === "string") {
            updateData.workingDays = JSON.parse(updateData.workingDays);
        }

        if (typeof updateData.services === "string") {
            updateData.services = JSON.parse(updateData.services);
        }

        if (typeof updateData.address === "string") {
            updateData.address = JSON.parse(updateData.address);
        }

        const allowedFields = [
            "pharmacyName",
            "licenseNo",
            "taxNo",
            "ownerName",
            "managerName",
            "phone",
            "whatsapp",
            "email",
            "emergencyContact",
            "openingTime",
            "closingTime",
            "minOrderAmount",
            "deliveryFee",
            "notes",
            "status"
        ];

        allowedFields.forEach((field) => {
            if (updateData[field] !== undefined) {
                pharmacy[field] = updateData[field];
            }
        });

        if (updateData.address !== undefined) {
            pharmacy.address = updateData.address;
        }

        if (updateData.workingDays !== undefined) {
            pharmacy.workingDays = updateData.workingDays;
        }

        if (updateData.services !== undefined) {
            pharmacy.services = updateData.services;
        }

        if (req.file?.path) {
            pharmacy.logo = req.file.path;
        }

        await pharmacy.save();

        return res.status(200).json({
            message: "Pharmacy details updated successfully",
            pharmacy
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const pharmacyController = {
  addPharmacy,
  getPharmacy,
  deletePharmacy,
  undoPharmacyDeletion,
  updatePharmacyStatus,
  updatePharmacyDetails,
};

export default pharmacyController;
