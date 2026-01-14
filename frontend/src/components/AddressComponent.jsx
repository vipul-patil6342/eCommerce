import { MapPin, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createAddress, getAddresses } from '../features/address/addressThunk';
import { selectAllAddresses } from '../features/address/addressSlice';
import AddressCard from './AddressCard';
import { showSuccess } from '../utils/toast';

const AddressComponent = () => {
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [errors, setErrors] = useState({});

    const [addressData, setAddressData] = useState({
        house: "",
        street: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        phone: "",
        defaultAddress: false
    });

    const { loading } = useSelector(state => state.address);
    const addresses = useSelector(selectAllAddresses);

    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAddresses());
    },[dispatch]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddressData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!addressData.house.trim()) newErrors.house = "House/Building is required";
        if (!addressData.street.trim()) newErrors.street = "Street is required";
        if (!addressData.city.trim()) newErrors.city = "City is required";
        if (!addressData.state.trim()) newErrors.state = "State is required";
        if (!addressData.country.trim()) newErrors.country = "Country is required";
        if (!addressData.pincode.trim()) newErrors.pincode = "Pincode is required";
        if (!addressData.phone.trim()) newErrors.phone = "Phone number is required";
        
        // Validate phone format (basic validation for 10 digits)
        if (addressData.phone.trim() && !/^\d{10}$/.test(addressData.phone.replace(/\D/g, ''))) {
            newErrors.phone = "Phone number must be valid (10 digits)";
        }

        // Validate pincode format (basic validation)
        if (addressData.pincode.trim() && !/^\d{4,6}$/.test(addressData.pincode)) {
            newErrors.pincode = "Pincode must be 4-6 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        const resultAction = await dispatch(createAddress(addressData));
        if (createAddress.fulfilled.match(resultAction)) {
            showSuccess("Address created");
            setAddressData({
                house: "",
                street: "",
                city: "",
                state: "",
                country: "",
                pincode: "",
                phone: "",
                defaultAddress: false
            });
            setShowAddAddress(false);
            setErrors({});
        }
    }

    return (
        <div>{/* Addresses Section */}
            <section className={`p-6 md:p-8 border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Saved Addresses</h2>
                    <button
                        onClick={() => {
                            setShowAddAddress(!showAddAddress);
                            setErrors({});
                        }}
                        title='Add Address'
                        className="px-4 py-2 cursor-pointer flex bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold transition"
                    >
                        {showAddAddress ? 'Cancel' : <Plus size={16} />}
                    </button>
                </div>

                {/* Add Address Form */}
                {showAddAddress && (
                    <div className={`border-2 border-orange-500 rounded-xl p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-linear-to-br from-orange-50 to-amber-50'}`}>
                        <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Add New Address</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>House / Building</label>
                                    <input
                                        type="text"
                                        name='house'
                                        value={addressData.house}
                                        onChange={handleInputChange}
                                        placeholder="Enter house/building number"
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.house ? 'border-red-500' : darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'}`}
                                    />
                                    {errors.house && <p className="text-red-500 text-sm mt-1">{errors.house}</p>}
                                </div>
                                <div>
                                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Street</label>
                                    <input
                                        type="text"
                                        name='street'
                                        value={addressData.street}
                                        onChange={handleInputChange}
                                        placeholder="Enter street name"
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.street ? 'border-red-500' : darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'}`}
                                    />
                                    {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>City</label>
                                    <input
                                        type="text"
                                        name='city'
                                        value={addressData.city}
                                        onChange={handleInputChange}
                                        placeholder="Enter city"
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.city ? 'border-red-500' : darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'}`}
                                    />
                                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                </div>
                                <div>
                                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>State</label>
                                    <input
                                        type="text"
                                        name='state'
                                        value={addressData.state}
                                        onChange={handleInputChange}
                                        placeholder="Enter state"
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.state ? 'border-red-500' : darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'}`}
                                    />
                                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Country</label>
                                    <input
                                        type="text"
                                        name='country'
                                        value={addressData.country}
                                        onChange={handleInputChange}
                                        placeholder="Enter country"
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.country ? 'border-red-500' : darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'}`}
                                    />
                                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                                </div>
                                <div>
                                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pincode</label>
                                    <input
                                        type="text"
                                        name='pincode'
                                        value={addressData.pincode}
                                        onChange={handleInputChange}
                                        placeholder="Enter pincode"
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.pincode ? 'border-red-500' : darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'}`}
                                    />
                                    {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number</label>
                                <input
                                    type="tel"
                                    name='phone'
                                    value={addressData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter phone number"
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.phone ? 'border-red-500' : darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'}`}
                                />
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    name="defaultAddress"
                                    checked={addressData.defaultAddress}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
                                />
                                <label htmlFor="defaultAddress" className={`text-sm font-semibold cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Set as default address
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="px-6 py-2 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold transition"
                                >
                                    Add Address
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAddAddress(false);
                                        setErrors({});
                                    }}
                                    className={`px-6 py-2 rounded-lg font-semibold transition ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Address List */}
                {loading && <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading addresses...</p>}
                {addresses.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <MapPin size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} />
                        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No addresses added yet</p>
                    </div>
                )}
                {addresses.length > 0 && (
                    <div className="space-y-4">
                        {addresses.map(address => (
                            <AddressCard key={address.id} address={address} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

export default AddressComponent;