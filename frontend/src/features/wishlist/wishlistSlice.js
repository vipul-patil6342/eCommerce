import { createSlice } from "@reduxjs/toolkit";
import { getWishlist, toggleWishlist } from "./wishlistThunk";

const initialState = {
    wishlistedItems: [],
    loading: false,
    error: null
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlistedItems = action.payload;
                state.error = null;
            })
            .addCase(getWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(toggleWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                const { productId, added } = action.payload;
                if (!added) {
                    state.wishlistedItems = state.wishlistedItems.filter(
                        item => item.productId !== productId
                    );
                }
            })
            .addCase(toggleWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export default wishlistSlice.reducer;