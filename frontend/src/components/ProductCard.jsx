function ProductCard({ product }) {
    const handleAddToCart = () => {
        console.log(`Added ${product.name} to cart`);
    };

    return (
        <div className="group border rounded-lg p-4 shadow-sm hover:shadow-md transition">

            {/* Product Name */}
            <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                {product.name}
            </h3>

            {/* Price */}
            <span className="text-lg font-semibold text-gray-900">
                ₹{product.price}
            </span>

            {/* Stock */}
            {product.stock === 0 && (
                <p className="text-red-500 text-sm mt-1">Out of stock</p>
            )}

            {/* Add to Cart Button */}
            <button
                disabled={product.stock === 0}
                onClick={handleAddToCart}
                className="w-full mt-3 bg-black text-white py-2 rounded text-sm font-medium 
                        hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Add to Cart
            </button>
        </div>
    );
}

export default ProductCard;
