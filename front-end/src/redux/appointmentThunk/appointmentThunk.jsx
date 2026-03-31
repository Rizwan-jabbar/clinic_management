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

export const createAppointment = createAsyncThunk(
  "appointment/create",
  async (payload, { rejectWithValue }) => {
    try {

      const { data } = await axios.post(
        `${BASE_URL}/createAppointment`,
        payload,
        getAuthConfig()

      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create appointment"
      );
    }
  }
);



export const getAppointments = createAsyncThunk(
  "appointment/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/getAppointments`, getAuthConfig());

      return data.data; // Assuming the API returns { success: true, count: X, data: [...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch appointments"
      );
    }
  }
);


export const updateAppointmentStatus = createAsyncThunk(
  "appointment/updateStatus",
  async ({ appointmentId, status }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(
        `${BASE_URL}/updateAppointmentStatus/${appointmentId}`,
        { status },
        getAuthConfig()
      );
      return data.data; // Assuming the API returns { success: true, data: updatedAppointment }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update appointment status"
      );
    }
  }
);