import { createSlice } from "@reduxjs/toolkit";
import { addAssistant, getAssistants } from "../assistantThunk/assistantThunk";

const initialState = {
  assistants: [],
  loading: false,
  error: null,
};

const assistantSlice = createSlice({
  name: "assistant",
  initialState, 
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(addAssistant.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addAssistant.fulfilled, (state, action) => {
            state.loading = false;
            state.assistants.push(action.payload);
        })
        .addCase(addAssistant.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message || "Failed to add assistant.";
        })
        .addCase(getAssistants.fulfilled, (state, action) => {
            state.loading = false;
            state.assistants = action.payload;
        })
        .addCase(getAssistants.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message || "Failed to fetch assistants.";
        });
    },
});
export default assistantSlice.reducer;
