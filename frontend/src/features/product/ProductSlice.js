/* This code snippet is defining a Redux slice using the `createSlice` function from the
`@reduxjs/toolkit` package. Here's a breakdown of what the code is doing: */
import { createSlice } from "@reduxjs/toolkit"
import { getProducts } from "./ProductThunk";

const initialState = {
    items: [],
    selectedProduct: null,
    loading: false,
    error: null
}

export const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProducts.fulfilled, (state,action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(getProducts.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const {clearSelectedProduct} =  productSlice.actions;
export default productSlice.reducer;