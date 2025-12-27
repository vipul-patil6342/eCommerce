import React from 'react'
import { useSelector } from 'react-redux'

const UserInfo = () => {

    const {user} = useSelector(state => state.auth);
    return (
        <div>
            {/* User Info Section */}
            <section className="bg-white p-6 md:p-8 mb-8 border border-gray-200">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Profile Information</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                        <div className="bg-linear-to-br from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-100">
                            <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <div className="bg-linear-to-br from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-100">
                            <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default UserInfo