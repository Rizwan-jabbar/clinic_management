import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

export const addAssistant = createAsyncThunk(
  "assistant/addAssistant",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/addAssistant`,
        { name, email, password },
        getAuthConfig()
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "An error occurred while adding the assistant.",
        }
      );
    }
  }
);

export const getAssistants = createAsyncThunk(
  "assistant/getAssistants",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/getAssistants`,
        getAuthConfig()
      );
      return data.assistants;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "An error occurred while fetching assistants.",
        }
      );
    }
  }
);