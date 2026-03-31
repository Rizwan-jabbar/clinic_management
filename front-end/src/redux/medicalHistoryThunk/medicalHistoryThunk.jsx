import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

export const addVisitToMedicalHistory = createAsyncThunk(
  "medicalHistory/addVisit",
  async (visitData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // agar token use ho raha hai

      const response = await axios.post(
        `${BASE_URL}/addVisitToMedicalHistory`, // ✅ Correct URL
        visitData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ important (authMiddleware use ho raha hai)
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);


export const getPatientMedicalHistory = createAsyncThunk(
  "medicalHistory/getPatientMedicalHistory",
  async (patientId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${BASE_URL}/getPatientMedicalHistory/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data; // ✅ return only data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch medical history"
      );
    }
  }
);