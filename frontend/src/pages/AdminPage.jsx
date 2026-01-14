import { useState } from 'react';
import { Home, Package, AlertCircle, ClipboardList } from 'lucide-react';
import InventoryManagement from '../components/InventoryManagement';
import { useSelector } from 'react-redux';
import AllOrders from '../components/AllOrders';
import StockAlerts from '../components/StockAlerts';
import AdminDashboard from '../components/AdminDashboard';

const AdminPage = () => {
    const [currentView, setCurrentView] = useState('dashboard');

    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'stock', label: 'Stock Alerts', icon: AlertCircle },
        { id: 'orders', label: 'Orders', icon: ClipboardList }
    ];

    return (
        <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} relative`}>
            {/* Top Navigation Bar */}
            <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-800'} sticky top-0 z-50 `}>
                <div className="px-6 py-2 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                </div>

                <nav className={`border-t ${darkMode ? 'border-gray-700' : 'border-slate-200'}`}>
                    <div className="px-6 flex items-center gap-1 overflow-x-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setCurrentView(item.id)}
                                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap cursor-pointer ${currentView === item.id
                                            ? 'border-orange-300'
                                            : `border-transparent ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div className={`min-h-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    {currentView === 'dashboard' && (
                        <AdminDashboard />
                    )}

                    {currentView === 'products' && (
                        <InventoryManagement />
                    )}

                    {currentView === 'stock' && (
                        <StockAlerts />
                    )}

                    {currentView === 'orders' && (
                        <AllOrders />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;