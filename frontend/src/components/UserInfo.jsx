import React from 'react'
import { useSelector } from 'react-redux'

const UserInfo = () => {

    const { user } = useSelector(state => state.auth);
    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";

    return (
        <div>
            {/* User Info Section */}
            <section className={`p-6 md:p-8 border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Profile Information</h2>
                <div className="space-y-6">
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-linear-to-br from-orange-50 to-amber-50 border-orange-100'}`}>
                            <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                        </div>
                    </div>
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-linear-to-br from-orange-50 to-amber-50 border-orange-100'}`}>
                            <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.email}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default UserInfo;