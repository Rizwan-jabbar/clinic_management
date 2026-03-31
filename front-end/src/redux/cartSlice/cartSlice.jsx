import { createSlice } from "@reduxjs/toolkit";
import {
  addToCart,
  clearMyCart,
  decreaseCartItemQuantity,
  getCart,
  increaseCartItemQuantity,
  removeItemFromCart,
} from "../cartThunk/cartThunk";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    resetCartState: (state) => {
      state.cart = null;
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.message = action.payload.message || "Item added to cart";
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add item to cart";
      })
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.message = null;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch cart";
      })
      .addCase(increaseCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(increaseCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.message = action.payload.message || "Item quantity increased";
      })
      .addCase(increaseCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to increase item quantity";
      })
      .addCase(decreaseCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(decreaseCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.message = action.payload.message || "Item quantity updated";
      })
      .addCase(decreaseCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to decrease item quantity";
      })
      .addCase(removeItemFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.message = action.payload.message || "Item removed from cart";
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to remove item from cart";
      })
      .addCase(clearMyCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(clearMyCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.message = action.payload.message || "Cart cleared successfully";
      })
      .addCase(clearMyCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to clear cart";
      });
  },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
