import { createSlice } from "@reduxjs/toolkit";
import {
  addClinic,
  deleteClinic,
  getClinics,
  updateClinicStatus, // ✅ NEW
  updateClinic,       // ✅ NEW
} from "../clinicThunk/clinicThunk";

const clinicSlice = createSlice({
  name: "clinics",

  initialState: {
    clinics: [],
    loading: false,
    error: null,
    message: null,
  },

  reducers: {
    clearMessage: (state) => {
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ================= ADD CLINIC ================= */

      .addCase(addClinic.pending, (state) => {
        state.loading = true;
        state.message = null;
      })

      .addCase(addClinic.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload?.clinic) {
          state.clinics.push(action.payload.clinic);
        }

        state.message = action.payload?.message || "Clinic added successfully";
      })

      .addCase(addClinic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= GET CLINICS ================= */

      .addCase(getClinics.pending, (state) => {
        state.loading = true;
      })

      .addCase(getClinics.fulfilled, (state, action) => {
        state.loading = false;
        state.clinics = action.payload.clinics;
      })

      .addCase(getClinics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= UPDATE CLINIC STATUS ================= */
      // 🔥 NEW ADDED

      .addCase(updateClinicStatus.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateClinicStatus.fulfilled, (state, action) => {
        state.loading = false;

        const updatedClinic = action.payload?.clinic;

        if (updatedClinic) {
          state.clinics = state.clinics.map((clinic) =>
            clinic._id === updatedClinic._id
              ? updatedClinic
              : clinic
          );
        }

        state.message =
          action.payload?.message || "Clinic status updated successfully";
      })

      .addCase(updateClinicStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= DELETE CLINIC ================= */

      .addCase(deleteClinic.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteClinic.fulfilled, (state, action) => {
        state.loading = false;

        const deletedId = action.payload?.deletedId;

        if (deletedId) {
          state.clinics = state.clinics.filter(
            (clinic) => clinic._id !== deletedId
          );
        }

        state.message =
          action.payload?.message || "Clinic deleted successfully";
      })

      .addCase(deleteClinic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = "Failed to delete clinic";
      })


            /* ================= UPDATE CLINIC ================= */

      .addCase(updateClinic.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateClinic.fulfilled, (state, action) => {
        state.loading = false;

        const updatedClinic = action.payload?.clinic;

        if (updatedClinic) {
          state.clinics = state.clinics.map((clinic) =>
            clinic._id === updatedClinic._id
              ? updatedClinic
              : clinic
          );
        }

        state.message =
          action.payload?.message || "Clinic updated successfully";
      })

      .addCase(updateClinic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
  },
});

export const { clearMessage } = clinicSlice.actions;
export default clinicSlice.reducer;