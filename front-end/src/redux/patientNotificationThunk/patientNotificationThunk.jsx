import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  };
};

export const addPatientNotification = createAsyncThunk(
  'patientNotification/addPatientNotification',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/addNotificationForPatient`,
        data,
        getAuthConfig() // optional if you need token
      );

      return response.data;

    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: error.message });
    }
  }
);


export const getPatientNotifications = createAsyncThunk(
    'patientNotification/getPatientNotifications',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(
            `${BASE_URL}/getPatientNotifications`,
            getAuthConfig() // optional if you need token
        );
        return response.data;
        } catch (error) {
        if (error.response) {
          return rejectWithValue(error.response.data);
        }
        return rejectWithValue({ message: error.message });
        }
    }
);

export const changeNotificationStatus = createAsyncThunk(
    'patientNotification/changeNotificationStatus',
    async (notificationId, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `${BASE_URL}/changeNotificationStatus/${notificationId}`,
                {},
                getAuthConfig() // optional if you need token
            );
            return response.data;
        } catch (error) {
            if (error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: error.message });
        }
    }
);