import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { createAddress, getAddresses } from "./addressThunk";

const addressAdapter = createEntityAdapter({
    selectId: (address) => address.id,
});

const initialState = addressAdapter.getInitialState({
    loading: false,
    error: null
});

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {
        clearAddressError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        const pending = (state) => {
            state.loading = true;
            state.error = null;
        };

        const rejected = (state, action) => {
            state.loading = false;
            state.error = action.payload;
        };

        builder
            //Add address
            .addCase(createAddress.pending, pending)
            .addCase(createAddress.fulfilled, (state, action) => {
                state.loading = false;
                addressAdapter.addOne(state, action.payload);
            })
            .addCase(createAddress.rejected, rejected)

            //Get Addresses
            .addCase(getAddresses.pending, pending)
            .addCase(getAddresses.fulfilled, (state, action) => {
                state.loading = false;
                addressAdapter.setAll(state, action.payload)
            })
            .addCase(getAddresses.rejected, rejected)
    }
});

export const {
    selectAll: selectAllAddresses
} = addressAdapter.getSelectors(state => state.address);

export const { clearAddressError } = addressSlice.actions;
export default addressSlice.reducer;