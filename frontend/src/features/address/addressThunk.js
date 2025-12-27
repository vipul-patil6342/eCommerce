import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";
import { getErrorMessage } from "../../utils/errorHelper";

export const createAddress = createAsyncThunk(
    'address/createAddress',
    async (addressData, ThunkAPI) => {
        try {
            const response = await axiosInstance.post("/address", addressData);
            return response.data;
        } catch (error) {
            return ThunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const getAddresses = createAsyncThunk(
    'address/getAddresses',
    async (_, ThunkAPI) => {
        try {
            const response = await axiosInstance.get("/address/my-addresses");
            return response.data;
        } catch (error) {
            return ThunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)