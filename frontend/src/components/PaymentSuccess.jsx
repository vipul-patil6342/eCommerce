import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { CheckCircle, Loader, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderById } from "../features/order/orderThunk";

const PaymentSuccess = () => {
    const [params] = useSearchParams();
    const orderId = params.get("orderId");
    const { currentOrder: order, error } = useSelector(state => state.orders);
    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!orderId || order?.status === "PAID") return;

        const pollOrder = () => dispatch(fetchOrderById(orderId));

        pollOrder(); // Initial fetch

        intervalRef.current = setInterval(pollOrder, 2000);

        return () => intervalRef.current && clearInterval(intervalRef.current);
    }, [dispatch, orderId, order?.status]);

    useEffect(() => {
        if (order?.status === "PAID" && intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }, [order?.status]);

    if (!orderId) {
        return (
            <div className={`flex flex-1 items-center justify-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h1 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Invalid Session</h1>
                    <button
                        onClick={() => navigate("/products")}
                        className="mt-4 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex flex-1 items-center justify-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Error loading order</p>
                    <button
                        onClick={() => navigate("/my-orders")}
                        className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
                    >
                        View My Orders
                    </button>
                </div>
            </div>
        );
    }

    if (!order || order.status !== "PAID") {
        return (
            <div className={`flex flex-1 items-center justify-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="text-center">
                    <Loader className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
                    <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Processing payment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-1 items-center justify-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className={`text-center max-w-md p-8 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Payment Successful!</h1>
                <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Order #{order.id}</p>
                {order.totalAmount && (
                    <p className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ₹{typeof order.totalAmount === 'number' ? order.totalAmount.toFixed(2) : order.totalAmount}
                    </p>
                )}
                <div className="space-y-3">
                    <button
                        onClick={() => navigate("/my-orders")}
                        className="w-full py-3 bg-orange-500 cursor-pointer text-white rounded hover:bg-orange-600 transition"
                    >
                        View My Orders
                    </button>
                    <button
                        onClick={() => navigate("/products")}
                        className={`w-full py-3 border cursor-pointer rounded transition ${darkMode ? 'border-gray-600 text-white hover:bg-gray-700' : 'border-gray-300 text-gray-900 hover:bg-gray-100'}`}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;