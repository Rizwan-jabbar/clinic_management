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


export const addDoctor = createAsyncThunk(
  "doctor/addDoctor",
  async (doctorData, { rejectWithValue }) => {
    try {

      const response = await axios.post(
        `${BASE_URL}/addDoctor`,
        doctorData, // ✅ FormData yahan pass hoga
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },

        }
      );

      return response.data;

    } catch (error) {

      return rejectWithValue(
        error.response?.data?.message ||
        "An error occurred while adding doctor"
      );
    }
  }
);



export const getDoctors = createAsyncThunk(
  "doctor/getDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/getDoctors`, getAuthConfig());

      return response.data.doctors; // 
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch doctors"
      );
    }
  }
);

export const deleteDoctor = createAsyncThunk(
  "doctor/deleteDoctor",
  async (doctorId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/deleteDoctor/${doctorId}`, getAuthConfig());

      return doctorId; // Return deleted doctor id for redux state update
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
        error.message ||
        "Failed to delete doctor"
      );
    }
  }
);