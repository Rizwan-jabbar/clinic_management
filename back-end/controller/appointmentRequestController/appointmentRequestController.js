import AppointmentRequest from "../../model/appointmentRequestModel/appointmentRequestModel.js";
import Assistant from "../../model/assistantModel/assistantModel.js";
import Doctor from "../../model/doctorModel/doctorModel.js";


const sendAppointmentRequest = async (req, res) => {
  try {
    const patientId = req.user;
    const { doctorId } = req.body;
    console.log("Received doctorId:", doctorId);
    console.log("Received patientId:", patientId);

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor id is required",
      });
    }

    const doctor = await Doctor.findById(doctorId).populate("clinic");

   
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // now to check doublde appointment request for same doctor and patient
    const existingRequest = await AppointmentRequest.findOne({
      patient: patientId,
      doctor: doctorId,
      status: "pending",
    });

    if(existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending appointment request with this doctor",
      });
    }

     const assistant = await Assistant.findOne({ doctor: doctorId });

    const request = await AppointmentRequest.create({
      patient: patientId,
      doctor: doctorId,
      assistant:  assistant ? assistant._id : null,
      clinic: doctor.clinic,
    });


    return res.status(201).json({
      success: true,
      request,
      message: "Appointment request sent successfully",
    });
  } catch (error) {
    console.log("ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const getAppointmentRequests = async (req, res) => {
  try {
    const assistantId = req.user;


    const requests = await AppointmentRequest.find({ assistant: assistantId })
                                                .populate("patient doctor clinic");

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
 console.log("ERROR MESSAGE:", error.message);
  console.log("ERROR STACK:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



const changeAppointmentRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const updatedRequest = await AppointmentRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "Appointment request not found",
      });
    }

    return res.status(200).json({
      success: true,
      request: updatedRequest,
    });
  } catch (error) {
    console.log("ERROR MESSAGE:", error.message);
    console.log("ERROR STACK:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const getMyAppointmentsRequests = async (req, res) => {
  try {

    const userId = req.user;

    const appointments = await AppointmentRequest.find({ patient: userId })
      .populate("doctor", "name specializations")
      .populate("clinic", "name location")
      .populate("patient", "name email")
      .sort({ appointmentDate: -1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    
  }
}


const appointmentRequestController = {
  sendAppointmentRequest,
  getAppointmentRequests,
  changeAppointmentRequestStatus,
  getMyAppointmentsRequests,
};

export default appointmentRequestController;