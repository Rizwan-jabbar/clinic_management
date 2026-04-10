import { createSlice } from "@reduxjs/toolkit";
import { updatePayment } from "../paymentThunk/paymentThunk";

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    error: null,
    success: false,
    paymentInfo: null,
    },
    reducers: {
        resetPaymentState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.paymentInfo = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updatePayment.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            }
            )
            .addCase(updatePayment.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.paymentInfo = action.payload;
            })
            .addCase(updatePayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Payment Update Failed";
            });
    }
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
