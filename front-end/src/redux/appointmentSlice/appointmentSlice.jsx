import { createSlice } from "@reduxjs/toolkit";
import { createAppointment, getAppointments, updateAppointmentStatus } from "../appointmentThunk/appointmentThunk";
const initialState = {
  appointments: [],
  loading: false,
  error: null,
  success: false,
};

const appointmentSlice = createSlice({
  name: "appointment",

  initialState,

  reducers: {
    clearAppointmentState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ===============================
         ✅ CREATE APPOINTMENT
      =================================*/
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // ✅ Add new appointment to list
        state.appointments.push(action.payload);
      })

      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      /* ===============================
         ✅ GET APPOINTMENTS
      =================================*/
      .addCase(getAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload; // ✅ Replace with fetched appointments
      })
      .addCase(getAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      /* ===============================
         ✅ UPDATE APPOINTMENT STATUS
      =================================*/
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const updated = action.payload?.data;

        if (!updated?._id) return;

        state.appointments = state.appointments?.map((item) =>
          item?._id === updated._id ? updated : item
        );
      })
      .addCase(updateAppointmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAppointmentState } = appointmentSlice.actions;

export default appointmentSlice.reducer;