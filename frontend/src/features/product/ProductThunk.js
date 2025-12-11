import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";

export const getProducts = createAsyncThunk(
    'products/getProducts',
    async(_,thunkAPI) => {
        try {
            const response = await axiosInstance.get("/products");
            console.log(response.data)
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Registration Failed.';
            return thunkAPI.rejectWithValue(message);
        }
    }
)