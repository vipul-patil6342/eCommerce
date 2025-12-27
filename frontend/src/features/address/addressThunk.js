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

export const updateAddress = createAsyncThunk(
    'address/updateAddress',
    async ({ addressId, addressData }, ThunkAPI) => {
        try {
            const response = await axiosInstance.put(`/address/${addressId}`, addressData);
            return response.data;
        } catch (error) {
            return ThunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const deleteAddress = createAsyncThunk(
    'address/deleteAddress',
    async (addressId, ThunkAPI) => {
        try {
            const response = await axiosInstance.delete(`/address/${addressId}`);
            return response.data;
        } catch (error) {
            return ThunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const setDefaultAddress = createAsyncThunk(
    'address/setDefaultAddress',
    async (addressId, ThunkAPI) => {
        try {
            const response = await axiosInstance.put(`/address/${addressId}/set-default`);
            return response.data;
        } catch (error) {
            return ThunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)