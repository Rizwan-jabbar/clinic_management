import { createSlice } from "@reduxjs/toolkit";
import { sendMessage, getMessages } from "../messageThunk/messageThunk";

const messageSlice = createSlice({
  name: "messages",

  initialState: {
    messages: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ================= GET MESSAGES =================
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= SEND MESSAGE =================
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export default messageSlice.reducer;