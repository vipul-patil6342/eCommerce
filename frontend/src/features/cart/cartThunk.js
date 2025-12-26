import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";
import { getErrorMessage } from "../../utils/errorHelper";

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (cartData, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/cart/add", cartData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
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
            return thunkAPI.rejectWithValue(getErrorMessage(error));
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
            return thunkAPI.rejectWithValue(getErrorMessage(error));
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
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const updateQuantity = createAsyncThunk(
    'cart/updateQuantity',
    async ({ productId, quantity }, thunkAPI) => {
        try {
            const response = await axiosInstance.patch(`/cart/update/${productId}`, {}, {
                params: {
                    quantity
                }
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)