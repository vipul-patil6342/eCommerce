import { createSlice } from "@reduxjs/toolkit";
import { getAuthState, loginUser, signupUser } from "./authThunk";

const initialState = {
    isLoading: true,
    user: null,
    email: null,
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
            .addCase(signupUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.email = action.payload.user?.username ?? null;
                state.isAuthenticated = true;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
                state.email = null;
            })

            // LOGIN
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.email = action.payload.user?.username ?? null;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
                state.email = null;
            })

            // AUTH STATE
            .addCase(getAuthState.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAuthState.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = action.payload.authenticated;
                state.email = action.payload.email ?? null;
            })
            .addCase(getAuthState.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.email = null;
                state.user = null;
            });
    }
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;
