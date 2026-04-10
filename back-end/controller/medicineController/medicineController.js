import Medicine from "../../model/medicineModel/medicineModel.js";
import Pharmacy from "../../model/pharmacyModel/pharmacyModel.js";

export const addMedicine = async (req, res) => {
  try {

    const pharmacyId = req.user;
    const {
      name,
      genericName,
      brand,
      manufacturer,
      category,
      dosageForm,
      strength,
      purchasePrice,
      sellingPrice,
      stock,
      expiryDate,
      batchNumber,
      description,
    } = req.body;

    if(!pharmacyId){
      return res.status(400).json({ message: "Pharmacy ID is required" });
    }

    const existingMedicine = await Medicine.findOne({ name, addedBy: pharmacyId });
    if (existingMedicine) {
      return res.status(400).json({ message: "Medicine with the same name already exists in this pharmacy" });
    }

    const pharmacyUser = await Pharmacy.findById(pharmacyId);
    if (!pharmacyUser) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }


    if (!name || !category || purchasePrice === undefined || sellingPrice === undefined || !expiryDate) {
      return res.status(400).json({ message: "Name, category, purchase price, selling price and expiry date are required" });
    }

    if (Number(purchasePrice) < 0 || Number(purchasePrice) > 100000) {
      return res.status(400).json({ message: "Purchase price cannot be negative or exceed 100000" });
    }

    if (Number(sellingPrice) < 0 || Number(sellingPrice) > 100000) {
      return res.status(400).json({ message: "Selling price cannot be negative or exceed 100000" });
    }

    if (Number(sellingPrice) < Number(purchasePrice)) {
      return res.status(400).json({ message: "Selling price cannot be less than purchase price" });
    }

    if (stock < 0 || stock > 10000) {
      return res.status(400).json({ message: "Stock cannot be negative or exceed 10000" });
    }

    if (category && !["Tablet", "Capsule", "Syrup", "Injection", "Other"].includes(category)) {
      return res.status(400).json({ message: "Invalid category. Must be one of Tablet, Capsule, Syrup, Injection, Other" });
    }

    // ✅ Image handling
    let imagePath = null;
    if (req.file) {
      imagePath = req.file.path.replace(/\\/g, "/"); // Windows compatibility
    }


    console.log('Pharmacy User:', pharmacyUser);
    const medicine = new Medicine({
      addedBy: pharmacyUser._id,
      pharmacyName: pharmacyUser.pharmacyName,
      pharmacyAddress: pharmacyUser.address.addressLine1, // save pharmacy address in medicine document
      name,
      genericName,
      brand,
      manufacturer,
      category,
      dosageForm,
      strength,
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      stock: Number(stock || 0),
      expiryDate,
      batchNumber,
      description,
      image: imagePath, // save image path in DB
    });

    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMedicines = async (req, res) => {
  try {
    const pharmacyId = req.user;

    const medicines = await Medicine.find({ addedBy: pharmacyId });
    res.status(200).json(medicines);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// here to get all medicine for admin and user

const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().populate(
      "addedBy",
      "pharmacyName address status"
    );

    const activePharmacyMedicines = medicines.filter(
      (medicine) => medicine?.addedBy?.status === "active"
    );

    res.status(200).json(activePharmacyMedicines);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await Medicine.findByIdAndDelete(id);

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    res.status(200).json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const medicineController = {
  addMedicine,
  getMedicines,
  getAllMedicines,
  deleteMedicine,
};

export default medicineController;
