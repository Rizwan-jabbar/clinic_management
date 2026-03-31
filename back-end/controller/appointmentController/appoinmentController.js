import Appointment from "../../model/appointmentModel/appoinmentModel.js";
import Assistant from "../../model/assistantModel/assistantModel.js";

const createAppointment = async (req, res) => {
  try {
    const assistantId = req.user;
    const { doctorId, clinicId, patientId , appointmentDate } = req.body;


    const assistant = await Assistant.findById(assistantId);
    if (!assistant) {
      return res.status(404).json({ message: "Assistant not found" });
    }


    // ✅ Validation
    if (!doctorId || !clinicId || !patientId || !appointmentDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const checkDate = new Date(appointmentDate);
    if (isNaN(checkDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const checkDuplicateDate = await Appointment.findOne({
      doctor: doctorId,
      clinic: clinicId,
      appointmentDate: checkDate,
    });

    if (checkDuplicateDate) {
      return res.status(400).json({ message: "Appointment already exists for this doctor, clinic, and date" });
    }


    // here to check availability of timming of doctor and clinic
    const currentDate = new Date();
    if (checkDate < currentDate) {
      return res.status(400).json({ message: "Appointment date must be in the future" });
    }


    const workingHoursStart = new Date(checkDate);
    workingHoursStart.setHours(9, 0, 0); // 9:00 AM

    const workingHoursEnd = new Date(checkDate);
    workingHoursEnd.setHours(17, 0, 0); // 5:00 PM

    if (checkDate < workingHoursStart || checkDate > workingHoursEnd) {
      return res.status(400).json({ message: "Appointment must be within working hours (9 AM - 5 PM)" });
    }


    // now here appointment can be book for coming 2 weeks only
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    if (checkDate > twoWeeksFromNow) {
      return res.status(400).json({ message: "Appointments can only be booked up to 2 weeks in advance" });
    }


    // here if patient have appointment on same date with same doctor and clinic then he can not book another appointment
    const existingAppointment = await Appointment.findOne({
      patient: patientId,
      doctor: doctorId,
      clinic: clinicId,
    });

    if (existingAppointment && existingAppointment.status === "Pending") {
      return res.status(400).json({ message: "This uer have already one appointment in pending" });
    }


    // user cannot book appointment for same day
    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of today

    const appointmentDay = new Date(checkDate);
    appointmentDay.setHours(0, 0, 0, 0);

    // block same day and past days
    if (appointmentDay <= today) {
      return res.status(400).json({
        message: "You cannot book an appointment for today. Please select a future date.",
      });
    }

    // ✅ Create appointment (Model name different variable name)
    const newAppointment = new Appointment({
      assistant: assistantId,
      patient: patientId,
      doctor: doctorId,
      clinic: clinicId,
      appointmentDate,
      status: "Pending", // ✅ Best practice add default explicitly
    });

    const savedAppointment = await newAppointment.save();

    res.status(201).json(savedAppointment);

  } catch (error) {
    res.status(500).json({
      message: "Error creating appointment",
      error: error.message,
    });
  }
};

const getAppointments = async (req, res) => {
  try {

    const appointments = await Appointment.find()
      .populate("doctor", "name specializations")
      .populate("clinic", "name location")
      .populate("patient", "name email")
      .populate("assistant", "name email")
      .sort({ appointmentDate: -1 });


    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });

  } catch (error) {
    console.error("🔥 ACTUAL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message, // ✅ IMPORTANT
    });
  }
};


const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedAppointment,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const appointmentController = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
};

export default appointmentController;