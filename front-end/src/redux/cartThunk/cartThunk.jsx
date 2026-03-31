import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const addToCart = createAsyncThunk(
  "addToCart",
  async (cartData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/addToCart`,
        cartData,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to add item to cart" }
      );
    }
  }
);


export const getCart = createAsyncThunk(
  "getCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/getCart`, getAuthConfig());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch cart" }
      );
    }
  }
);


export const increaseCartItemQuantity = createAsyncThunk(
  "increaseCartItemQuantity",
  async (cartItemId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/increaseCartItem/${cartItemId}`,
        {},
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to increase item quantity" }
      );
    }
  }
);

export const decreaseCartItemQuantity = createAsyncThunk(
  "decreaseCartItemQuantity",
  async (cartItemId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/decreaseCartItem/${cartItemId}`,
        {},
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to decrease item quantity" }
      );
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  "removeItemFromCart",
  async (medicineId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/removeItemFromCart/${medicineId}`,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to remove item from cart" }
      );
    }
  }
);

export const clearMyCart = createAsyncThunk(
  "clearMyCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/clearMyCart`,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to clear cart" }
      );
    }
  }
);
