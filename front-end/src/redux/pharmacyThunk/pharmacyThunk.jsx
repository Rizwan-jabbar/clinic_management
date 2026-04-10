import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const addPharmacy = createAsyncThunk(
  "addPharmacy",
  async (pharmacyData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/addPharmacy`, pharmacyData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Add Pharmacy Failed"
      );
    }
  }
);

export const getPharmacies = createAsyncThunk(
  "getPharmacies",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/getPharmacies`, {
        headers: getAuthHeaders(),
      });

      return data?.data || data?.pharmacies || [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message || "Get Pharmacies Failed"
      );
    }
  }
);

export const deletePharmacy = createAsyncThunk(
  "deletePharmacy",
  async (pharmacyId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/deletePharmacy/${pharmacyId}`, {
        headers: getAuthHeaders(),
      });

      return { pharmacyId, serviceStatus: "deactivated", status: "inactive" };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Delete Pharmacy Failed"
      );
    }
  }
);

export const updatePharmacyStatus = createAsyncThunk(
    "updatePharmacyStatus",
    async ({ pharmacyId, status }, { rejectWithValue }) => {
        try {
            await axios.patch(`${BASE_URL}/updatePharmacyStatus/${pharmacyId}`, { status }, {
                headers: getAuthHeaders(),
            });

            return { pharmacyId, status };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Update Pharmacy Status Failed"
            );
        } 
      }
);

export const undoDeletePharmacy = createAsyncThunk(
  "undoDeletePharmacy",
  async (pharmacyId, { rejectWithValue }) => {
    try {
      await axios.put(
        `${BASE_URL}/undoDeletePharmacy/${pharmacyId}`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );

      return { pharmacyId, serviceStatus: "activated", status: "active" };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Undo Delete Pharmacy Failed"
      );
    }
  }
);

export const updatePharmacyDetails = createAsyncThunk(
  "updatePharmacyDetails",
  async ({ pharmacyId, pharmacyData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/updatePharmacy/${pharmacyId}`,
        pharmacyData,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return data.pharmacy;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Update Pharmacy Details Failed"
      );
    }
  }
);
