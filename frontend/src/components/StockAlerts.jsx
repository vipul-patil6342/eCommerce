import React, { useEffect, useState } from 'react'
import PaginationControls from './PaginationControls'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentPage } from '../features/product/productSlice';
import { CustomLoading } from './LoadingSkeleton';
import { getStockAlerts } from '../features/product/productThunk';
import { AlertCircle, Package, DollarSign } from 'lucide-react';

const StockAlerts = () => {

    const { loading, currentPage, totalPages, error, items } = useSelector(state => state.products);
    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";

    const [threshold, setThreshold] = useState(20);
    const dispatch = useDispatch();

    useEffect(() => {
        const timeout = setTimeout(() => {
            dispatch(getStockAlerts({
                threshold,
                currentPage,
                size: 10
            }));
        }, 1000);

        return () => clearTimeout(timeout);
    }, [dispatch, threshold, currentPage]);

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

    const handleThresholdChange = (e) => {
        const value = e.target.value;
        if (value === '' || parseInt(value) >= 0) {
            setThreshold(value === '' ? '' : parseInt(value));
        }
    }

    const getStockStatusColor = (stock) => {
        if (stock <= 3) return darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800';
        if (stock <= 7) return darkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-800';
        return darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800';
    };

    const getStockBarColor = (stock) => {
        if (stock <= 10) return 'bg-red-500';
        if (stock <= 20) return 'bg-orange-500';
        return 'bg-yellow-500';
    };

    if (loading) {
        return <CustomLoading darkMode={darkMode} />;
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
        <div className={`w-full min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

                {/* Threshold Control */}
                <div className={`rounded-lg shadow-sm p-4 w-full sm:w-72 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Stock Threshold
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={threshold}
                            onChange={handleThresholdChange}
                            onBlur={() => setThreshold(threshold || 20)}
                            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${darkMode
                                ? 'bg-gray-700 border-gray-600 text-gray-100'
                                : 'bg-white border-gray-300 text-gray-900'
                                }`}
                        />
                    </div>
                    <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Shows products with stock below {threshold}
                    </p>
                </div>
            </div>

            {/* Products List */}
            {items && items.length > 0 ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-24">
                    <div className="space-y-3">
                        {items.map((product) => (
                            <div
                                key={product.id}
                                className={`rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden border p-4 flex items-center gap-4 ${darkMode
                                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                    : 'bg-white border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {/* Product Image */}
                                <div className={`h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} relative`}>
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package className={`w-8 h-8 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    {/* Category & Brand */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${darkMode
                                            ? 'bg-blue-900/40 text-blue-400'
                                            : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {product.category}
                                        </span>
                                        {product.brand && (
                                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${darkMode
                                                ? 'bg-purple-900/40 text-purple-400'
                                                : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                {product.brand}
                                            </span>
                                        )}
                                    </div>

                                    {/* Product Name */}
                                    <h3 className={`font-bold line-clamp-1 mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'
                                        }`}>
                                        {product.name}
                                    </h3>

                                    {/* Price & Stock Info */}
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-1">
                                            <DollarSign className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                                            <p className={`font-bold ${darkMode ? 'text-green-400' : 'text-green-600'
                                                }`}>
                                                {product.price ? product.price.toFixed(2) : 'N/A'}
                                            </p>
                                        </div>

                                        {/* Stock Status */}
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStockStatusColor(product.stock)}`}>
                                                {product.stock}
                                            </span>
                                            <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                units
                                            </span>
                                        </div>

                                        {/* Stock Progress Bar */}
                                        <div className={`w-24 rounded-full h-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'
                                            }`}>
                                            <div
                                                className={`h-2 rounded-full transition-all ${getStockBarColor(product.stock)}`}
                                                style={{ width: `${Math.min((product.stock / 20) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className={`max-w-6xl mx-auto px-4 sm:px-6 rounded-lg shadow-sm p-12 text-center mb-24 ${darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                    <AlertCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                        No Stock Alerts
                    </h3>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        All products have stock above {threshold} units. Great job!
                    </p>
                </div>
            )}

            {/* Pagination */}
            <div className={`fixed bottom-0 left-0 w-full z-50 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="w-full mx-auto py-3">
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
    )
}

export default StockAlerts;