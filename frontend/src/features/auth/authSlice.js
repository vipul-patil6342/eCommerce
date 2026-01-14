import { createSlice } from "@reduxjs/toolkit";
import { forgotPassword, getAuthState, loginUser, logoutUser, resetPassword, sendOtp, signupUser, verifyOtp } from "./authThunk";

const initialState = {
    isLoading: false,
    user: null,
    error: null,
    email: null,
    isAuthenticated: false,
    signupData: {
        name: "",
        username: "",
        password: ""
    },
    successMessage: null,
    passwordReset: false
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
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        },
        resetForgotPasswordState: (state) => {
            state.passwordReset = false;
            state.email = null;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        }
    },

    extraReducers: (builder) => {

        const pending = (state) => {
            state.isLoading = true;
            state.error = null;
        }

        const rejected = (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        }

        builder
            // SIGNUP
            .addCase(signupUser.pending, pending)
            .addCase(signupUser.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(signupUser.rejected, rejected)

            // LOGIN
            .addCase(loginUser.pending, pending)
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
            .addCase(logoutUser.pending, pending)
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.rejected, rejected)

            // AUTH STATE
            .addCase(getAuthState.pending, pending)
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
            .addCase(sendOtp.pending, pending)
            .addCase(sendOtp.fulfilled, (state) => {

                state.isLoading = false;
                state.error = null;
            })
            .addCase(sendOtp.rejected, rejected)
            //Verify OTP
            .addCase(verifyOtp.pending, pending)
            .addCase(verifyOtp.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(verifyOtp.rejected, rejected)

            //Forgot password
            .addCase(forgotPassword.pending, pending)
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.successMessage = action.payload;
                state.passwordReset = true;
            })
            .addCase(forgotPassword.rejected, rejected)

            //Reset password
            .addCase(resetPassword.pending, pending)
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.successMessage = action.payload;
                state.passwordReset = false;
            })
            .addCase(resetPassword.rejected, rejected)
    }
});

export const { resetError, setSignupData, clearSignupData, clearSuccessMessage, resetForgotPasswordState, setEmail } = authSlice.actions;
export default authSlice.reducer;
