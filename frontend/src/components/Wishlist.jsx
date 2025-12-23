import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWishlist, toggleWishlist } from '../features/wishlist/wishlistThunk';
import { addToCart } from '../features/cart/cartThunk';
import { showSuccess } from '../utils/toast';

const Wishlist = () => {
    const { wishlistedItems = [], loading } = useSelector(state => state.wishlist);
    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getWishlist());
    }, [dispatch]);

    const handleDeleteProduct = async (productId) => {
        const result = await dispatch(toggleWishlist({ productId }));
        if (toggleWishlist.fulfilled.match(result)) {
            dispatch(getWishlist());
            showSuccess("Product removed from wishlist");
        }
    };

    const handleAddToCart = async (product) => {
        const cartData = {
            productId: product.productId,
            quantity: 1
        };

        const result = await dispatch(addToCart(cartData));
        if (addToCart.fulfilled.match(result)) {
            dispatch(toggleWishlist({ productId: product.productId }));
            showSuccess("Added to cart");
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`max-w-7xl mx-auto px-4 py-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <Heart size={28} className={darkMode ? 'text-red-400' : 'text-red-500'} />
                    <h1 className="text-3xl font-bold">Wishlist</h1>
                </div>

                {/* Empty State */}
                {wishlistedItems.length === 0 ? (
                    <div className={`text-center py-12 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            Your wishlist is empty
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className={`w-full rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                                    <tr>
                                        <th className="px-6 py-4 text-left">Image</th>
                                        <th className="px-6 py-4 text-left">Product</th>
                                        <th className="px-6 py-4 text-left">Price</th>
                                        <th className="px-6 py-4 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {wishlistedItems.map(product => {
                                        const isOutOfStock = product.stock === 0;

                                        return (
                                            <tr
                                                key={product.productId}
                                                className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                                            >
                                                <td className="px-6 py-4">
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.productName}
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                </td>

                                                <td className="px-6 py-4 font-medium">
                                                    {product.productName}
                                                </td>

                                                <td className="px-6 py-4 font-semibold">
                                                    ₹{product.price}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => handleAddToCart(product)}
                                                            disabled={loading || isOutOfStock}
                                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition
                                                                ${isOutOfStock
                                                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                                                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                                                                }`}
                                                        >
                                                            <ShoppingCart size={18} />
                                                            {isOutOfStock ? 'Out of Stock' : 'Add'}
                                                        </button>

                                                        <button
                                                            onClick={() => handleDeleteProduct(product.productId)}
                                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-4">
                            {wishlistedItems.map(product => {
                                const isOutOfStock = product.stock === 0;

                                return (
                                    <div
                                        key={product.productId}
                                        className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}
                                    >
                                        <div className="flex gap-3">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.productName}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            <div>
                                                <h3 className="font-semibold">{product.productName}</h3>
                                                <p className="text-orange-500 font-bold">₹{product.price}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 mt-4">
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                disabled={loading || isOutOfStock}
                                                className={`flex-1 flex justify-center gap-2 px-4 py-2 rounded-lg font-medium
                                                    ${isOutOfStock
                                                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                                                    }`}
                                            >
                                                <ShoppingCart size={18} />
                                                {isOutOfStock ? 'Out of Stock' : 'Add'}
                                            </button>

                                            <button
                                                onClick={() => handleDeleteProduct(product.productId)}
                                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
