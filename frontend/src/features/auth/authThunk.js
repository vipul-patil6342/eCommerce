import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";

export const signupUser = createAsyncThunk(
    'auth/signup',
    async (userData, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/auth/signup", userData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Registration Failed.';
            return thunkAPI.rejectWithValue(message);
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
            const message = error.response?.data?.message || error.message || 'login Failed.';
            return thunkAPI.rejectWithValue(message);
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
            const message = error.response?.data?.message || error.message || 'login Failed.';
            return thunkAPI.rejectWithValue(message);
        }

    }
)