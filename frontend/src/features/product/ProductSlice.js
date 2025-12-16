/* This code snippet is defining a Redux slice using the `createSlice` function from the
`@reduxjs/toolkit` package. Here's a breakdown of what the code is doing: */
import { createSlice } from "@reduxjs/toolkit"
import { addProduct, deleteProduct, getProducts, searchProduct, updateProduct } from "./ProductThunk";

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
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(searchProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(searchProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProduct.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(
                    product => product.id !== action.meta.arg.id
                );
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const i = state.items.findIndex(p => p.id === action.payload.id);
                if (i !== -1) state.items[i] = action.payload;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;