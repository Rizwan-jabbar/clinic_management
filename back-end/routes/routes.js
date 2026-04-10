import express from 'express';
import clinicController from '../controller/clinicController/clinicController.js';
import doctorController from '../controller/doctorController/doctorController.js';
import uploadDoctorImage from '../middleWare/imageUpload/imageUpload.js';
import loginController from '../controller/loginController/loginController.js';
import authMiddleware from '../middleWare/authMiddleWare/authMiddleWare.js';
import messageController from '../controller/messageController/messageController.js';
import appointmentController from '../controller/appointmentController/appoinmentController.js';
import roleMiddleware from '../middleWare/roleMiddleWare/roleMiddleWare.js';
import patientMedicalHistoryController from '../controller/patientMedicalController/patientMedicalController.js';
import assistantController from '../controller/assistantController/assistantController.js';
import appointmentRequestController from '../controller/appointmentRequestController/appointmentRequestController.js';
import nofificationForPatientController from '../controller/notificationForPatientController/notificationForPatientController.js';
import registerPatientController from '../controller/registerPatientController/registerPatientController.js';
import medicineController from '../controller/medicineController/medicineController.js';
import uploadMedicineImage from '../middleWare/imageUpload/imageUpload.js';
import cartController from '../controller/cartController/cartController.js';
import pharmacyController from '../controller/pharmacyController/pharmacyController.js';
import uploadPharmacyImage from '../middleWare/imageUpload/imageUpload.js';
import orderController from '../controller/orderController/orderController.js';
import paymentController from '../controller/paymentController/paymentController.js';
const router = express.Router()


// clinic routes
router.post('/addClinic', authMiddleware, roleMiddleware('admin'), clinicController.addClinic);
router.get('/getClinics', authMiddleware, clinicController.getClinics);
router.delete('/deleteClinic/:id', authMiddleware, roleMiddleware('admin'), clinicController.deleteClinic);
router.patch('/updateClinicStatus/:id', authMiddleware, roleMiddleware('admin'), clinicController.updateClinicStatus);
router.put('/updateClinic/:id', authMiddleware, roleMiddleware('admin'), clinicController.updateClinic);


// here doctor routes
router.post('/addDoctor', authMiddleware, roleMiddleware('admin'), uploadDoctorImage.single("profilePicture"), doctorController.addDoctor);
router.get('/getDoctors', authMiddleware, doctorController.getDoctors);
router.delete('/deleteDoctor/:id', authMiddleware, roleMiddleware('admin'), doctorController.deleteDoctor);
router.patch('/updateDoctorStatus/:id', authMiddleware, roleMiddleware('admin'), doctorController.updateDoctorStatus);
router.put('/undoDeleteDoctor/:id', authMiddleware, roleMiddleware('admin'), doctorController.undoDoctorDeletion);
router.put('/updateDoctor/:id', authMiddleware, roleMiddleware('admin'), uploadDoctorImage.single("profilePicture"), doctorController.updateDoctorDetails);


// login routes
router.post('/login', loginController.loginUser);
router.get('/profile', authMiddleware, loginController.userLoginProfile);

// message routes
router.post('/sendMessage', authMiddleware, messageController.sendMessage);



// appointment request routes
router.post('/sendAppointmentRequest', authMiddleware, roleMiddleware('user') , appointmentRequestController.sendAppointmentRequest);
router.get('/getAppointmentRequests', authMiddleware, roleMiddleware('assistant' , 'user') , appointmentRequestController.getAppointmentRequests);
router.patch('/changeAppointmentRequestStatus/:requestId', authMiddleware, roleMiddleware('assistant') , appointmentRequestController.changeAppointmentRequestStatus);
router.get('/getMyAppointmentsRequests', authMiddleware, roleMiddleware('user') , appointmentRequestController.getMyAppointmentsRequests);



// appointment routes
router.post('/createAppointment', authMiddleware, roleMiddleware("assistant") ,   appointmentController.createAppointment);
router.get('/getAppointments', authMiddleware,  roleMiddleware("doctor", "assistant", "user", "admin"), appointmentController.getAppointments);
router.patch('/updateAppointmentStatus/:appointmentId', authMiddleware, roleMiddleware('doctor' , 'assistant' , 'user') ,  appointmentController.updateAppointmentStatus);


