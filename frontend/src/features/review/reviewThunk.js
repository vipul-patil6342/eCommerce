import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";
import { getErrorMessage } from "../../utils/errorHelper";

export const addReview = createAsyncThunk(
    'review/addReview',
    async ({ productId, reviewData }, thunkAPI) => {
        try {
            const response = await axiosInstance.post(`/reviews/${productId}`, reviewData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const getReviews = createAsyncThunk(
    'review/getReviews',
    async (productId, thunkAPI) => {
        try {
            const response = await axiosInstance.get(`/reviews/product/${productId}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const updateReview = createAsyncThunk(
    'review/updateReview',
    async ({ reviewId, reviewData }, thunkAPI) => {
        try {
            const response = await axiosInstance.put(`/reviews/${reviewId}`, reviewData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const deleteReview = createAsyncThunk(
    'review/deleteReview',
    async (reviewId, thunkAPI) => {
        try {
            const response = await axiosInstance.delete(`/reviews/${reviewId}`);
            return reviewId;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)