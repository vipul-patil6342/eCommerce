import { createSlice } from "@reduxjs/toolkit"
import { fetchOrderById } from "./orderThunk";

const initialState = {
    currentOrder: null,
    orders: [],
    loading: false,
    error: null
}

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearOrder(state) {
            state.currentOrder = null;
            state.error = null;
            state.loading = null;
        }
    },
    extraReducers: (builder) => {

        const pending = (state) => {
            state.loading = true;
            state.error = null;
        }

        const rejected = (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }

        builder
            .addCase(fetchOrderById.pending, pending)
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, rejected)
    }
})

export const {clearOrder} = orderSlice.actions;
export default orderSlice.reducer;