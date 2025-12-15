import { createSlice } from "@reduxjs/toolkit";
import { getAuthState, loginUser, logoutUser, signupUser } from "./authThunk";

const initialState = {
    isLoading: true,
    user: null,
    error: null,
    isAuthenticated: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            // SIGNUP
            .addCase(signupUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload
            })

            // LOGIN
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
            })

            //LOGOUT USER
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // AUTH STATE
            .addCase(getAuthState.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAuthState.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = action.payload.authenticated;
                state.user = action.payload;
            })
            .addCase(getAuthState.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
            });
    }
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;
