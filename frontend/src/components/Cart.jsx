import { useEffect, useState } from 'react';
import { Trash2, ShoppingCart , MapPin} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, getCart, removeItem, updateQuantity } from '../features/cart/cartThunk';
import { useNavigate } from 'react-router-dom';
import { CartSkeleton } from './LoadingSkeleton';
import { showError, showSuccess } from '../utils/toast';
import ConfirmModal from './ConfirmModel';
import { checkoutPayment } from '../features/payment/paymentThunk';
import { selectAllAddresses } from '../features/address/addressSlice';

const Cart = () => {

    const [showConfirm, setShowConfirm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');

    const { loading: paymentLoading, error: paymentError } = useSelector(state => state.payment);

    const { items, totalPrice, loading, error } = useSelector(state => state.cart);
    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";

    const addresses = useSelector(selectAllAddresses);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getCart());
    }, [dispatch]);

    if (loading) {
        return <CartSkeleton darkMode={darkMode} />
    }

    const handleClearClick = () => {
        setShowConfirm(true);
    }

    const handleConfirmClear = async () => {
        await dispatch(clearCart()).unwrap();
        showSuccess("Your cart has been cleared");
        setShowConfirm(false);
    }

    const handleDelete = async (productId) => {
        const resultAction = await dispatch(removeItem(productId));
        if (removeItem.fulfilled.match(resultAction)) {
            showSuccess("Item removed from Cart");
            dispatch(getCart());
        }
    }

    const handleDoubleClick = (productId, currentQuantity) => {
        setEditingId(productId);
        setEditValue(currentQuantity.toString());
    }

    const handleQuantityInputChange = (e) => {
        setEditValue(e.target.value);
    }

    const handleQuantitySave = async (productId, currentQuantity) => {
        const item = items.find(i => i.productId === productId);
        const newQuantity = parseInt(editValue) || currentQuantity;

        if (newQuantity < 1) {
            showError("Quantity must be at least 1");
            setEditingId(null);
            return;
        }

        if (newQuantity > item.stock) {
            showError(`Only ${item.stock} items available in stock`);
            setEditingId(null);
            return;
        }

        if (newQuantity !== currentQuantity) {
            const resultAction = await dispatch(updateQuantity({ productId, quantity: newQuantity }));
            if (updateQuantity.fulfilled.match(resultAction)) {
                showSuccess(`Quantity updated to ${newQuantity}`);
            } else {
                showError(error);
            }
        }

        setEditingId(null);
    }

    const handleKeyDown = (e, productId, currentQuantity) => {
        if (e.key === 'Enter') {
            handleQuantitySave(productId, currentQuantity);
        } else if (e.key === 'Escape') {
            setEditingId(null);
        }
    }
    const defaultAddress = addresses?.[0];

    const handleCheckout = async () => {

        if(!defaultAddress){
            showError("Please select delivery address");
            return;
        }
        try {
            await dispatch(checkoutPayment({addressId : defaultAddress.id})).unwrap();
        } catch (error) {
            showError(error)
        }
    }


    return (
        <div className={`min-h-screen overflow-y-scroll p-4 sm:p-6 transition-colors duration-300
            ${darkMode
                ? 'bg-linear-to-br from-gray-900 via-gray-950 to-black'
                : 'bg-linear-to-br from-slate-50 via-white to-blue-50'
            }`}
        >
            <div className="max-w-5xl mx-auto">

                <div className="flex justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <ShoppingCart className={`w-8 h-8 ${darkMode ? 'text-orange-400' : 'text-orange-500'}`} />
                        <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-slate-900'}`}>
                            Your Cart
                        </h1>
                    </div>
                    <button
                        className="h-10 bg-red-500 hover:bg-red-600 cursor-pointer text-white font-bold p-1 rounded-lg transition shadow-[0_6px_16px_rgba(0,0,0,0.3)]"
                        onClick={handleClearClick}
                    >
                        Clear Cart
                    </button>

                    <ConfirmModal
                        isOpen={showConfirm}
                        title='Clear Cart?'
                        message='This will remove all items from your cart.'
                        onConfirm={handleConfirmClear}
                        onCancel={() => setShowConfirm(false)}
                        darkMode={darkMode}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 space-y-4">
                        {items.length === 0 ? (
                            <div className={`rounded-xl p-10 text-center border transition
                                ${darkMode
                                    ? 'bg-gray-900 border-gray-800 text-gray-400'
                                    : 'bg-white border-slate-200 text-slate-500'
                                }`}
                            >
                                <ShoppingCart className="w-14 h-14 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">Your cart is empty</p>
                            </div>
                        ) : (
                            items.map(item => (
                                <div
                                    key={item.productId}
                                    className={`rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 border transition
                                            ${darkMode
                                            ? 'bg-gray-900 border-gray-800'
                                            : 'bg-white border-slate-200 hover:border-orange-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-4 w-full sm:flex-1">
                                        <img src={item.imageUrl} alt={item.productName}
                                            className="w-12 h-12 object-cover rounded-lg border border-gray-300 dark:border-gray-700 shrink-0"
                                        />
                                        <div className='flex-1 min-w-0'>
                                            <h3
                                                className={`text-base font-semibold truncate
                                                    ${darkMode ? 'text-gray-100' : 'text-slate-900'}`}
                                                title={item.productName}
                                            >
                                                {item.productName}
                                            </h3>
                                            <p className={`font-bold text-sm
                                                    ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}
                                            >
                                                ₹{item.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                                        <div
                                            className={`flex items-center justify-center gap-2 rounded-lg px-3 h-10 w-28 shrink-0
                                                ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-slate-100 text-slate-900'}`}
                                        >
                                            {editingId === item.productId ? (
                                                <input
                                                    type="number"
                                                    value={editValue}
                                                    onChange={handleQuantityInputChange}
                                                    onBlur={() => handleQuantitySave(item.productId, item.quantity)}
                                                    onKeyDown={(e) => handleKeyDown(e, item.productId, item.quantity)}
                                                    autoFocus
                                                    min="1"
                                                    className={`w-full text-center font-semibold border-none outline-none
                                                        ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-slate-900'}`}
                                                />
                                            ) : (
                                                <span
                                                    className="font-semibold cursor-pointer hover:text-orange-500 px-2 py-1 rounded transition"
                                                    onDoubleClick={() => handleDoubleClick(item.productId, item.quantity)}
                                                    title="Double-click to edit"
                                                >
                                                    {item.quantity}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex justify-end items-center min-w-20 sm:w-28 gap-4">
                                            <p className={`font-bold whitespace-nowrap ${darkMode ? 'text-gray-100' : 'text-slate-900'}`}>
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                            <button className="text-red-400 hover:text-red-500 mt-1 cursor-pointer" onClick={() => handleDelete(item.productId)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            ))
                        )}
                    </div>

                    <div className="lg:col-span-1 space-y-4">
                        <div className={`rounded-xl p-6 border shadow-md transition
                            ${darkMode
                                ? 'bg-gray-900 border-gray-800'
                                : 'bg-white border-slate-200'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className={`text-lg font-bold flex items-center gap-2
                                    ${darkMode ? 'text-gray-100' : 'text-slate-900'}`}
                                >
                                    <MapPin className="w-5 h-5" />
                                    Delivery Address
                                </h2>
                            </div>

                            {defaultAddress ? (
                                <>
                                    <div className={`p-4 rounded-lg border mb-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-orange-50 border-orange-200'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                                                    {defaultAddress.phone}
                                                </p>
                                            </div>
                                            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                                                Default
                                            </span>
                                        </div>
                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                                            {defaultAddress.house}, {defaultAddress.street}, {defaultAddress.city}, {defaultAddress.state} {defaultAddress.pincode}, {defaultAddress.country}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="w-full text-orange-600 hover:text-orange-700 font-semibold py-2 text-sm"
                                    >
                                        Manage Addresses
                                    </button>
                                </>
                            ) : (
                                <div className={`text-center py-8 border-2 border-dashed rounded-lg ${darkMode ? 'border-gray-700' : 'border-slate-300'}`}>
                                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                                        No default address set
                                    </p>
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg text-sm transition"
                                    >
                                        Add Default Address
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className={`rounded-xl p-6 sticky top-6 border shadow-md transition
                            ${darkMode
                                ? 'bg-gray-900 border-gray-800'
                                : 'bg-white border-slate-200'
                            }`}
                        >
                            <h2 className={`text-xl font-bold mb-6
                                ${darkMode ? 'text-gray-100' : 'text-slate-900'}`}
                            >
                                Order Summary
                            </h2>

                            <div className="space-y-3 mb-6 border-b pb-6 border-gray-700">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-green-500 font-semibold">
                                        FREE
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <span className={`text-lg font-bold
                                    ${darkMode ? 'text-gray-100' : 'text-slate-900'}`}
                                >
                                    Total
                                </span>
                                <span className="text-2xl font-bold text-orange-500">
                                    ₹{totalPrice.toFixed(2)}
                                </span>
                            </div>

                            <button
                                className={`w-full font-bold py-3 rounded-lg transition text-white
                                    ${paymentLoading || items.length === 0 || !defaultAddress
                                        ? 'bg-gray-500 cursor-not-allowed'
                                        : 'bg-orange-600 hover:bg-orange-700 cursor-pointer'
                                    }`}
                                disabled={paymentLoading || items.length === 0}
                                onClick={handleCheckout}
                            >
                                {paymentLoading ? "Redirecting to Payment..." : "Checkout"}
                            </button>

                            <button
                                className="w-full mt-3 text-orange-400 hover:text-orange-500 cursor-pointer font-semibold py-2"
                                onClick={() => navigate("/products")}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );

};

export default Cart;