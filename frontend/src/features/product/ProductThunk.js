import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axiosInstance";

export const getProducts = createAsyncThunk(
    'products/getProducts',
    async ({ pageNumber, sortBy, direction } = {}, thunkAPI) => {
        try {
            const response = await axiosInstance.get("products", {
                params: {
                    page: pageNumber,
                    sortBy,
                    direction
                }
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Fetching Products Failed.';
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const searchProduct = createAsyncThunk(
    'products/searchProduct',
    async ({ searchTerm }, thunkAPI) => {
        try {
            const response = await axiosInstance.get("/products/search", {
                params: { q: searchTerm }
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Search Failed.';
            return thunkAPI.rejectWithValue(message);
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
            const message = error.response?.data?.message || error.message || 'Failed.';
            return thunkAPI.rejectWithValue(message);
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
            const message = error.response?.data?.message || error.message || 'Failed.';
            return thunkAPI.rejectWithValue(message);
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
            const message = error.response?.data?.message || error.message || 'Failed.';
            return thunkAPI.rejectWithValue(message);
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
            const message = error.response?.data?.message || error.message || 'Failed.';
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const getProductById = createAsyncThunk(
    'products/getProductById',
    async (id, thunkAPI) => {
        try {
            const response = await axiosInstance.get(`/products/${id}`, id);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed.';
            return thunkAPI.rejectWithValue(message);
        }
    }
)

