import { ShoppingBag, Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, getCart } from '../features/cart/cartThunk';
import { showError, showSuccess } from '../utils/toast';
import { getWishlist, toggleWishlist } from '../features/wishlist/wishlistThunk';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {

    const { items, loading } = useSelector(state => state.cart);
    const { wishlistedItems = [] } = useSelector(state => state.wishlist);
    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAddedToCart = items.some((item) => item.productId === product.id);
    const isWishlisted = wishlistedItems.some((item) => item.productId === product.id);

    const handleAddToCart = async (e, product) => {
        e.stopPropagation();

        const cartData = {
            productId: product.id,
            quantity: 1
        }

        const resultAction = await dispatch(addToCart(cartData));
        if (addToCart.fulfilled.match(resultAction)) {
            dispatch(getCart());
            showSuccess("Added to cart")
        } else {
            showError("Failed to add product")
        }
    };

    const handleWishlist = async (e, productId) => {
        e.stopPropagation();

        const resultAction = await dispatch(toggleWishlist({ productId }));
        if (toggleWishlist.fulfilled.match(resultAction)) {
            dispatch(getWishlist());
        } else {
            showError("Wishlist update failed");
        }
    }

    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock < 20;

    return (
        <div
            className={`rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group flex flex-col h-80
            ${darkMode
                    ? 'bg-gray-800 hover:shadow-gray-700'
                    : 'bg-white'
                }`}
            onClick={() => navigate(`/products/${product.id}`)}
        >

            {/* Product Image */}
            <div
                className={`relative h-36 flex items-center justify-center overflow-hidden bg-linear-to-br shrink-0
                ${darkMode
                        ? 'from-gray-700 to-gray-600'
                        : 'from-gray-100 to-gray-200'
                    }`}
            >
                <img
                    src={product.imageUrl || product.image}
                    alt={product.name}
                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                />

                {/* Wishlist Button */}
                <button
                    onClick={(e) => handleWishlist(e, product.id)}
                    className="absolute top-2 right-2 p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                    aria-label="Add to wishlist"
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isWishlisted ? '#ef4444' : (darkMode ? '#d1d5db' : '#4b5563'),
                        transition: 'color 200ms ease'
                    }}>
                        <Heart
                            size={20}
                            fill={isWishlisted ? 'currentColor' : 'none'}
                            strokeWidth={2}
                        />
                    </div>
                </button>
            </div>

            {/* Product Info */}
            <div className="p-2 flex flex-col flex-1">
                <h3
                    className={`text-sm font-medium mb-3 line-clamp-2
                    ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}
                >
                    {product.name}
                </h3>

                <div className="mb-1">
                    <span
                        className={`text-lg font-bold
                        ${darkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                        ₹{product.price}
                    </span>
                </div>

                {isLowStock && !isOutOfStock && (
                    <div className="mb-1 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs text-center font-semibold text-orange-700">
                        🔥Only {product.stock} left
                    </div>
                )}

                <button
                    disabled={isOutOfStock || loading || isAddedToCart}
                    onClick={(e) => handleAddToCart(e, product)}
                    className={`mt-auto w-full py-2.5 rounded font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed
                        ${(isOutOfStock || isAddedToCart)
                            ? darkMode
                                ? 'bg-gray-600 text-gray-400'
                                : 'bg-gray-300 text-gray-500'
                            : darkMode
                                ? 'bg-white text-black hover:bg-gray-200'
                                : 'bg-black text-white hover:bg-gray-800'
                        }
                        `}
                >
                    <ShoppingBag size={16} />
                    {isAddedToCart ? 'Added' :
                        isOutOfStock ? 'Out of Stock' : 'Add to Cart'
                    }
                </button>
            </div>
        </div>
    );
}

export default ProductCard;