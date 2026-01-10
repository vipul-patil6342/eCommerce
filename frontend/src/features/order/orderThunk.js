import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "../../utils/errorHelper";
import { axiosInstance } from "../../utils/axiosInstance";

export const fetchOrderById = createAsyncThunk(
    'orders/fetchOrderById',
    async (orderId, thunkAPI) => {
        try {
            const response = await axiosInstance.get(`/orders/${orderId}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const getMyOrders = createAsyncThunk(
    'orders/getMyOrders',
    async ({ pageNumber, size }, thunkAPI) => {
        try {
            const response = await axiosInstance.get("/orders/my", {
                params: {
                    page: pageNumber,
                    size
                }
            })
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const getAllOrders = createAsyncThunk(
    'orders/getAllOrders',
    async ({ pageNumber, size }, thunkAPI) => {
        try {
            const response = await axiosInstance.get("/orders", {
                params: {
                    page: pageNumber,
                    size
                }
            })
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)