import { createSlice } from "@reduxjs/toolkit"
import { addToCart, getCart, removeItem, updateQuantity, clearCart } from "./cartThunk"

const initialState = {
    loading: false,
    loading: false,
    items: [],
    totalPrice: 0,
    itemsCount: 0,
    error: null
}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {

        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Add to Cart
        builder
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.totalPrice = action.payload.totalPrice;
                state.itemsCount = action.payload.itemsCount;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get Cart
        builder
            .addCase(getCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.totalPrice = action.payload.totalPrice;
                state.itemsCount = action.payload.itemsCount;
            })
            .addCase(getCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Remove Item
        builder
            .addCase(removeItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeItem.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.totalPrice = action.payload.totalPrice;
                state.itemsCount = action.payload.itemsCount;
            })
            .addCase(removeItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Update Quantity
        builder
            .addCase(updateQuantity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateQuantity.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.totalPrice = action.payload.totalPrice;
                state.itemsCount = action.payload.itemsCount;
            })
            .addCase(updateQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        // Clear Cart
        builder
            .addCase(clearCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.loading = false;
                state.items = [];
                state.totalPrice = 0;
                state.itemsCount = 0;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;