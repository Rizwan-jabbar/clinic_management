import { createAsyncThunk } from '@reduxjs/toolkit';
import  axios  from 'axios';

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const updatePayment = createAsyncThunk(
    'updatePayment',
    async ({ doctorId, payment }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${BASE_URL}/updatePayment/${doctorId}`, {
                payment,
            }, {
                headers: getAuthHeaders(),
            });
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Payment update failed"
            );
        }
    }
);
