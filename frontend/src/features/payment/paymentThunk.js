import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";
import { getErrorMessage } from "../../utils/errorHelper";

export const checkoutPayment = createAsyncThunk(
    "payment/checkout",
    async ({ addressId }, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/payments/checkout", null , {
                params : {
                    addressId
                }
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
);

