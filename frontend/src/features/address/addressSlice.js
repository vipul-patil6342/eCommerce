import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { createAddress, deleteAddress, getAddresses, setDefaultAddress, updateAddress } from "./addressThunk";

const addressAdapter = createEntityAdapter({
    selectId: (address) => address.id,
    sortComparer : (a,b) => b.defaultAddress - a.defaultAddress
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

            //Delete Address
            .addCase(deleteAddress.pending, pending)
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.loading = false;
                addressAdapter.removeOne(state, action.payload)
            })
            .addCase(deleteAddress.rejected, rejected)

            //Update Address
            .addCase(updateAddress.pending, pending)
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.loading = false;
                addressAdapter.upsertOne(state, action.payload)
            })
            .addCase(updateAddress.rejected, rejected)

            //Set default Address
            .addCase(setDefaultAddress.pending, pending)
            .addCase(setDefaultAddress.fulfilled, (state, action) => {
                state.loading = false;

                // Unset all default flags
                Object.values(state.entities).forEach(addr => {
                    if(addr) addr.defaultAddress = false;
                })
                // Set the selected address as default
                addressAdapter.upsertOne(state, action.payload);
            })
            .addCase(setDefaultAddress.rejected, rejected)
    }
});

export const {
    selectAll: selectAllAddresses,
    selectById : selectAddressById
} = addressAdapter.getSelectors(state => state.address);

export const { clearAddressError } = addressSlice.actions;
export default addressSlice.reducer;