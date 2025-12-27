import { MapPin } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createAddress, getAddresses } from '../features/address/addressThunk';
import { selectAllAddresses } from '../features/address/addressSlice';

const AddressComponent = () => {
    const [showAddAddress, setShowAddAddress] = useState(false);

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

    console.log(addresses)

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddressData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async () => {
        const resultAction = await dispatch(createAddress(addressData));
        if (createAddress.fulfilled.match(resultAction)) {
            console.log("Address created");
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
        }
    }

    return (
        <div>{/* Addresses Section */}
            <section className="bg-white p-6 md:p-8 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Saved Addresses</h2>
                    <button
                        onClick={() => setShowAddAddress(!showAddAddress)}
                        title='Add Address'
                        className="px-4 py-2 cursor-pointer flex bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold transition"
                    >
                        {showAddAddress ? 'Cancel' : '+'}
                    </button>
                </div>

                {/* Add Address Form */}
                {showAddAddress && (
                    <div className="border-2 border-orange-500 rounded-xl p-6 bg-linear-to-br from-orange-50 to-amber-50 mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Address</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">House / Building</label>
                                    <input
                                        type="text"
                                        name='house'
                                        value={addressData.house}
                                        onChange={handleInputChange}
                                        placeholder="Enter house/building number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Street</label>
                                    <input
                                        type="text"
                                        name='street'
                                        value={addressData.street}
                                        onChange={handleInputChange}
                                        placeholder="Enter street name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                                    <input
                                        type="text"
                                        name='city'
                                        value={addressData.city}
                                        onChange={handleInputChange}
                                        placeholder="Enter city"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                                    <input
                                        type="text"
                                        name='state'
                                        value={addressData.state}
                                        onChange={handleInputChange}
                                        placeholder="Enter state"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                                    <input
                                        type="text"
                                        name='country'
                                        value={addressData.country}
                                        onChange={handleInputChange}
                                        placeholder="Enter country"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                                    <input
                                        type="text"
                                        name='pincode'
                                        value={addressData.pincode}
                                        onChange={handleInputChange}
                                        placeholder="Enter pincode"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    name='phone'
                                    value={addressData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter phone number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    name="defaultAddress"
                                    checked={addressData.defaultAddress}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
                                />
                                <label htmlFor="defaultAddress" className="text-sm font-semibold text-gray-700 cursor-pointer">
                                    Set as default address
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleSubmit}
                                    className="px-6 py-2 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg hover:shadow-orange-200 font-semibold transition"
                                >
                                    Add Address
                                </button>
                                <button
                                    onClick={() => setShowAddAddress(false)}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Address List */}
                {loading && <p className="text-center text-gray-500">Loading addresses...</p>}
                {addresses.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">No addresses added yet</p>
                    </div>
                )}
                {addresses.length > 0 && (
                    <div className="space-y-4">
                        {addresses.map(address => (
                            <p key={address.id}>{address.house}, {address.city}, {address.defaultAddress}</p>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

export default AddressComponent;