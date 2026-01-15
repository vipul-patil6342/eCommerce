import React, { useEffect, useState } from 'react'
import { getDashboardSummary, getProductsCountByCategory } from '../features/dashboard/dashboardThunk'
import { useDispatch, useSelector } from 'react-redux';

const AdminDashboard = () => {
    const { filtered, totals, loading, error, productsByCategory } = useSelector(state => state.dashboard);
    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";
    const [selectedRange, setSelectedRange] = useState("WEEK");

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getDashboardSummary({ range: selectedRange }));
        dispatch(getProductsCountByCategory());
    }, [dispatch, selectedRange]);

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

    const rangeOptions = [
        { value: "WEEK", label: "Week" },
        { value: "MONTH", label: "Month" },
        { value: "YEAR", label: "Year" }
    ];

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-linear-to-br from-slate-50 to-slate-100'} p-6`}>
            <div className="max-w-7xl mx-auto">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mb-8`}>
                    Dashboard
                </h1>

                <div className="mb-8">
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'} mb-4`}>
                        All Time Data
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-md hover:shadow-lg transition-shadow p-6`}>
                            <h3 className={`text-sm md:text-base font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-3`}>
                                Total Products
                            </h3>
                            <p className={`text-sm md:text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                {totals?.totalProducts || 0}
                            </p>
                        </div>

                        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-md hover:shadow-lg transition-shadow p-6`}>
                            <h3 className={`text-sm md:text-base font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-3`}>
                                Total Users
                            </h3>
                            <p className={`text-sm md:text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                {totals?.totalUsers || 0}
                            </p>
                        </div>

                        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-md hover:shadow-lg transition-shadow p-6`}>
                            <h3 className={`text-sm md:text-base font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-3`}>
                                Lifetime Revenue
                            </h3>
                            <p className={`text-sm md:text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                ₹ {totals?.totalRevenue || 0}
                            </p>
                        </div>

                        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-md hover:shadow-lg transition-shadow p-6`}>
                            <h3 className={`text-sm md:text-base font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-3`}>
                                Total Orders
                            </h3>
                            <p className={`text-sm md:text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                {totals?.totalOrders || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'} mb-4 md:mb-0`}>
                            Period Analytics
                        </h2>

                        <div className="flex gap-2">
                            {rangeOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setSelectedRange(option.value)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${selectedRange === option.value
                                        ? darkMode
                                            ? 'bg-orange-600 text-white'
                                            : 'bg-orange-500 text-white'
                                        : darkMode
                                            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-md hover:shadow-lg transition-shadow p-6`}>
                            <h3 className={`text-sm md:text-base font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-3`}>
                                Products Added
                            </h3>
                            <p className={`text-sm md:text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                {filtered?.totalProducts || 0}
                            </p>
                        </div>

                        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-md hover:shadow-lg transition-shadow p-6`}>
                            <h3 className={`text-sm md:text-base font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-3`}>
                                New Users
                            </h3>
                            <p className={`text-sm md:text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                {filtered?.totalUsers || 0}
                            </p>
                        </div>

                        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-md hover:shadow-lg transition-shadow p-6`}>
                            <h3 className={`text-sm md:text-base font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-3`}>
                                Period Revenue
                            </h3>
                            <p className={`text-sm md:text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                ₹ {filtered?.totalRevenue || 0}
                            </p>
                        </div>

                        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-md hover:shadow-lg transition-shadow p-6`}>
                            <h3 className={`text-sm md:text-base font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-3`}>
                                Period Orders
                            </h3>
                            <p className={`text-sm md:text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                {filtered?.totalOrders || 0}
                            </p>
                        </div>
                    </div>

                    {/* Products by Category - Table View */}
                    {productsByCategory && productsByCategory.length > 0 && (
                        <div className={`mt-8 mb-12 ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'} mb-6`}>
                                Products by Category
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className={`border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                            <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                Category
                                            </th>
                                            <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                Total Products
                                            </th>
                                            <th className={`text-left py-3 px-4 font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                Percentage
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productsByCategory.map((category, index) => {
                                            const percentage = totals.totalProducts > 0 ? ((category.totalProducts / totals.totalProducts) * 100).toFixed(2) : 0;
                                            return (
                                                <tr key={index} className={`border-b ${darkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-100 hover:bg-slate-50'} transition-colors`}>
                                                    <td className={`py-3 px-4 flex items-center gap-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                        <span 
                                                            className="w-3 h-3 rounded-full" 
                                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                        ></span>
                                                        {category.categoryName}
                                                    </td>
                                                    <td className={`py-3 px-4 font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                                        {category.totalProducts}
                                                    </td>
                                                    <td className={`py-3 px-4 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                        {percentage}%
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard