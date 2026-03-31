import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const registerPatient = createAsyncThunk(
  "registerPatient",
  async (patientData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/registerPatient`,
        patientData,
        getAuthConfig()
      );

      return response.data;

    } catch (error) {
      if (error.response) {
        // ✅ backend ka exact message
        return rejectWithValue(error.response.data.message);
      }

      // ✅ network error
      return rejectWithValue(error.message);
    }
  }
);