import { createSlice } from "@reduxjs/toolkit";
import { addPharmacy, getPharmacies } from "../pharmacyThunk/pharmacyThunk";

const pharmacySlice = createSlice({
  name: "pharmacy",
  initialState: {
    pharmacies: [],
    loading: false,
    error: null,
    message: null,
    success: false,
  },
  reducers: {
    resetPharmacyState: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPharmacy.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.success = false;
      })
      .addCase(addPharmacy.fulfilled, (state, action) => {
        state.loading = false;
        state.pharmacies.push(action.payload);
        state.message = action.payload.message || "Pharmacy added successfully";
        state.error = null;
        state.success = true;
      })
      .addCase(addPharmacy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Add Pharmacy Failed";
        state.message = null;
        state.success = false;
      })
      .addCase(getPharmacies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPharmacies.fulfilled, (state, action) => {
        state.loading = false;
        state.pharmacies = action.payload;
        state.error = null;
      })
      .addCase(getPharmacies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Get Pharmacies Failed";
      });
  },
});

export const { resetPharmacyState } = pharmacySlice.actions;
export default pharmacySlice.reducer;
