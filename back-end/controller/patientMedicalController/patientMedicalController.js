import Appointment from "../../model/appointmentModel/appoinmentModel.js";
import patientMedicalModel from "../../model/patientMedicalModel/patientMedicalModel.js";

/* ===========================================
   ✅ CREATE / UPDATE MEDICAL HISTORY
=========================================== */

export const addVisitToMedicalHistory = async (req, res) => {
  try {
    let {
      patientId,
      appointmentId,
      doctorId,
      clinicId,
      symptoms,
      diagnosis,
      medicines,
      tests,
      advice,
      followUpDate,
      notes,

      // ✅ NEW FIELDS
      bloodGroup,
      allergies,
      chronicDiseases,
      pastSurgeries,
    } = req.body;

    if (!patientId || !doctorId || !clinicId) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    /* ✅ SAFE ARRAY HANDLING */
    if (!Array.isArray(medicines)) medicines = [];
    if (!Array.isArray(tests)) tests = [];
    if (!Array.isArray(allergies)) allergies = [];
    if (!Array.isArray(chronicDiseases)) chronicDiseases = [];
    if (!Array.isArray(pastSurgeries)) pastSurgeries = [];

    const newVisit = {
      appointmentId,
      doctorId,
      clinicId,
      visitDate: new Date(),
      symptoms,
      diagnosis,
      medicines,
      tests,
      advice,
      followUpDate,
      notes,
    };

    /* =====================================
       🔎 FIND EXISTING HISTORY
    ===================================== */

    let medicalHistory = await patientMedicalModel.findOne({ patientId });

    /* =====================================
       🆕 CREATE IF NOT EXISTS
    ===================================== */

    if (!medicalHistory) {
      medicalHistory = await patientMedicalModel.create({
        patientId,
        bloodGroup,
        allergies,
        chronicDiseases,
        pastSurgeries,
        visits: [newVisit],
      });
    } else {

  if (!medicalHistory.bloodGroup && bloodGroup) {
    medicalHistory.bloodGroup = bloodGroup;
  }

  /* ✅ ADD ALLERGIES */
  if (allergies.length > 0) {
    medicalHistory.allergies = [
      ...new Set([
        ...(medicalHistory.allergies || []),
        ...allergies,
      ]),
    ];
  }

  /* ✅ ADD CHRONIC DISEASES */
  if (chronicDiseases.length > 0) {
    medicalHistory.chronicDiseases = [
      ...new Set([
        ...(medicalHistory.chronicDiseases || []),
        ...chronicDiseases,
      ]),
    ];
  }

  /* ✅ ADD SURGERIES */
  if (pastSurgeries.length > 0) {
    medicalHistory.pastSurgeries = [
      ...new Set([
        ...(medicalHistory.pastSurgeries || []),
        ...pastSurgeries,
      ]),
    ];
  }

  /* ✅ ADD NEW VISIT */
  medicalHistory.visits.push(newVisit);

  await medicalHistory.save();
}

    /* =====================================
       🔥 RETURN UPDATED DOCUMENT
    ===================================== */

    const updatedHistory = await patientMedicalModel
      .findOne({ patientId })
      .populate("visits.doctorId")
      .populate("visits.appointmentId");

    return res.status(200).json({
      success: true,
      message: "Medical history updated successfully",
      data: updatedHistory,
    });

  } catch (error) {
    console.error("Medical History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const getPatientMedicalHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const doctorId = req.user;

    const medicalHistory = await patientMedicalModel
      .findOne({ patientId })
      .populate("visits.doctorId")
      .populate("visits.appointmentId");

    if (!medicalHistory) {
      return res.status(404).json({
        success: false,
        message: "Medical history not found",
      });
    }

    // ✅ Filter visits by doctor
    if (Array.isArray(medicalHistory.visits)) {
      medicalHistory.visits = medicalHistory.visits.filter(
        (visit) =>
          visit.doctorId && visit.doctorId._id?.toString() === doctorId.toString()
      );
    }

    return res.status(200).json({
      success: true,
      data: medicalHistory,
    });
  } catch (error) {
    console.error("Error fetching medical history:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const patientMedicalHistoryController = {
  addVisitToMedicalHistory,
  getPatientMedicalHistory,
};

export default patientMedicalHistoryController;