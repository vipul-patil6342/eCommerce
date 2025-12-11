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
                console.log(state.items)
            })
            .addCase(getProducts.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const {clearSelectedProduct} =  productSlice.actions;
export default productSlice.reducer;