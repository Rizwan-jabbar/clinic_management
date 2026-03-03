import { createSlice } from "@reduxjs/toolkit";
import { addDoctor, getDoctors , deleteDoctor } from "../doctorThunk/doctorThunk";
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
                state.doctors = state.doctors.filter(doctor => doctor._id !== action.payload);
            })
            .addCase(deleteDoctor.rejected, (state, action) => {
                state.error = action.payload || "Failed to delete doctor";
            });
    }
});

export const { clearDoctorState } = doctorSlice.actions;
export default doctorSlice.reducer;