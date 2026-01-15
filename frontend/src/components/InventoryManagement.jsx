import { useEffect, useState } from 'react';
import { Trash2, Edit2, Plus, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, deleteProduct, searchProduct, updateProduct } from '../features/product/productThunk';
import { showSuccess } from '../utils/toast';

const InventoryManagement = () => {

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        stock: '',
        price: '',
        category: '',
        image: null,
        imageUrl: null,
        brand: ''
    });

    const { items, loading, error } = useSelector(state => state.products);
    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";

    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['Electronics', 'Accessories', 'Clothing', 'Food & Beverage', 'Books', 'Home & Garden', 'Sports', 'Toys'];

    const dispatch = useDispatch();

    useEffect(() => {
        if (!searchTerm.trim()) return;

        const delay = setTimeout(() => {
            dispatch(searchProduct({ searchTerm }));
        }, 500);

        return () => clearTimeout(delay)
    }, [searchTerm, dispatch])

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    image: file,
                    imageUrl: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.category || !formData.description || !formData.price || !formData.stock || !formData.brand) {
            alert("All fields are required");
            return;
        }

        const multipartData = new FormData();

        multipartData.append(
            "product",
            new Blob(
                [
                    JSON.stringify({
                        name: formData.name,
                        brand: formData.brand,
                        description: formData.description,
                        category: formData.category,
                        stock: Number(formData.stock),
                        price: Number(formData.price)
                    }),
                ],
                { type: "application/json" }
            )
        );

        if (formData.image) {
            multipartData.append("image", formData.image)
        }

        let resultAction;

        if (editingId) {
            resultAction = await dispatch(updateProduct({
                id: editingId,
                formData: multipartData
            }))
        } else {
            resultAction = await dispatch(addProduct(multipartData));
        }

        if (resultAction.meta.requestStatus === "fulfilled") {
            showSuccess("Product added successfully");
            setFormData({
                name: '',
                brand: '',
                description: '',
                stock: '',
                price: '',
                category: '',
                image: null,
                imageUrl: null
            });

            setEditingId(null);
            setShowForm(false);
        }
    }

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            brand: product.brand,
            description: product.description,
            stock: String(product.stock || ''),
            price: String(product.price || ''),
            category: product.category,
            image: null,
            imageUrl: product.imageUrl,
        });
        setEditingId(product.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            const resultAction = await dispatch(deleteProduct({ id }));
            if (deleteProduct.fulfilled.match(resultAction)) {
                showSuccess("Product deleted successfully")
            } else {
                showError(error);
            }
        }
    };

    const handleCancel = () => {
        setFormData({ name: '', description: '', stock: '', price: '', category: '', image: null, imageUrl: null, brand: '' });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 p-4 sm:p-6 lg:p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto">

                {/* Search Bar and Add Button */}
                <div className="flex gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Search by product name or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`flex-1 px-4 py-2.5 text-sm border rounded-lg focus:outline-none ${darkMode
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            }`}
                    />
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center justify-center bg-orange-500 text-white px-3 py-2.5 rounded-lg hover:bg-orange-600 cursor-pointer transition font-medium text-sm sm:px-4 sm:gap-2"
                            title="Add Product"
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">Add Product</span>
                        </button>
                    )}
                </div>

                {/* Form */}
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div
                            className={`relative w-full max-w-2xl rounded-xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh]
                ${darkMode
                                    ? 'bg-gray-800 border-gray-700'
                                    : 'bg-white border-gray-200'
                                }`}
                        >
                            {/* Header */}
                            <div className={`sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b flex-shrink-0
                                ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                            `}>
                                <h2 className={`text-lg sm:text-xl font-semibold
                                    ${darkMode ? 'text-white' : 'text-gray-900'}
                                `}>
                                    {editingId ? 'Edit Product' : 'Add New Product'}
                                </h2>

                                <button
                                    onClick={handleCancel}
                                    className={`p-1 rounded transition
                                        ${darkMode
                                            ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            {/* Form Body - Scrollable */}
                            <div className="flex-1 overflow-y-auto px-5 py-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    <input
                                        name="name"
                                        placeholder="Product Name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2.5 rounded-lg border text-sm transition
                                            ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                                            } focus:outline-none`}
                                    />

                                    <input
                                        name="brand"
                                        placeholder="Brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2.5 rounded-lg border text-sm transition
                                            ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                                            } focus:outline-none`}
                                    />

                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2.5 rounded-lg border text-sm transition
                                            ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                                                : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                                            } focus:outline-none`}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>

                                    <input
                                        name="stock"
                                        placeholder="Quantity"
                                        value={formData.stock}
                                        onChange={e =>
                                            setFormData(p => ({
                                                ...p,
                                                stock: e.target.value.replace(/\D/g, '')
                                            }))
                                        }
                                        className={`w-full px-3 py-2.5 rounded-lg border text-sm transition
                                            ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                                            } focus:outline-none`}
                                    />

                                    <input
                                        name="price"
                                        placeholder="Price"
                                        value={formData.price}
                                        onChange={e =>
                                            setFormData(p => ({
                                                ...p,
                                                price: e.target.value.replace(/[^0-9.]/g, '')
                                            }))
                                        }
                                        className={`w-full px-3 py-2.5 rounded-lg border text-sm transition
                                            ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                                            } focus:outline-none`}
                                    />

                                    <textarea
                                        name="description"
                                        rows="3"
                                        placeholder="Description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2.5 rounded-lg border text-sm resize-none transition sm:col-span-2
                                            ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                                            } focus:outline-none`}
                                    />

                                    {/* Image Upload */}
                                    <div className="sm:col-span-2 flex items-center gap-3">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className={`flex-1 px-3 py-2.5 text-sm border rounded-lg cursor-pointer transition
                                                ${darkMode
                                                    ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                                                    : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                                                } focus:outline-none`}
                                        />

                                        {formData.imageUrl && (
                                            <img
                                                src={formData.imageUrl}
                                                alt="Preview"
                                                className={`h-12 w-12 rounded object-cover border shrink-0
                                                    ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className={`sticky bottom-0 px-5 py-4 border-t flex flex-col sm:flex-row gap-3 shrink-0
                                ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                            `}>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className={`flex-1 text-white py-2.5 rounded-lg font-medium transition
                                        ${loading
                                            ? 'bg-green-500 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700 active:scale-95'
                                        }`}
                                >
                                    {loading
                                        ? editingId ? 'Updating...' : 'Adding...'
                                        : editingId ? 'Update Product' : 'Add Product'
                                    }
                                </button>

                                <button
                                    onClick={handleCancel}
                                    className={`flex-1 py-2.5 rounded-lg font-medium transition
                                        ${darkMode
                                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 active:scale-95'
                                            : 'bg-gray-300 text-gray-800 hover:bg-gray-400 active:scale-95'
                                        }`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table Container */}
                <div className={`rounded-lg shadow-md overflow-hidden border transition ${darkMode
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                    }`}>

                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`border-b ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>
                                    <th className={`px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Image</th>
                                    <th className={`px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Product Name</th>
                                    <th className={`px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</th>
                                    <th className={`px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</th>
                                    <th className={`px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Quantity</th>
                                    <th className={`px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Price</th>
                                    <th className={`px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className={`px-6 py-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            No items found. Add one to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    items.map(product => (
                                        <tr key={product.id} className={`border-b transition ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                                            <td className="px-4 sm:px-6 py-4">
                                                {product.imageUrl ? (
                                                    <img src={product.imageUrl} alt={product.name} className="h-10 w-10 rounded object-cover" />
                                                ) : (
                                                    <div className={`h-10 w-10 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                                )}
                                            </td>
                                            <td className={`px-4 sm:px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{product.name}</td>
                                            <td className={`px-4 sm:px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{product.description.substring(0, 30)}</td>
                                            <td className={`px-4 sm:px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{product.category}</td>
                                            <td className={`px-4 sm:px-6 py-4 text-sm text-right font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{product.stock}</td>
                                            <td className={`px-4 sm:px-6 py-4 text-sm text-right font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{product.price.toFixed(2)}</td>
                                            <td className="px-4 sm:px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className={`text-blue-600 hover:text-blue-800 transition p-1 ${darkMode ? 'hover:text-blue-400' : ''}`}
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className={`text-red-600 hover:text-red-800 transition p-1 ${darkMode ? 'hover:text-red-400' : ''}`}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden">
                        {items.length === 0 ? (
                            <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                No items found. Add one to get started.
                            </div>
                        ) : (
                            <div className={`${darkMode ? 'divide-gray-700' : 'divide-gray-200'} divide-y`}>
                                {items.map(product => (
                                    <div key={product.id} className={`p-4 transition ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <div className="flex gap-3 items-start">
                                                    {product.imageUrl ? (
                                                        <img src={product.imageUrl} alt={product.name} className="h-12 w-12 rounded object-cover" />
                                                    ) : (
                                                        <div className={`h-12 w-12 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                                    )}
                                                    <div>
                                                        <h3 className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>{product.name}</h3>
                                                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{product.description.substring(0, 40)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ml-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className={`text-blue-600 hover:text-blue-800 transition p-2 rounded ${darkMode ? 'hover:bg-gray-600 hover:text-blue-400' : 'hover:bg-blue-50'}`}
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className={`text-red-600 hover:text-red-800 transition p-2 rounded ${darkMode ? 'hover:bg-gray-600 hover:text-red-400' : 'hover:bg-red-50'}`}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            <div>
                                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Category</p>
                                                <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{product.category}</p>
                                            </div>
                                            <div>
                                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Quantity</p>
                                                <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{product.stock}</p>
                                            </div>
                                            <div>
                                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Price</p>
                                                <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>₹{product.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InventoryManagement;