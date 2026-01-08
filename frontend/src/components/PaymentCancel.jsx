import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { XCircle, ShoppingCart, Home } from "lucide-react";
import { useSelector } from "react-redux";

const PaymentCancel = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const orderId = params.get("orderId");

    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";

    return (
        <div className={`h-full flex items-center justify-center p-4 transition-colors duration-300 ${darkMode
            ? "bg-linear-to-br from-slate-950 via-orange-950 to-slate-950"
            : "bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50"
            }`}>

            <div className="w-full max-w-md">
                <div className={`rounded-2xl shadow-2xl p-8 text-center transition-colors duration-300 ${darkMode
                    ? "bg-gray-900 border border-gray-800"
                    : "bg-white"
                    }`}>
                    
                    <div className="flex justify-center mb-6">
                        <div className="relative w-20 h-20">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <XCircle className="w-20 h-20 text-red-500" />
                            </div>
                        </div>
                    </div>

                    <h1 className={`text-2xl font-bold mb-1 ${darkMode ? "text-white" : "text-gray-800"}`}>
                        Payment Cancelled
                    </h1>

                    <p className={`mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Your payment was not completed.
                    </p>
                    <p className={`text-sm mb-6 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                        Don't worry, your cart is still saved.
                    </p>

                    {orderId && (
                        <div className={`rounded-lg p-3 mb-6 transition-colors duration-300 ${darkMode
                            ? "bg-gray-800 border border-gray-700"
                            : "bg-gray-50 border border-gray-200"
                            }`}>
                            <p className={`text-xs mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Order ID</p>
                            <p className={`font-mono text-sm ${darkMode ? "text-orange-400" : "text-orange-600"}`}>
                                #{orderId}
                            </p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            onClick={() => navigate("/cart")}
                            className="w-full bg-linear-to-r cursor-pointer from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 rounded-lg transition duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Retry Payment
                        </button>

                        <button
                            onClick={() => navigate("/products")}
                            className={`w-full font-semibold py-3 cursor-pointer rounded-lg transition duration-200 flex items-center justify-center gap-2 ${darkMode
                                ? "bg-gray-800 hover:bg-gray-700 text-white"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                                }`}
                        >
                            <Home className="w-5 h-5" />
                            Back to Home
                        </button>
                    </div>
                </div>

                <div className={`mt-4 rounded-xl p-3 transition-colors duration-300 ${darkMode
                    ? "bg-gray-800/50 border border-gray-700"
                    : "bg-white/50 border border-orange-100"
                    }`}>
                    <p className={`text-xs ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        <span className="font-semibold">Your cart items are safe.</span> Complete payment whenever ready!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancel;