import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, getAllOrders } from '../features/order/orderThunk';
import PaginationControls from './PaginationControls';
import { setCurrentPage } from '../features/order/orderSlice';
import { CustomLoading } from './LoadingSkeleton';

const AllOrders = () => {
    const { currentPage, totalPages, loading, error, orders, size } = useSelector(state => state.orders)
    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === 'dark';
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [searchId, setSearchId] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchId.trim() === '') {
                dispatch(getAllOrders({ pageNumber: currentPage, size }));
            } else {
                dispatch(fetchOrderById(searchId));
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [dispatch, searchId, currentPage, size]);

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
            <CustomLoading darkMode={darkMode} />
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

    console.log(orders)

    const getStatusColor = (status) => {
        switch (status) {
            case 'PAID':
                return 'bg-green-100 text-green-800';
            case 'CREATED':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className={`w-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`min-h-screen p-6`}>
                <div className="max-w-4xl mx-auto">

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Order ID..."
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                className={`w-full pl-12 pr-12 py-3 rounded-lg border ${darkMode
                                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    } focus:outline-none focus:ring-2 focus:ring-orange-500 transition`}
                            />
                            {searchId && (
                                <button
                                    onClick={() => setSearchId('')}
                                    className="absolute right-4 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Empty State */}
                    {orders.length === 0 ? (
                        <div className={`text-center py-12 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {searchId ? 'No orders found matching your search' : 'No orders yet'}
                            </p>
                        </div>
                    ) : (
                        /* Orders List */
                        <div className="space-y-4 mb-6">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className={`rounded-lg border transition ${darkMode
                                        ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                        : 'bg-white border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {/* Order Header */}
                                    <button
                                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                        className="w-full px-6 py-4 flex items-center justify-between hover:opacity-80 transition"
                                    >
                                        <div className="text-left flex-1">
                                            <div className="flex items-center gap-4 mb-2">
                                                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    ORD-{String(order.id).padStart(3, '0')}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                                                {formatDate(order.createdAt)} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                            </p>
                                            <p className={`text-lg font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                                Rs. {order.totalAmount.toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>

                                    {/* Expanded Details */}
                                    {expandedOrder === order.id && (
                                        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} px-6 py-4 space-y-6`}>
                                            {/* Payment Info */}
                                            <div>
                                                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                                                    Payment ID
                                                </p>
                                                <p className={`font-mono ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                                    {order.paymentId}
                                                </p>
                                            </div>

                                            {/* Items Section */}
                                            <div>
                                                <h4 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    Order Items
                                                </h4>
                                                <div className="space-y-3">
                                                    {order.items.map((item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div>
                                                                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                                        {item.productName}
                                                                    </p>
                                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                        ID: {item.productId} • Qty: {item.quantity}
                                                                    </p>
                                                                </div>
                                                                <p className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                                                    Rs. {item.price.toLocaleString('en-IN')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Order Summary */}
                                            <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
                                                <div className="space-y-2 mb-3">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between">
                                                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                                                {item.productName} × {item.quantity}
                                                            </span>
                                                            <span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>
                                                                Rs. {(item.price * item.quantity).toLocaleString('en-IN')}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex justify-between pt-2 border-t border-gray-300">
                                                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        Total
                                                    </span>
                                                    <span className={`text-lg font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                                        Rs. {order.totalAmount.toLocaleString('en-IN')}
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

            {/* Sticky Pagination Footer */}
            <div className={`sticky bottom-0 w-full`}>
                <div className="max-w-4xl mx-auto">
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePrevPage={handlePrevPage}
                        handleNextPage={handleNextPage}
                        darkMode={darkMode}
                    />
                </div>
            </div>
        </div>
    );
};

export default AllOrders;