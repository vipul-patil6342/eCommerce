import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (cartData, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/cart/add", cartData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed';
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const getCart = createAsyncThunk(
    'cart/getCart',
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get("/cart");
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed';
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.delete("/cart/clear");
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed';
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const removeItem = createAsyncThunk(
    'cart/removeItem',
    async (productId, thunkAPI) => {
        try {
            const response = await axiosInstance.delete(`/cart/remove/${productId}`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed';
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const updateQuantity = createAsyncThunk(
    'cart/updateQuantity',
    async ({ productId, quantity }, thunkAPI) => {
        try {
            const response = await axiosInstance.patch(`/cart/update/${productId}`, {},{
                params:{
                    quantity
                }
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.message || 'Failed';
            return thunkAPI.rejectWithValue(message);
        }
    }
)