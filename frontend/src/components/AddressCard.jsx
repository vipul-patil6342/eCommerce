import React, { useState } from 'react';
import { Check, Edit2, Trash2, MapPin } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAddress, getAddresses, setDefaultAddress, updateAddress } from '../features/address/addressThunk';
import { showSuccess } from '../utils/toast';

const AddressCard = ({ address }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(address);

    const {theme} = useSelector(state => state.theme);
    const darkMode = theme === "dark";

    const dispatch = useDispatch();

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            const resultAction = await dispatch(deleteAddress(address.id));
            if (deleteAddress.fulfilled.match(resultAction)) {
                showSuccess("Address deleted successfully");
                dispatch(getAddresses());
            }
        }
    };

    const handleSetDefault = () => {
        dispatch(setDefaultAddress(address.id));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSaveEdit = async () => {
        const resultAction = await dispatch(updateAddress({ addressId: address.id, addressData: editData }));
        if (updateAddress.fulfilled.match(resultAction)) {
            setIsEditing(false);
            dispatch(getAddresses);
        }
    };

    if (isEditing) {
        return (
            <div className={`border-2 border-orange-500 rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-linear-to-br from-orange-50 to-amber-50'}`}>
                <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Edit Address</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>House / Building</label>
                            <input
                                type="text"
                                name="house"
                                value={editData.house}
                                onChange={handleInputChange}
                                placeholder="Enter house/building number"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'}`}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Street</label>
                            <input
                                type="text"
                                name="street"
                                value={editData.street}
                                onChange={handleInputChange}
                                placeholder="Enter street name"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'}`}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>City</label>
                            <input
                                type="text"
                                name="city"
                                value={editData.city}
                                onChange={handleInputChange}
                                placeholder="Enter city"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'}`}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>State</label>
                            <input
                                type="text"
                                name="state"
                                value={editData.state}
                                onChange={handleInputChange}
                                placeholder="Enter state"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'}`}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Country</label>
                            <input
                                type="text"
                                name="country"
                                value={editData.country}
                                onChange={handleInputChange}
                                placeholder="Enter country"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'}`}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pincode</label>
                            <input
                                type="text"
                                name="pincode"
                                value={editData.pincode}
                                onChange={handleInputChange}
                                placeholder="Enter pincode"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'}`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={editData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter phone number"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'}`}
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            id={`defaultAddress-${address.id}`}
                            name="defaultAddress"
                            checked={editData.defaultAddress}
                            onChange={handleInputChange}
                            className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
                        />
                        <label htmlFor={`defaultAddress-${address.id}`} className={`text-sm font-semibold cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Set as default address
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleSaveEdit}
                            className="px-6 py-2 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg hover:shadow-orange-200 font-semibold transition"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setEditData(address);
                            }}
                            className={`px-6 py-2 rounded-lg font-semibold transition ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`border rounded-xl p-5 transition duration-300 ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-900/20' : 'bg-white border-gray-200 hover:shadow-lg hover:border-orange-200'}`}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{address.house}</h4>
                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{address.street}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{address.city}, {address.state} {address.pincode}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{address.country}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone: {address.phone}</p>
                </div>
                {address.defaultAddress && (
                    <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                        <Check size={14} />
                        Default
                    </div>
                )}
            </div>

            <div className={`flex gap-3 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 text-orange-600 hover:text-orange-500 text-sm font-semibold transition"
                >
                    <Edit2 size={16} />
                    Edit
                </button>
                <button
                    onClick={handleDelete}
                    className="flex items-center gap-1.5 text-red-600 hover:text-red-500 text-sm font-semibold transition"
                >
                    <Trash2 size={16} />
                    Delete
                </button>
                {!address.defaultAddress && (
                    <button
                        onClick={handleSetDefault}
                        className={`flex items-center gap-1.5 text-sm font-semibold transition ml-auto ${darkMode ? 'text-gray-400 hover:text-orange-500' : 'text-gray-600 hover:text-orange-600'}`}
                    >
                        <MapPin size={16} />
                        Set Default
                    </button>
                )}
            </div>
        </div>
    );
};

export default AddressCard;