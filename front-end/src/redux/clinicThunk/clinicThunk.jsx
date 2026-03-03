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

/* ================= ADD CLINIC ================= */

export const addClinic = createAsyncThunk(
  "clinic/addClinic",
  async (clinicData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/addClinic`,
        clinicData,
        getAuthConfig()
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

/* ================= GET CLINICS ================= */

export const getClinics = createAsyncThunk(
  "clinic/getClinics",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/getClinics`,
        getAuthConfig()
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

/* ================= DELETE CLINIC ================= */

export const deleteClinic = createAsyncThunk(
  "clinic/deleteClinic",
  async (clinicId, thunkAPI) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/deleteClinic/${clinicId}`,
        getAuthConfig()
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

/* ================= UPDATE CLINIC STATUS ================= */

export const updateClinicStatus = createAsyncThunk(
  "clinic/updateClinicStatus",
  async ({ clinicId, newStatus }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/updateClinicStatus/${clinicId}`,
        { status: newStatus },
        getAuthConfig()
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

/* ================= UPDATE CLINIC ================= */

export const updateClinic = createAsyncThunk(
  "clinic/updateClinic",
  async ({ clinicId, updatedData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/updateClinic/${clinicId}`,
        updatedData,
        getAuthConfig()
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);