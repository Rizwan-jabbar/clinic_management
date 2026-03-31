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
}

export const createOrder = createAsyncThunk(
    "createOrder",
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/createOrder`, orderData, getAuthConfig());
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to create order" });
        }
    }
);

export const getMyOrders = createAsyncThunk(
    "getMyOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/getMyOrders`, getAuthConfig());
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to fetch your orders" });
        }
    }
);

export const getPharmacyOrders = createAsyncThunk(
    "getPharmacyOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/getPharmacyOrders`, getAuthConfig());
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to fetch pharmacy orders" });
        }
    }
);

export const getAllOrders = createAsyncThunk(
    "getAllOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/getAllOrders`, getAuthConfig());
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to fetch all orders" });
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    "updateOrderStatus",
    async ({ orderId, orderStatus }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `${BASE_URL}/updateOrderStatus/${orderId}`,
                { orderStatus },
                getAuthConfig()
            );
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to update order status" });
        }
    }
);

export const cancelOrder = createAsyncThunk(
    "cancelOrder",
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `${BASE_URL}/cancelOrder/${orderId}`,
                {},
                getAuthConfig()
            );
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to cancel order" });
        }
    }
);

