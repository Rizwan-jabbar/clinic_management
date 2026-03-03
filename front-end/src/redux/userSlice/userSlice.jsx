import { createSlice } from "@reduxjs/toolkit";
import { fetchUserProfile, loginUser  } from "../userThunk/userThunk";
const initialState = {
  user: localStorage.getItem("token") ? {} : null, // agar token hai to user object initialize karo, warna null
  token: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    builder

      // 🔵 Login Pending
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // 🟢 Login Success
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.doctor; // backend se aa raha hai
        state.token = action.payload.token;

        // ✅ Token localStorage me save
        localStorage.setItem("token", action.payload.token);
      })

      // 🔴 Login Failed
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 🟡 Fetch User Profile Pending
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // 🟢 Fetch User Profile Success
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.doctor;
      })

      // 🔴 Fetch User Profile Failed
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      ;
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;