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



export const sendAppointmentRequest = createAsyncThunk(
  "appointmentRequest/sendAppointmentRequest",
  async (doctorId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/sendAppointmentRequest`,
        { doctorId }, // request body
        getAuthConfig() // include auth headers
      );

      return data;
    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("BACKEND ERROR:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);


export const getAppointmentRequests = createAsyncThunk(
  "appointmentRequest/getAppointmentRequests",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/getAppointmentRequests`,
        getAuthConfig() // include auth headers
      );
      return data.requests;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Something went wrong",
        });
    }
  }
);


export const changeAppointmentRequestStatus = createAsyncThunk(
  "appointmentRequest/changeAppointmentRequestStatus",
  async ({ requestId, status }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(
        `${BASE_URL}/changeAppointmentRequestStatus/${requestId}`,
        { status },
        getAuthConfig() // include auth headers
      );
      return data.request;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Something went wrong",
        });
    }
  }
);

export const getMyAppointmentsRequests = createAsyncThunk(
  "appointmentRequest/getMyAppointmentsRequests",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/getMyAppointmentsRequests`,
        getAuthConfig() // include auth headers
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Something went wrong",
        }
      );
    }
  }
);
