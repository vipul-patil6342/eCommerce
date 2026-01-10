import { createSlice } from "@reduxjs/toolkit"
import { fetchOrderById, getAllOrders, getMyOrders } from "./orderThunk";

const initialState = {
    currentOrder: null,
    orders: [],
    loading: false,
    error: null,
    totalPages: 0,
    totalElements: 0,
    size: 10,
    currentPage: 0
}

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearOrder: (state) => {
            state.currentOrder = null;
            state.error = null;
            state.loading = null;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
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
            //fetch order by id
            .addCase(fetchOrderById.pending, pending)
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = Array.isArray(action.payload)
                    ? action.payload
                    : (action.payload ? [action.payload] : []);
            })
            .addCase(fetchOrderById.rejected, rejected)

            //getMyOrders
            .addCase(getMyOrders.pending, pending)
            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.content;
                state.totalPages = action.payload.totalPages;
                state.totalElements = action.payload.totalElements;
                state.error = null;
            })
            .addCase(getMyOrders.rejected, rejected)

            //getAllOrders
            .addCase(getAllOrders.pending, pending)
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.content;
                state.totalPages = action.payload.totalPages;
                state.totalElements = action.payload.totalElements;
                state.error = null;
            })
            .addCase(getAllOrders.rejected, rejected)
    }
})

export const { clearOrder, setCurrentPage } = orderSlice.actions;
export default orderSlice.reducer;