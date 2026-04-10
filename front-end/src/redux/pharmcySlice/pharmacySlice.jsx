import { createSlice } from "@reduxjs/toolkit";
import {
  addPharmacy,
  getPharmacies,
  deletePharmacy,
  updatePharmacyStatus,
  undoDeletePharmacy,
  updatePharmacyDetails,
} from "../pharmacyThunk/pharmacyThunk";

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
      })
      .addCase(deletePharmacy.fulfilled, (state, action) => {
        const { pharmacyId, serviceStatus, status } = action.payload;
        const pharmacy = state.pharmacies.find((item) => item._id === pharmacyId);
        if (pharmacy) {
          pharmacy.serviceStatus = serviceStatus;
          pharmacy.status = status;
          pharmacy.pharmacyStatus = status;
        }
      })
      .addCase(deletePharmacy.rejected, (state, action) => {
        state.error = action.payload || "Delete Pharmacy Failed";
      })
      .addCase(updatePharmacyStatus.fulfilled, (state, action) => {
        const { pharmacyId, status } = action.payload;
        const index = state.pharmacies.findIndex((pharmacy) => pharmacy._id === pharmacyId);
        if (index !== -1) {
          state.pharmacies[index].status = status;
          state.pharmacies[index].pharmacyStatus = status;
        }
        state.message = "Pharmacy status updated successfully";
        state.error = null;
        state.success = true;
      })
      .addCase(updatePharmacyStatus.rejected, (state, action) => {
        state.error = action.payload || "Update Pharmacy Status Failed";
        state.message = null;
        state.success = false;
      })
      .addCase(undoDeletePharmacy.fulfilled, (state, action) => {
        const { pharmacyId, serviceStatus, status } = action.payload;
        const pharmacy = state.pharmacies.find((item) => item._id === pharmacyId);
        if (pharmacy) {
          pharmacy.serviceStatus = serviceStatus;
          pharmacy.status = status;
          pharmacy.pharmacyStatus = status;
        }
      })
      .addCase(undoDeletePharmacy.rejected, (state, action) => {
        state.error = action.payload || "Undo Delete Pharmacy Failed";
      })
      .addCase(updatePharmacyDetails.fulfilled, (state, action) => {
        const updatedPharmacy = action.payload;
        const index = state.pharmacies.findIndex((pharmacy) => pharmacy._id === updatedPharmacy._id);
        if (index !== -1) {
          state.pharmacies[index] = updatedPharmacy;
        }
      })
      .addCase(updatePharmacyDetails.rejected, (state, action) => {
        state.error = action.payload || "Update Pharmacy Details Failed";
      });
  },
});

export const { resetPharmacyState } = pharmacySlice.actions;
export default pharmacySlice.reducer;
