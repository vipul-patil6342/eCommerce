import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme/themeSlice";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/product/ProductSlice";

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        auth : authReducer,
        products : productReducer,
    },
});