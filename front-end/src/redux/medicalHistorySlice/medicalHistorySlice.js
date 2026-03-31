// src/redux/medicalHistory/medicalHistorySlice.js

import { createSlice } from "@reduxjs/toolkit";
import { addVisitToMedicalHistory  , getPatientMedicalHistory} from "../medicalHistoryThunk/medicalHistoryThunk";
const initialState = {
  loading: false,
  medicalHistory: null,
  success: false,
  error: null,
};

const medicalHistorySlice = createSlice({
  name: "medicalHistory",
  initialState,
  reducers: {
    resetMedicalHistoryState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ✅ ADD VISIT
      .addCase(addVisitToMedicalHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(addVisitToMedicalHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.medicalHistory = action.payload.data;
      })

      .addCase(addVisitToMedicalHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    builder
      .addCase(getPatientMedicalHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getPatientMedicalHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.medicalHistory = action.payload;
      })
      .addCase(getPatientMedicalHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetMedicalHistoryState } =
  medicalHistorySlice.actions;

export default medicalHistorySlice.reducer;