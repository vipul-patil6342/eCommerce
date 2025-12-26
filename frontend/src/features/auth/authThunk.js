import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";
import { getErrorMessage } from "../../utils/errorHelper";

export const signupUser = createAsyncThunk(
    'auth/signup',
    async (signupData, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/auth/signup", signupData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const loginUser = createAsyncThunk(
    'auth/login',
    async (userData, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/auth/login", userData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/auth/logout");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const getAuthState = createAsyncThunk(
    'auth/getAuthState',
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get("/auth/state");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const sendOtp = createAsyncThunk(
    'auth/sendOtp',
    async ({ email }, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/otp/send", { email });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async ({ email, otp }, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/otp/verify", { email, otp });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)