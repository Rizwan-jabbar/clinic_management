import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const addPharmacy = createAsyncThunk(
  "addPharmacy",
  async (pharmacyData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/addPharmacy`, pharmacyData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Add Pharmacy Failed"
      );
    }
  }
);

export const getPharmacies = createAsyncThunk(
  "getPharmacies",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/getPharmacies`, {
        headers: getAuthHeaders(),
      });

      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Get Pharmacies Failed"
      );
    }
  }
);
