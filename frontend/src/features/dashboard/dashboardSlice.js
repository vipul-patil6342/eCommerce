import { createSlice } from "@reduxjs/toolkit"
import { getDashboardSummary, getProductsCountByCategory } from "./dashboardThunk";

const initialState = {
    range: "WEEK",
    loading: false,
    error: null,
    totals: {
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
    },
    filtered: {
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
    },
    productsByCategory: []

}

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setRange(state, action) {
            state.range = action.payload;
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
            //get dashboard summary
            .addCase(getDashboardSummary.pending, pending)
            .addCase(getDashboardSummary.fulfilled, (state, action) => {
                state.loading = false;
                state.totals = action.payload.totals;
                state.filtered = action.payload.filtered;
            })
            .addCase(getDashboardSummary.rejected, rejected)

            //get product count by category
            .addCase(getProductsCountByCategory.pending , pending)
            .addCase(getProductsCountByCategory.fulfilled , (state,action) =>{
                state.loading = false;
                state.productsByCategory = action.payload;
            })
            .addCase(getProductsCountByCategory.rejected , rejected)
    }
});

export const { setRange } = dashboardSlice.actions;
export default dashboardSlice.reducer;