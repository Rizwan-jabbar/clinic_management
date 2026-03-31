import { createSlice } from "@reduxjs/toolkit";
import { registerPatient } from "../registerPatientThunk/registerPatientThunk";


const registerPatientSlice = createSlice({
  name: "registerPatient",
  initialState: {
    loading: false,
    error: null,
    success: null, // 🔥 yahan bhi change (message store karenge)
  },

  reducers: {
    resetRegisterPatientState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // 🟡 Pending
      .addCase(registerPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })

      // 🟢 Fulfilled
      .addCase(registerPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.message; // ✅ backend message
        state.error = null;
      })

      // 🔴 Rejected
      .addCase(registerPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // ✅ sirf backend message
        state.success = null;
      });
  },
});

export const { resetRegisterPatientState } = registerPatientSlice.actions;
export default registerPatientSlice.reducer;