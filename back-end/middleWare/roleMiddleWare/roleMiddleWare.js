import Doctor from "../../model/doctorModel/doctorModel.js";
import Assistant from "../../model/assistantModel/assistantModel.js";
import Patient from "../../model/registerPatientModel/registerPatientModel.js";
import Pharmacy from "../../model/pharmacyModel/pharmacyModel.js";

const adminUser = {
  id: "static-admin",
  role: "admin",
};

const roleMiddleware = (...allowedRoles) => {
  return async (req, res, next) => {
    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const normalizedAllowedRoles = allowedRoles.map((role) => role.toLowerCase());

      if (
        req.user === adminUser.id &&
        req.role?.toLowerCase() === adminUser.role
      ) {
        if (!normalizedAllowedRoles.includes(adminUser.role)) {
          return res.status(403).json({
            success: false,
            message: "You do not have permission to perform this action.",
          });
        }

        return next();
      }

      // 🔍 Check in Doctor collection
      let user = await Doctor.findById(req.user);

      // 🔍 If not doctor then check Assistant
      if (!user) {
        user = await Assistant.findById(req.user);
      }

      if(!user) {
        user = await Patient.findById(req.user);
      }

      if (!user) {
        user = await Pharmacy.findById(req.user);
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const userRole = user.role.toLowerCase();

      if (!normalizedAllowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action.",
        });
      }

      next();

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export default roleMiddleware;
