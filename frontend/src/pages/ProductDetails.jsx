import { Heart, ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProductById } from "../features/product/productThunk";
import { getWishlist, toggleWishlist } from "../features/wishlist/wishlistThunk";
import { addToCart } from "../features/cart/cartThunk";
import { showError, showSuccess } from "../utils/toast";
import CustomerReviews from "../components/CustomerReviews";
import { CustomLoading } from "../components/LoadingSkeleton";

const ProductDetails = () => {
    const { items } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth);
    const { wishlistedItems = [] } = useSelector(state => state.wishlist);
    const { id } = useParams();
    const dispatch = useDispatch();

    const { selectedProduct, loading } = useSelector(state => state.products);
    const { theme } = useSelector(state => state.theme);

    useEffect(() => {
        dispatch(getProductById(id));
    }, [dispatch, id]);

    const darkMode = theme === "dark";

    if (!selectedProduct) {
        return <CustomLoading />
    }

    const isAdded = items.some((item) => item.productId === selectedProduct.id);
    const isWishlisted = wishlistedItems.some((item) => item.productId === selectedProduct.id);

    const isOutOfStock = selectedProduct.stock === 0;

    const handleAddToCart = async () => {
        const cartData = {
            productId: selectedProduct.id,
            quantity: 1
        }

        const resultAction = await dispatch(addToCart(cartData));
        if (addToCart.fulfilled.match(resultAction)) {
            dispatch(getCart());
            showSuccess("Added to cart")
        } else {
            showError("Failed to add selectedProduct")
        }
    };

    const handleWishlist = async (productId) => {
        const resultAction = await dispatch(toggleWishlist({ productId }));
        if (toggleWishlist.fulfilled.match(resultAction)) {
            dispatch(getWishlist());
        } else {
            showError("Wishlist update failed");
        }
    };

    return (
        <div className={`${darkMode ? "bg-gray-900" : "bg-white"}`}>
            <div className="min-h-screen py-8 px-4 sm:px-6">
                
                {loading && <CustomLoading darkMode={darkMode} />}

                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                        {/* Image Section - Left */}
                        <div className="w-full lg:flex-1 flex justify-center items-start lg:sticky lg:top-8">
                            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg aspect-square flex-shrink-0">
                                <img
                                    src={selectedProduct.imageUrl}
                                    alt={selectedProduct.name}
                                    className={`w-full h-full rounded-xl shadow-lg object-contain ${darkMode ? "bg-gray-800" : "bg-white"} p-4 hover:shadow-xl transition-shadow duration-300`}
                                />
                            </div>
                        </div>

                        {/* Details Section - Right */}
                        <div className="w-full lg:flex-1 flex flex-col gap-6">
                            {/* Category */}
                            <span className={`inline-block w-fit px-3 py-1 text-xs font-medium rounded-full ${darkMode ? "bg-orange-900 text-orange-300" : "bg-orange-100 text-orange-600"}`}>
                                {selectedProduct.category}
                            </span>

                            {/* Title */}
                            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"} leading-tight`}>
                                {selectedProduct.name}
                            </h1>
                            {/* Brand */}
                            <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                Brand: <span className="font-bold">{selectedProduct.brand}</span>
                            </p>

                            {/* Price */}
                            <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                                ₹{selectedProduct.price}
                            </p>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${isOutOfStock ? "bg-red-500" : "bg-green-500"
                                    }`}></div>
                                <p
                                    className={`text-sm font-medium ${isOutOfStock
                                        ? "text-red-500"
                                        : "text-green-500"
                                        }`}
                                >
                                    {isOutOfStock ? "Out of Stock" : `In Stock (${selectedProduct.stock} available)`}
                                </p>
                            </div>

                            {/* Description */}
                            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} leading-relaxed text-sm sm:text-base`}>
                                {selectedProduct.description}
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isOutOfStock}
                                    className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-white text-sm font-semibold transition-all duration-200
                                        ${isOutOfStock
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : isAdded
                                                ? "bg-green-600 hover:bg-green-700"
                                                : "bg-orange-500 hover:bg-orange-600"
                                        }`}
                                >
                                    <ShoppingCart size={18} />
                                    <span className="hidden sm:inline">{isAdded ? "Added to Cart" : "Add to Cart"}</span>
                                    <span className="sm:hidden">{isAdded ? "Added" : "Add"}</span>
                                </button>

                                <button
                                    onClick={() => handleWishlist(selectedProduct.id)}
                                    className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-200
                                        ${isWishlisted
                                            ? `${darkMode ? "bg-red-900 text-red-300" : "bg-red-100 text-red-600"}`
                                            : `${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"} border`
                                        }`}
                                >
                                    <Heart
                                        size={18}
                                        fill={isWishlisted ? "currentColor" : "none"}
                                    />
                                    <span className="sm:inline">{isWishlisted ? "Wishlisted" : "Wishlist"}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CustomerReviews productId={selectedProduct.id} currentUserId={user.userId} />
        </div>
    );
}

export default ProductDetails;