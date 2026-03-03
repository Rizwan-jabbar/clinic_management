import express from 'express';
import clinicController from '../controller/clinicController/clinicController.js';
import doctorController from '../controller/doctorController/doctorController.js';
import uploadDoctorImage from '../middleWare/imageUpload/imageUpload.js';
import loginController from '../controller/loginController/loginController.js';
import authMiddleware from '../middleWare/authMiddleWare/authMiddleWare.js';
import messageController from '../controller/messageController/messageController.js';
import appointmentController from '../controller/appointmentController/appoinmentController.js';
import roleMiddleware from '../middleWare/roleMiddleWare/roleMiddleWare.js';


const router = express.Router()

router.post('/addClinic', authMiddleware, roleMiddleware('admin'), clinicController.addClinic);
router.get('/getClinics', authMiddleware, clinicController.getClinics);
router.delete('/deleteClinic/:id', authMiddleware, roleMiddleware('admin'), clinicController.deleteClinic);
router.patch('/updateClinicStatus/:id', authMiddleware, roleMiddleware('admin'), clinicController.updateClinicStatus);
router.put('/updateClinic/:id', authMiddleware, roleMiddleware('admin'), clinicController.updateClinic);


// here doctor routes
router.post('/addDoctor', authMiddleware, roleMiddleware('admin'), uploadDoctorImage.single("profilePicture"), doctorController.addDoctor);
router.get('/getDoctors', authMiddleware, doctorController.getDoctors);
router.delete('/deleteDoctor/:id', authMiddleware, roleMiddleware('admin'), doctorController.deleteDoctor);

// login routes
router.post('/login', loginController.loginUser);
router.get('/profile', authMiddleware, loginController.userLoginProfile);

// message routes
router.post('/sendMessage', authMiddleware, messageController.sendMessage);


router.post('/createAppointment', authMiddleware, roleMiddleware('user'), appointmentController.createAppointment);
router.get('/getAppointments', authMiddleware, appointmentController.getAppointments);
router.patch('/updateAppointmentStatus/:appointmentId', authMiddleware, roleMiddleware('admin', 'user'), appointmentController.updateAppointmentStatus);



router.get('/getMessages/:doctorId', authMiddleware, messageController.getMessages);
export default router;