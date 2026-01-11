import { createSlice } from "@reduxjs/toolkit"
import { addProduct, deleteProduct, getProductById, getProducts, getProductsByCategory, getStockAlerts, searchProduct, updateProduct } from "./productThunk";


const addThunkCase = (builder, thunk, isArray = true) => {
    builder
        .addCase(thunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
            state.loading = false;
            if (isArray) {
                state.items = action.payload.content;
                state.totalPages = action.payload.totalPages;
                state.totalElements = action.payload.totalElements;
            } else {
                state.selectedProduct = action.payload;
            }
        })
        .addCase(thunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
};

const initialState = {
    items: [],
    selectedProduct: null,
    loading: false,
    error: null,
    totalPages : 0,
    totalElements : 0,
    currentPage : 0,
    sortBy : 'id',
    direction : 'ASC'
}

export const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
        },
        setCurrentPage : (state , action) =>{
            state.currentPage = action.payload;
        },
        setSortBy : (state,action) =>{
            state.sortBy = action.payload;
            state.currentPage = 0;
        },
        setDirection : (state,action) =>{
            state.direction = action.payload;
            state.currentPage = 0;
        }
    },
    extraReducers: (builder) => {
        addThunkCase(builder, getProducts, true);
        addThunkCase(builder, getProductsByCategory, true);
        addThunkCase(builder, getProductById, false);
        addThunkCase(builder, searchProduct, true);
        addThunkCase(builder, getStockAlerts, true);

        builder
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

export const { clearSelectedProduct, setCurrentPage , setSortBy, setDirection } = productSlice.actions;
export default productSlice.reducer;