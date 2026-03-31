import { configureStore } from "@reduxjs/toolkit";
import ClinicReducer from "../clinicSlice/clinicSlice";
import doctorReducer from "../doctorSlice/doctorSlice";
import userReducer from "../userSlice/userSlice";
import messageReducer from "../messageSlice/messageSlice";
import appointmentReducer from "../appointmentSlice/appointmentSlice";
import medicalHistoryReducer from "../medicalHistorySlice/medicalHistorySlice";
import assistantReducer from "../assistantSlice/assistantSlice";
import appointmentRequestReducer from "../appointmentRequestSlice/appointmentRequestSlice";
import patientNotificationReducer from "../patientNotificationSlice/patientNotificationSlice";
import registerPatientReducer from "../registerPatientSlice/registerPatientSlice";
import medicineReducer from "../medicineSlice/medicineSlice";
import cartReducer from "../cartSlice/cartSlice";
import pharmacyReducer from "../pharmcySlice/pharmacySlice";
import orderReducer from "../orderSlice/orderSlice";
export const store = configureStore({
  reducer: {
    clinics: ClinicReducer,
    doctors: doctorReducer,
    user: userReducer,
    messages: messageReducer,
    appointments: appointmentReducer,
    medicalHistory: medicalHistoryReducer,
    assistants: assistantReducer,
    appointmentRequest: appointmentRequestReducer,
    patientNotification: patientNotificationReducer,
    registerPatient: registerPatientReducer,
    medicine: medicineReducer,
    cart: cartReducer,
    pharmacy: pharmacyReducer,
    order: orderReducer,
  },
});
