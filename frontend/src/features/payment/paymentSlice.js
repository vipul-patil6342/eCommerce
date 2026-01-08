import { createSlice } from "@reduxjs/toolkit";
import { checkoutPayment } from "./paymentThunk";

const initialState = {
    loading: false,
    error: null,
};

const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        clearPaymentError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkoutPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkoutPayment.fulfilled, (state, action) => {
                state.loading = false;

                //Redirect to Stripe Checkout
                window.location.href = action.payload.checkoutUrl;
            })
            .addCase(checkoutPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;
