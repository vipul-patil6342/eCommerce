import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "../../utils/errorHelper";
import { axiosInstance } from "../../utils/axiosInstance";

export const fetchOrderById = createAsyncThunk(
    'order/fetchOrderById',
    async(orderId, thunkAPI) => {
        try {
            const response = await axiosInstance.get(`/orders/${orderId}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)