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
            console.log(response.data)
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)