import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme/themeSlice";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/product/productSlice";
import cartReducer from "../features/cart/cartSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import addressReducer from "../features/address/addressSlice";
import reviewReducer from "../features/review/reviewSlice";
import paymentReducer from "../features/payment/paymentSlice";
import orderReducer from "../features/order/orderSlice";

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        auth : authReducer,
        products : productReducer,
        cart : cartReducer,
        wishlist : wishlistReducer,
        address : addressReducer,
        review : reviewReducer,
        payment : paymentReducer,
        order : orderReducer,
    },
});