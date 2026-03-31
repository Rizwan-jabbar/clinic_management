import { createSlice } from "@reduxjs/toolkit";
import { addPatientNotification, getPatientNotifications, changeNotificationStatus } from "../patientNotificationThunk/patientNotificationThunk";
const patientNotificationSlice = createSlice({
    name: "patientNotification",
    initialState: {
        notifications: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearPatientNotifications: (state) => {
            state.notifications = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addPatientNotification.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(addPatientNotification.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications.push(action.payload);
            }
            )
            .addCase(addPatientNotification.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            }
            ).addCase(getPatientNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPatientNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload.notifications;
            })
            .addCase(getPatientNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            }).addCase(changeNotificationStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            ).addCase(changeNotificationStatus.fulfilled, (state, action) => {
                state.loading = false;

                const updatedNotification = action.payload.notification;

                state.notifications = state.notifications.map((n) =>
                    n._id === updatedNotification._id ? updatedNotification : n
                );
            }).addCase(changeNotificationStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
    }
});

export const { clearPatientNotifications } = patientNotificationSlice.actions;
export default patientNotificationSlice.reducer;