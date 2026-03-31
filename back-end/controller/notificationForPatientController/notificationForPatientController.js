import Assistant from "../../model/assistantModel/assistantModel.js";
import NotificationForPatient from "../../model/notificationForPatient/notificationForPatient.js";


const addNotificationForPatient = async (req , res) => {
    try {

        const { patientId , doctorId , clinicId , assistantId, message } = req.body;

        if(!patientId || !doctorId || !clinicId || !assistantId || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const notification = new NotificationForPatient({
            patientId,
            doctorId,
            clinicId,
            assistantId,
            message
        });
        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getPatientNotifications = async (req , res) => {
    try {

    const patientId = req.user;
    if(!patientId) {
        return res.status(400).json({ message: "Patient ID is required" });
    }

       const notifications = await NotificationForPatient
      .find({ patientId })
      .populate("doctorId", "name specialization") 
      .populate("assistantId", "name email")
      .populate("clinicId", "clinicName address")
      .sort({ createdAt: -1 });

    return res.status(200).json({ notifications, message: "Notifications retrieved successfully" });
        
    } catch (error) { 
        res.status(500).json({ message: error.message });
    }
}


const changeStatusForNotification = async (req , res) => {
    try {
        const { notificationId } = req.params;
        if(!notificationId) {
            return res.status(400).json({ message: "Notification ID is required" });
        }
        const notification = await NotificationForPatient.findById(notificationId);
        if(!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        notification.isRead = true;
        await notification.save();
        res.status(200).json({ message: "Notification status updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const nofificationForPatientController = {
    addNotificationForPatient,
    getPatientNotifications,
    changeStatusForNotification
};

export default nofificationForPatientController;