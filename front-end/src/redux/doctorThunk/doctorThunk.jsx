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

      return { doctorId, serviceStatus: "deactivated", doctorStatus: "inactive" };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
        error.message ||
        "Failed to delete doctor"
      );
    }
  }
);


export const updateDoctorStatus = createAsyncThunk(
    "updateDoctorStatus",
    async ({ doctorId, status }, { rejectWithValue }) => {
        try {
            await axios.patch(`${BASE_URL}/updateDoctorStatus/${doctorId}`, {
                status,
            }, getAuthConfig());
            return { doctorId, status };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update doctor status"
            );
        } 
    }
);


export const undoDeleteDoctor = createAsyncThunk(
    "undoDeleteDoctor",
    async (doctorId, { rejectWithValue }) => {
        try {
            await axios.put(`${BASE_URL}/undoDeleteDoctor/${doctorId}`, {}, getAuthConfig());
            return { doctorId, serviceStatus: "activated", doctorStatus: "active" };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to undo delete doctor"
            );  
          }
        }

      );



export const updateDoctorDetails = createAsyncThunk(
    "updateDoctorDetails",
    async ({ doctorId, doctorData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${BASE_URL}/updateDoctor/${doctorId}`,
                doctorData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data.doctor; 
        } catch (error) { 
            return rejectWithValue(
                error.response?.data?.message || "Failed to update doctor details"
            );
        }
    }
);
