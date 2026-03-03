import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

// ✅ Send Message
export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ receiverId, text }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        `${BASE_URL}/sendMessage`,
        { receiverId, text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Message Send Failed"
      );
    }
  }
);




// ✅ Get Messages
export const getMessages = createAsyncThunk(
  "messages/getMessages",
  async (doctorId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        `${BASE_URL}/getMessages/${doctorId}`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data.data; // backend me data: messages
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Get Messages Failed"
      );
    }
  }
);