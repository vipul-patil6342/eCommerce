import React, { useState } from 'react';
import { Heart, ShoppingBag, MapPin, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import Wishlist from '../components/Wishlist';
import UserProfile from '../components/UserProfile';

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
        <div className={`h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 flex overflow-hidden ${darkMode ? 'bg-gray-900' : ''}`}>
            {/* Sidebar */}
            <aside className={`flex flex-col h-full w-20 md:w-64 transition-all ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r p-3 md:p-6`}>
                <h3 className="hidden md:block text-sm font-bold text-gray-500 uppercase mb-6">Menu</h3>

                <div className="space-y-2 flex flex-col">
                    {menuItems.map(({ id, icon: Icon, label }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`w-full flex flex-col md:flex-row items-center md:items-center justify-center md:justify-start gap-2 px-3 md:px-4 py-3 rounded-lg text-xs md:text-sm font-semibold transition cursor-pointer ${activeTab === id
                                    ? 'bg-orange-500 text-white'
                                    : darkMode
                                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            title={label}
                        >
                            <Icon size={20} />
                            <span className="hidden md:inline">{label}</span>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="w-full mx-auto">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <UserProfile />
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <h1 className='text-center'>Working on this page..stay tuned</h1>
                    )}

                    {/* Wishlist Tab */}
                    {activeTab === 'wishlist' && (
                        <Wishlist />
                    )}
                </div>
            </main>
        </div>
    );
}

export default ProfilePage;