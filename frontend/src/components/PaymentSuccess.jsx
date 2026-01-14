import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { CheckCircle, Loader, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderById } from "../features/order/orderThunk";
import { clearOrder } from "../features/order/orderSlice";

const PaymentSuccess = () => {
    const [params] = useSearchParams();
    const orderId = params.get("orderId");

    const { currentOrder: order, loading, error } = useSelector(state => state.orders);
    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 🔒 Track interval with useRef (MANDATORY)
    const intervalRef = useRef(null);

    // 🔹 Polling effect with proper interval tracking
    useEffect(() => {
        if (!orderId) return;
        if (order?.status === "PAID") return;

        // 🔒 Prevent duplicate intervals
        if (intervalRef.current) return;

        intervalRef.current = setInterval(() => {
            dispatch(fetchOrderById(orderId));
        }, 2000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [dispatch, orderId, order?.status]);

    // 🔹 Cleanup when leaving page
    useEffect(() => {
        return () => {
            dispatch(clearOrder());
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [dispatch]);

    // 🧪 Stop polling when tab is hidden (STRONGLY recommended)
    useEffect(() => {
        const handleVisibility = () => {
            if (document.hidden && intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);
        return () =>
            document.removeEventListener("visibilitychange", handleVisibility);
    }, []);

    if (!orderId) {
        return (
            <div className={`h-full flex items-center justify-center p-4 transition-colors duration-300 ${darkMode
                ? "bg-linear-to-br from-orange-950 to-red-900"
                : "bg-linear-to-br from-orange-50 to-amber-100"
                }`}>

                <div className={`rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transition-colors duration-300 ${darkMode
                    ? "bg-gray-900 border border-gray-800"
                    : "bg-white"
                    }`}>
                    <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <h1 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Invalid Session</h1>
                    <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>The payment session could not be found. Please try again.</p>
                    <button
                        onClick={() => navigate("/products")}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition duration-200"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`h-full flex items-center justify-center p-4 transition-colors duration-300 ${darkMode
                ? "bg-linear-to-br from-orange-950 to-red-900"
                : "bg-linear-to-br from-orange-50 to-amber-100"
                }`}>

                <div className={`rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transition-colors duration-300 ${darkMode
                    ? "bg-gray-900 border border-gray-800"
                    : "bg-white"
                    }`}>
                    <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <h1 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Error Loading Order</h1>
                    <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>We couldn't retrieve your order details. Please contact support if the problem persists.</p>
                    <button
                        onClick={() => navigate("/my-orders")}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition duration-200"
                    >
                        View My Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`h-full flex items-center justify-center p-4 transition-colors duration-300 ${darkMode
            ? "bg-linear-to-br from-slate-950 via-orange-950 to-slate-950"
            : "bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50"
            }`}>

            <div className="w-full max-w-md">
                {!order || order.status !== "PAID" ? (
                    // Loading State
                    <div className={`rounded-2xl shadow-2xl p-8 text-center transition-colors duration-300 ${darkMode
                        ? "bg-gray-900 border border-gray-800"
                        : "bg-white"
                        }`}>
                        <div className="flex justify-center mb-6">
                            <div className="relative w-20 h-20">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader className="w-10 h-10 text-orange-500 animate-spin" />
                                </div>
                            </div>
                        </div>
                        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Processing Payment</h2>
                        <p className={`mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Order #{orderId}</p>
                        <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Please wait while we confirm your payment...</p>
                        <div className="mt-6 flex justify-center gap-1">
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                    </div>
                ) : (
                    // Success State
                    <div className={`rounded-2xl shadow-2xl p-8 text-center transition-colors duration-300 ${darkMode
                        ? "bg-gray-900 border border-gray-800"
                        : "bg-white"
                        }`}>
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="w-20 h-20 text-orange-500" />
                        </div>
                        <h1 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Payment Successful!</h1>
                        <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Thank you for your purchase</p>

                        <div className={`rounded-xl px-6 py-2 mb-4 border transition-colors duration-300 ${darkMode
                            ? "bg-linear-to-r from-orange-900 to-amber-900 border-orange-800"
                            : "bg-linear-to-r from-orange-50 to-amber-50 border-orange-200"
                            }`}>
                            <p className={`text-sm mb-1 ${darkMode ? "text-orange-300" : "text-gray-600"}`}>Order Number</p>
                            <p className={`text-2xl font-bold ${darkMode ? "text-orange-400" : "text-gray-800"}`}>#{order.id}</p>
                        </div>

                        {order.totalAmount && (
                            <div className={`mb-4 space-y-2 text-left rounded-lg p-4 transition-colors duration-300 ${darkMode
                                ? "bg-gray-800 border border-gray-700"
                                : "bg-gray-50"
                                }`}>
                                <div className={`flex justify-between ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                    <span>Total Amount</span>
                                    <span className={`font-semibold text-lg ${darkMode ? "text-orange-400" : "text-orange-600"}`}>
                                        ₹{typeof order.totalAmount === 'number' ? order.totalAmount.toFixed(2) : order.totalAmount}
                                    </span>
                                </div>
                                {order.items && (
                                    <div className={`flex justify-between text-sm pt-2 ${darkMode
                                        ? "text-gray-400 border-t border-gray-700"
                                        : "text-gray-600 border-t border-gray-200"
                                        }`}>
                                        <span>Items</span>
                                        <span>{order.items.length}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            onClick={() => navigate("/my-orders")}
                            className="w-full cursor-pointer bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 rounded-lg transition duration-200 mb-3 shadow-lg hover:shadow-xl"
                        >
                            View My Orders
                        </button>

                        <button
                            onClick={() => navigate("/products")}
                            className={`w-full font-semibold py-3 rounded-lg transition duration-200 cursor-pointer ${darkMode
                                ? "bg-gray-800 hover:bg-gray-700 text-white"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                                }`}
                        >
                            Continue Shopping
                        </button>

                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;