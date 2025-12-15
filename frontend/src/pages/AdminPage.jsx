import { useState } from 'react';
import { Menu, Home, Package, AlertCircle, TrendingUp, LogOut, Moon, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/auth/authThunk';

const AdminPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentView, setCurrentView] = useState('dashboard');

    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";

    const dispatch = useDispatch();

    const handleLogoutClick = async () => {
        const resultAction = await dispatch(logoutUser());
        if (logoutUser.fulfilled.match(resultAction)) {
            navigate("/login");
            console.log("logout successfully");
        }
    }

    return (
        <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} ${darkMode ? 'bg-slate-900' : 'bg-slate-800'} text-white transition-all duration-300 flex flex-col`}>
                <div className={`p-4 ${darkMode ? 'border-slate-800' : 'border-slate-700'} border-b flex items-center justify-between`}>
                    {sidebarOpen && <h1 className="text-xl font-bold">Admin</h1>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2 rounded-lg transition ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-700'}`}>
                        <Menu size={20} />
                    </button>
                </div>

                <nav className="flex-1 py-4 px-4 space-y-2">
                    <button
                        onClick={() => setCurrentView('dashboard')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${currentView === 'dashboard' ? 'bg-blue-600' : darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-700'}`}
                    >
                        <Home size={20} />
                        {sidebarOpen && <span>Dashboard</span>}
                    </button>

                    {sidebarOpen && <p className="text-xs font-semibold text-slate-400 uppercase mt-4 mb-2">Inventory</p>}
                    <button
                        onClick={() => setCurrentView('products')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${currentView === 'products' ? 'bg-blue-600' : darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-700'}`}
                    >
                        <Package size={20} />
                        {sidebarOpen && <span>Products</span>}
                    </button>

                    {sidebarOpen && <p className="text-xs font-semibold text-slate-400 uppercase mt-4 mb-2">Analytics</p>}
                    <button
                        onClick={() => setCurrentView('stock')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${currentView === 'stock' ? 'bg-blue-600' : darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-700'}`}
                    >
                        <AlertCircle size={20} />
                        {sidebarOpen && <span>Stock Alerts</span>}
                    </button>
                    <button
                        onClick={() => setCurrentView('sales')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${currentView === 'sales' ? 'bg-blue-600' : darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-700'}`}
                    >
                        <TrendingUp size={20} />
                        {sidebarOpen && <span>Sales</span>}
                    </button>
                </nav>

                <div className={`p-4 ${darkMode ? 'border-slate-800' : 'border-slate-700'} border-t`}>
                    <button onClick={handleLogoutClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-700'}`}>
                        <LogOut size={20} />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-8 flex items-center justify-between`}>
                    <div>
                        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {currentView === 'dashboard' && 'Dashboard'}
                            {currentView === 'products' && 'Products'}
                            {currentView === 'stock' && 'Stock Alerts'}
                            {currentView === 'sales' && 'Sales Analytics'}
                        </h1>
                        <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {currentView === 'dashboard' && 'Welcome to your inventory management system'}
                            {currentView === 'products' && 'Manage your product inventory'}
                            {currentView === 'stock' && 'Monitor low and out of stock items'}
                            {currentView === 'sales' && 'View sales and inventory analytics'}
                        </p>
                    </div>

                </div>

                {/* Content Area */}
                <div className={`flex-1 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        {currentView === 'dashboard' && (
                            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow border p-8`}>
                                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Dashboard content goes here</p>
                            </div>
                        )}

                        {currentView === 'products' && (
                            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow border p-8`}>
                                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Products content goes here</p>
                            </div>
                        )}

                        {currentView === 'stock' && (
                            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow border p-8`}>
                                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Stock alerts content goes here</p>
                            </div>
                        )}

                        {currentView === 'sales' && (
                            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow border p-8`}>
                                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Sales analytics content goes here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;