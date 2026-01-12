import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentPage } from '../features/product/productSlice';
import PaginationControls from './PaginationControls';
import { useEffect } from 'react';
import { getMyOrders } from '../features/order/orderThunk';
import { ChevronDown, CreditCard, Package } from 'lucide-react';

const MyOrders = () => {

    const { currentPage, totalPages, loading, error, orders, size } = useSelector(state => state.orders)
    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";

    const [expandedOrder, setExpandedOrder] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getMyOrders({ pageNumber: currentPage, size }))
    }, [dispatch, currentPage]);

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            dispatch(setCurrentPage(currentPage + 1));
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 0) {
            dispatch(setCurrentPage(currentPage - 1));
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className={`w-full min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4 sm:p-6`}>
                <div className="text-center">
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`w-full min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4 sm:p-6`}>
                <div className="text-center">
                    <p className={darkMode ? 'text-red-400' : 'text-red-600'}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full min-h-screen flex flex-col'>
            <div className={`flex-1 w-full overflow-y-scroll ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4 sm:p-6`}>
                <div className="w-full max-w-3xl mx-auto">

                    {/* Empty State */}
                    {orders.length === 0 ? (
                        <div className={`text-center py-12 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <Package className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No orders yet</p>
                        </div>
                    ) : (
                        /* Orders List */
                        <div className="space-y-3 sm:space-y-4">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className={`rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} overflow-hidden`}
                                >
                                    {/* Order Header - Always Visible */}
                                    <div
                                        className={`p-4 sm:p-6 cursor-pointer transition ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                    >
                                        <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
                                            <div className="flex items-start sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
                                                <div className={`p-2 sm:p-3 rounded-lg shrink-0 ${darkMode ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                                                    <Package className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                                                        <p className={`font-semibold text-base sm:text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            ORD-{String(order.id).padStart(3, '0')}
                                                        </p>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold w-fit ${order.status === 'PAID'
                                                            ? `${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`
                                                            : `${darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {formatDate(order.createdAt)} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                                                <div className="text-right">
                                                    <p className={`text-lg sm:text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                                                        Rs. {order.totalAmount}
                                                    </p>
                                                </div>
                                                <ChevronDown
                                                    className={`w-5 h-5 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedOrder === order.id && (
                                        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-4 sm:p-6 space-y-4 sm:space-y-6`}>
                                            {/* Payment Info */}
                                            <div className="flex items-start gap-3 sm:gap-4">
                                                <CreditCard className={`w-5 h-5 shrink-0 mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                                                <div className="min-w-0">
                                                    <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Payment ID</p>
                                                    <p className={`font-mono text-xs sm:text-sm break-all ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {order.paymentId}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Items Section */}
                                            <div>
                                                <h3 className={`font-semibold mb-3 text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    Order Items
                                                </h3>
                                                <div className="space-y-2 sm:space-y-3">
                                                    {order.items.map((item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                                                                }`}
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <p className={`font-medium mb-1 text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                                    {item.productName}
                                                                </p>
                                                                <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
                                                                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                                                        ID: <span className="font-mono">{item.productId}</span>
                                                                    </span>
                                                                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                                                        Qty: <span className="font-semibold">{item.quantity}</span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="text-right shrink-0">
                                                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Price</p>
                                                                <p className={`text-base sm:text-lg font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                                                                    Rs. {item.price}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Order Summary */}
                                            <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
                                                <div className="space-y-2 mb-4">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between text-xs sm:text-sm gap-2">
                                                            <span className={`truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                {item.productName} × {item.quantity}
                                                            </span>
                                                            <span className={`shrink-0 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                Rs. {item.price * item.quantity}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex justify-between items-center gap-2">
                                                    <span className={`font-semibold text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        Total
                                                    </span>
                                                    <span className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                                                        Rs. {order.totalAmount}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className='sticky bottom-0'>
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePrevPage={handlePrevPage}
                    handleNextPage={handleNextPage}
                    darkMode={darkMode}
                />
            </div>
        </div>
    )
}

export default MyOrders;