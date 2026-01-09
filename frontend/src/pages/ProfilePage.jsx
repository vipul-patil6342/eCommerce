import React, { useState } from 'react';
import { Heart, ShoppingBag, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import Wishlist from '../components/Wishlist';
import UserProfile from '../components/UserProfile';
import MyOrders from '../components/MyOrders';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";

    const menuItems = [
        { id: 'profile', icon: User, label: 'Profile' },
        { id: 'orders', icon: ShoppingBag, label: 'My Orders' },
        { id: 'wishlist', icon: Heart, label: 'My Wishlist' }
    ];

    return (
        <div className={`h-screen flex flex-col md:flex-row ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            {/* Sidebar */}
            <aside className={`w-full md:w-64 md:h-[calc(100vh-64px)] md:sticky md:top-16 border-b md:border-b-0 md:border-r p-4 md:p-6 shrink-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>                <nav className="flex md:flex-col gap-2 w-full">
                {menuItems.map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex flex-1 md:flex-none items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === id
                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                            : darkMode
                                ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        <Icon size={18} />
                        <span className="hidden md:block">{label}</span>
                    </button>
                ))}
            </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {activeTab === 'profile' && <UserProfile />}
                {activeTab === 'orders' && <MyOrders />}
                {activeTab === 'wishlist' && <Wishlist />}
            </main>
        </div>
    );
}

export default ProfilePage;