// patient medical history routes
router.post('/addVisitToMedicalHistory', authMiddleware, roleMiddleware('doctor') , patientMedicalHistoryController.addVisitToMedicalHistory);
router.get('/getPatientMedicalHistory/:patientId', authMiddleware, roleMiddleware('doctor' , 'assistant' , 'user') , patientMedicalHistoryController.getPatientMedicalHistory);



// asistant routes
router.post('/addAssistant', authMiddleware, roleMiddleware('doctor') , assistantController.addAssistant);
router.get('/getAssistants', authMiddleware, roleMiddleware('doctor' , 'admin' , 'user') , assistantController.getAssistants);
router.delete('/deleteAssistant/:id', authMiddleware, roleMiddleware('doctor'), assistantController.deleteAssistant);





// notification for patient routes
router.post('/addNotificationForPatient', authMiddleware, roleMiddleware('assistant' , 'doctor') , nofificationForPatientController.addNotificationForPatient);
router.get('/getPatientNotifications', authMiddleware, roleMiddleware('user')  , nofificationForPatientController.getPatientNotifications);
router.patch('/changeNotificationStatus/:notificationId', authMiddleware, roleMiddleware('user') , nofificationForPatientController.changeStatusForNotification);


// register patient routes
router.post('/registerPatient', registerPatientController.RegisterPatient);



// medicine routes
router.post('/addMedicine' , authMiddleware , roleMiddleware('pharmacy') , uploadMedicineImage.single("image") , medicineController.addMedicine);
router.get('/getMedicines', authMiddleware, roleMiddleware('pharmacy'), medicineController.getMedicines);
router.delete('/deleteMedicine/:id', authMiddleware, roleMiddleware('admin'), medicineController.deleteMedicine);
router.get('/getAllMedicines' , authMiddleware , medicineController.getAllMedicines);


// cart routes
router.post('/addToCart', authMiddleware, roleMiddleware('user') , cartController.addToCart);
router.get('/getCart', authMiddleware, roleMiddleware('user'), cartController.getCart);
router.patch('/increaseCartItem/:cartItemId', authMiddleware, roleMiddleware('user'), cartController.increaseCartItemQuantity);
router.patch('/decreaseCartItem/:cartItemId', authMiddleware, roleMiddleware('user'), cartController.decreaseCartItemQuantity);
router.delete('/removeItemFromCart/:medicineId', authMiddleware, roleMiddleware('user'), cartController.removeItemFromCart);
router.delete('/clearMyCart', authMiddleware, roleMiddleware('user'), cartController.clearMyCart);




// pharmacy routes
router.post('/addPharmacy', authMiddleware, roleMiddleware('admin' ) , uploadPharmacyImage.single("logo"), pharmacyController.addPharmacy);
router.get('/getPharmacies', authMiddleware, roleMiddleware('admin'), pharmacyController.getPharmacy);
router.delete('/deletePharmacy/:id', authMiddleware, roleMiddleware('admin'), pharmacyController.deletePharmacy);
router.patch('/updatePharmacyStatus/:id', authMiddleware, roleMiddleware('admin'), pharmacyController.updatePharmacyStatus);
router.put('/undoDeletePharmacy/:id', authMiddleware, roleMiddleware('admin'), pharmacyController.undoPharmacyDeletion);
router.put('/updatePharmacy/:id', authMiddleware, roleMiddleware('admin'), uploadPharmacyImage.single("logo"), pharmacyController.updatePharmacyDetails);


// order routes
router.post('/createOrder', authMiddleware, roleMiddleware('user') , orderController.createOrder);
router.get('/getMyOrders', authMiddleware, roleMiddleware('user'), orderController.getMyOrders);
router.get('/getPharmacyOrders', authMiddleware, roleMiddleware('pharmacy'), orderController.getPharmacyOrders);
router.get('/getAllOrders', authMiddleware, roleMiddleware('admin'), orderController.getAllOrders);
router.patch('/updateOrderStatus/:orderId', authMiddleware, roleMiddleware('pharmacy'), orderController.updateOrderStatus);
router.patch('/cancelOrder/:orderId', authMiddleware, roleMiddleware('user'), orderController.cancelOrder);


// payment routes
router.post('/updatePayment/:doctorId', authMiddleware, roleMiddleware('admin'), paymentController.updatePaymet);

router.get('/getMessages/:doctorId', authMiddleware, messageController.getMessages);
export default router;
