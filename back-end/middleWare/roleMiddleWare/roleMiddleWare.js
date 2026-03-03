import Doctor from "../../model/doctorModel/doctorModel.js";
const roleMiddleware = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      // 👇 ID se user fetch karo
      const user = await Doctor.findById(req.user);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      // 👇 role check karo
      const userRole = user.role.toLowerCase();

      if (!allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "Access denied: insufficient permissions",
        });
      }

      next();

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };
};

export default roleMiddleware;