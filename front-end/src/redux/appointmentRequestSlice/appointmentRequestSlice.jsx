import { createSlice } from "@reduxjs/toolkit";
import { sendAppointmentRequest, getAppointmentRequests  , getMyAppointmentsRequests, changeAppointmentRequestStatus} from "../appointmentRequestThunk/appointmentRequestThunk";

const appointmentRequestSlice = createSlice({
  name: "appointmentRequest",
  initialState: {   
    loading: false,
    error: null,
    success: false,
    appointmentRequest: null,
    appointmentRequests: [],
  },
    reducers: {
    resetAppointmentRequestState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.appointmentRequest = null;
    }
    },
    extraReducers: (builder) => {
        builder
        .addCase(sendAppointmentRequest.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        }
        )
        .addCase(sendAppointmentRequest.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.appointmentRequest = action.payload.request;
            state.message = action.payload.message;
        }
        )
        .addCase(sendAppointmentRequest.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload 
        }
        )
        .addCase(getAppointmentRequests.fulfilled, (state, action) => {
            state.loading = false;
            state.appointmentRequests = action.payload;
            console.log("🚀 Fetched appointment requests:", action.payload);
        }
        )
        .addCase(getAppointmentRequests.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message || "Failed to fetch appointment requests";
        }
        )
        .addCase(changeAppointmentRequestStatus.fulfilled, (state, action) => {
            state.loading = false;
            // Update the specific appointment request in the list
            state.appointmentRequests = state.appointmentRequests.map(request =>
                request._id === action.payload._id ? action.payload : request
            );
        })
        .addCase(changeAppointmentRequestStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message || "Failed to change appointment request status";
        })
        .addCase(getMyAppointmentsRequests.fulfilled, (state, action) => {
            state.loading = false;
            state.appointmentRequests = action.payload;
        })
        .addCase(getMyAppointmentsRequests.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload
        })
    }
});

export const { resetAppointmentRequestState } = appointmentRequestSlice.actions;

export default appointmentRequestSlice.reducer;