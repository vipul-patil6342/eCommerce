import { createSlice } from "@reduxjs/toolkit";
import { getAuthState, loginUser, logoutUser, sendOtp, signupUser, verifyOtp } from "../wishlist/authThunk";

const initialState = {
    isLoading: true,
    user: null,
    error: null,
    isAuthenticated: false,
    signupData: {
        name : "",
        username : "",
        password : ""
    }
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetError: (state) => {
            state.error = null;
        },
        setSignupData: (state, action) => {
            state.signupData = {
                ...state.signupData,
                ...action.payload
            }
        },
        clearSignupData: (state) => {
            state.signupData = null;
        }
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
            })

            //Send OTP
            .addCase(sendOtp.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(sendOtp.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            //Verify OTP
            .addCase(verifyOtp.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    }
});

export const { resetError, setSignupData, clearSignupData } = authSlice.actions;
export default authSlice.reducer;
