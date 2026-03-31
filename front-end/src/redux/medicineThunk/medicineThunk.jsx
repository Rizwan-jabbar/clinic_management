import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const addMedicine = createAsyncThunk(
  "addMedicine",
  async (medicineData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/addMedicine`,
        medicineData,
        {
          headers: {
            ...getAuthConfig(), 
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "An error occurred while adding medicine"
      );
    }
  }
);


export const getMedicines = createAsyncThunk(
  "getMedicines",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/getMedicines`, {
        headers: getAuthConfig(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch medicines"
      );
    }
  }
);


export const getAllMedicines = createAsyncThunk(
  "getAllMedicines",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/getAllMedicines`, {
        headers: getAuthConfig(),
      });
      return response.data;
    }
      catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all medicines"
      );
    }
  }
);


export const deleteMedicine = createAsyncThunk(
  "deleteMedicine",
  async (medicineId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/deleteMedicine/${medicineId}`, {
        headers: getAuthConfig(),
      });
      return medicineId; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete medicine"
      );
    }
  }
);
