import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

export const createAppointment = createAsyncThunk(
  "appointment/create",
  async (appointmentData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        `${BASE_URL}/createAppointment`,
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${BASE_URL}/getAppointments`, {
        headers: {
          Authorization: `Bearer ${token}`,   
      },  });

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
      const token = localStorage.getItem("token");
      const { data } = await axios.patch(
        `${BASE_URL}/updateAppointmentStatus/${appointmentId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data.data; // Assuming the API returns { success: true, data: updatedAppointment }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update appointment status"
      );
    }
  }
);