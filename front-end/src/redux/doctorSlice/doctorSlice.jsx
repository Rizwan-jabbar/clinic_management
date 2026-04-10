import { createSlice } from "@reduxjs/toolkit";
import { addDoctor, getDoctors , deleteDoctor , updateDoctorStatus  , undoDeleteDoctor , updateDoctorDetails} from "../doctorThunk/doctorThunk";
const doctorSlice = createSlice({
    name: "doctor",
    initialState: {
        loading: false,
        error: null,
        success: false,
        doctor: null,
        doctors: []
    },
    reducers: {
        clearDoctorState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.doctor = null;
            state.doctors = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addDoctor.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(addDoctor.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.doctor = action.payload.doctor;
            })
            .addCase(addDoctor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to add doctor";
            })
            .addCase(getDoctors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getDoctors.fulfilled, (state, action) => {
                state.loading = false;
                state.doctors = action.payload; // ✅ Agar backend direct array bhej raha hai
            })

            .addCase(getDoctors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch doctors";
            })
            .addCase(deleteDoctor.fulfilled, (state, action) => {
                const { doctorId, serviceStatus, doctorStatus } = action.payload;
                const doctor = state.doctors.find((item) => item._id === doctorId);
                if (doctor) {
                    doctor.serviceStatus = serviceStatus;
                    doctor.doctorStatus = doctorStatus;
                }
            })
            .addCase(deleteDoctor.rejected, (state, action) => {
                state.error = action.payload || "Failed to delete doctor";
            }).addCase(updateDoctorStatus.fulfilled, (state, action) => {
                const { doctorId, status } = action.payload;
                const doctorIndex = state.doctors.findIndex(doctor => doctor._id === doctorId);
                if (doctorIndex !== -1) {
                    state.doctors[doctorIndex].doctorStatus = status;
                }
            }).addCase(updateDoctorStatus.rejected, (state, action) => {
                state.error = action.payload || "Failed to update doctor status";
            }).addCase(undoDeleteDoctor.fulfilled, (state, action) => {
                const { doctorId, serviceStatus, doctorStatus } = action.payload;
                const doctor = state.doctors.find(doctor => doctor._id === doctorId);
                if (doctor) {
                    doctor.isDeleted = false;
                    doctor.serviceStatus = serviceStatus;
                    doctor.doctorStatus = doctorStatus;
                }
            }).addCase(undoDeleteDoctor.rejected, (state, action) => {
                state.error = action.payload || "Failed to undo delete doctor";
            }).addCase(updateDoctorDetails.fulfilled, (state, action) => {
                const updatedDoctor = action.payload;
                const doctorIndex = state.doctors.findIndex(doctor => doctor._id === updatedDoctor._id);
                if (doctorIndex !== -1) {
                    state.doctors[doctorIndex] = updatedDoctor;
                }
            }).addCase(updateDoctorDetails.rejected, (state, action) => {
                state.error = action.payload || "Failed to update doctor details";
            });
    }
});

export const { clearDoctorState } = doctorSlice.actions;
export default doctorSlice.reducer;
