import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/login`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // ✅ Axios automatically parses JSON
      return response.data;

    } catch (error) {

      // 🔥 Proper error handling for axios
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Login failed"
      );
    }
  }
);



export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, { rejectWithValue }) => { 
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    }
      catch (error) { 
        return rejectWithValue(
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch user profile"
        );
      }
  }
);

