import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";
import { getErrorMessage } from "../../utils/errorHelper";

export const getWishlist = createAsyncThunk(
    'wishlist/getWishlist',
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get("/wishlist");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const toggleWishlist = createAsyncThunk(
    'wishlist/toggleWishlist',
    async ({ productId }, thunkAPI) => {
        try {
            const response = await axiosInstance.post(`/wishlist/${productId}`);
            return { productId, added: response.data };
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)