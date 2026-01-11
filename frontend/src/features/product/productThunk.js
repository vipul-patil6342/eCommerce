import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";
import { getErrorMessage } from "../../utils/errorHelper";

export const getProducts = createAsyncThunk(
    'products/getProducts',
    async ({ pageNumber, sortBy, direction } = {}, thunkAPI) => {
        try {
            const response = await axiosInstance.get("/products", {
                params: {
                    page: pageNumber,
                    sortBy,
                    direction
                }
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const searchProduct = createAsyncThunk(
    'products/searchProduct',
    async ({ searchTerm, pageNumber, sortBy, direction }, thunkAPI) => {
        try {
            const response = await axiosInstance.get("/products/search", {
                params: { 
                    q: searchTerm,
                    page: pageNumber,
                    sortBy,
                    direction
                }
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const addProduct = createAsyncThunk(
    'products/addProduct',
    async (productData, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/products", productData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async ({ id }, thunkAPI) => {
        try {
            const response = await axiosInstance.delete(`/products/${id}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async ({ id, formData }, thunkAPI) => {
        try {
            const response = await axiosInstance.put(`/products/${id}`, formData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const getProductsByCategory = createAsyncThunk(
    'products/getProductsByCategory',
    async ({ category, pageNumber, sortBy, direction }, thunkAPI) => {
        try {
            const response = await axiosInstance.get(`/products/category/${category}`, {
                params: {
                    page: pageNumber,
                    sortBy,
                    direction
                }
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const getStockAlerts = createAsyncThunk(
    'products/getStockAlerts',
    async ({ threshold, pageNumber, size = 10 }, thunkAPI) => {
        try {
            const response = await axiosInstance.get(`/products/low-stock`, {
                params: {
                    threshold,
                    page: pageNumber,
                    size,
                }
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)

export const getProductById = createAsyncThunk(
    'products/getProductById',
    async (id, thunkAPI) => {
        try {
            const response = await axiosInstance.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
        }
    }
)