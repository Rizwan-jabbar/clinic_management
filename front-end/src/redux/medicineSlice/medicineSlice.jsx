import { createSlice } from "@reduxjs/toolkit";
import { addMedicine , getMedicines , deleteMedicine , getAllMedicines} from "../medicineThunk/medicineThunk";


const medicineSlice = createSlice({
  name: "medicine",
  initialState: {
    medicines: [],
    loading: false,
    error: null,
    success: false,
  },

  reducers: {
    resetMedicineState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ADD MEDICINE
      .addCase(addMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(addMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // agar backend new medicine return kare
        if (action.payload) {
          state.medicines.push(action.payload);
        }
      })

      .addCase(addMedicine.rejected, (state, action) => {
        state.loading = false;

        // ✅ ONLY backend message show hoga
        state.error = action.payload;
      });

    // GET MEDICINES
    builder
      .addCase(getMedicines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMedicines.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = action.payload;
      })
      .addCase(getMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // DELETE MEDICINE
      .addCase(deleteMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = state.medicines.filter(
          (medicine) => medicine._id !== action.payload
        );
      })
      .addCase(deleteMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(getAllMedicines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMedicines.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = action.payload;
      })
      .addCase(getAllMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetMedicineState } = medicineSlice.actions;

export default medicineSlice.reducer;