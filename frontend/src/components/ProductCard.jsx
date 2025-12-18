import { ShoppingBag } from 'lucide-react';
import { useSelector } from 'react-redux';

function ProductCard({ product, onAddToCart }) {

    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";

    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart(product);
        }
        console.log(`Added ${product.name} to cart`);
    };

    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock < 20;

    return (
        <div
            className={`rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group flex flex-col h-80
            ${darkMode
                    ? 'bg-gray-800 hover:shadow-gray-700'
                    : 'bg-white'
                }`}
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

                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <p className="text-white font-bold text-lg">Out of Stock</p>
                    </div>
                )}
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
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    className={`mt-auto w-full py-2.5 rounded font-semibold text-sm transition-all duration-200 active:scale-95
                        flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed
                        ${isOutOfStock
                            ? darkMode
                                ? 'bg-gray-600 text-gray-400'
                                : 'bg-gray-300 text-gray-500'
                            : darkMode
                                ? 'bg-white text-black hover:bg-gray-200'
                                : 'bg-black text-white hover:bg-gray-800'
                        }`}
                >
                    <ShoppingBag size={16} />
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
}

export default ProductCard;