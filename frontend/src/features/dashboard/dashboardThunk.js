import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "../../utils/errorHelper";
import { axiosInstance } from "../../utils/axiosInstance";

export const getDashboardSummary = createAsyncThunk(
    'dashboard/getDashboardSummary',
    async ({range}, thunkAPI) => {
        try {
            const response = await axiosInstance.get("/admin/dashboard/summary", {
                params: {
                    range
                }
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const getProductsCountByCategory = createAsyncThunk(
    'dashboard/getProductsCountByCategory',
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get("/admin/dashboard/category-product-count");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

