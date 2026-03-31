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

const pharmacyController = {
  addPharmacy,
  getPharmacy,
};

export default pharmacyController;
