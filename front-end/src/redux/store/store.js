import {configureStore} from "@reduxjs/toolkit";
import ClinicReducer from "../clinicSlice/clinicSlice";
import doctorReducer from "../doctorSlice/doctorSlice";
import userReducer from "../userSlice/userSlice";   
import messageReducer from "../messageSlice/messageSlice";
import appointmentReducer from "../appointmentSlice/appointmentSlice"
export const store = configureStore({
    reducer : {
        clinics : ClinicReducer,
        doctors : doctorReducer,
        user : userReducer,
        messages : messageReducer,
        appointments : appointmentReducer
    }
})