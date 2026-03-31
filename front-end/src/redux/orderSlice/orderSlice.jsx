import { createSlice } from "@reduxjs/toolkit";
import {
    cancelOrder,
    createOrder,
    getAllOrders,
    getMyOrders,
    getPharmacyOrders,
    updateOrderStatus,
} from "../orderThunk/orderThunk";

const orderSlice = createSlice({
    name: "order",
    initialState: {
        order: null,
        loading: false,
        ordersLoading: false,
        error: null,
        success: false,
        message: null,
        orders: [],
    },
    reducers: {
        resetOrderState: (state) => {
            state.order = null;
            state.loading = false;
            state.ordersLoading = false;
            state.error = null;
            state.success = false;
            state.message = null;
            state.orders = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.message = null;
            }
            )
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.order = action.payload.order;
                state.message = action.payload.message || "Order created successfully";
            }
            )
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to create order";
            }
            )
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.order;
                state.message = action.payload.message || "Order status updated successfully";
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to update order status";
            })
            .addCase(cancelOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.order;
                state.message = action.payload.message || "Order cancelled successfully";
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to cancel order";
            })
            .addCase(getMyOrders.pending, (state) => {
                state.ordersLoading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.ordersLoading = false;
                state.orders = action.payload.orders || [];
            })
            .addCase(getMyOrders.rejected, (state, action) => {
                state.ordersLoading = false;
                state.error = action.payload?.message || "Failed to fetch your orders";
            })
            .addCase(getPharmacyOrders.pending, (state) => {
                state.ordersLoading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(getPharmacyOrders.fulfilled, (state, action) => {
                state.ordersLoading = false;
                state.orders = action.payload.orders || [];
            })
            .addCase(getPharmacyOrders.rejected, (state, action) => {
                state.ordersLoading = false;
                state.error = action.payload?.message || "Failed to fetch pharmacy orders";
            })
            .addCase(getAllOrders.pending, (state) => {
                state.ordersLoading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.ordersLoading = false;
                state.orders = action.payload.orders || [];
            })
            .addCase(getAllOrders.rejected, (state, action) => {
                state.ordersLoading = false;
                state.error = action.payload?.message || "Failed to fetch all orders";
            }
            );
    }
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
