import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";

export const getWishlist = createAsyncThunk(
    'wishlist/getWishlist',
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get("/wishlist");
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed.';
            thunkAPI.rejectWithValue(message);
        }
    }
)

export const toggleWishlist = createAsyncThunk(
    'wishlist/toggleWishlist',
    async ({productId}, thunkAPI) => {
        try {
            const response = await axiosInstance.post(`/wishlist/${productId}`);
            return{ productId, added : response.data};
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed.';
            thunkAPI.rejectWithValue(message);
        }
    }
)