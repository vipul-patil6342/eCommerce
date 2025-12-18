import { useState, useRef, useEffect } from 'react';
import { Search, User, ShoppingBag, Moon, Sun, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../features/theme/themeSlice';
import SidebarLayout from './SidebarLayout';
import { searchProduct } from '../features/product/ProductThunk';

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [openSidebar, setOpenSidebar] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const { isAuthenticated } = useSelector(state => state.auth);
    const theme = useSelector(state => state.theme.theme);
    const darkMode = theme === "dark";

    const dispatch = useDispatch();

    const searchRef = useRef(null);

    useEffect(() => {
        if (showSearch) {
            searchRef.current?.focus();
        }
    }, [showSearch]);

    useEffect(() => {
        if (searchTerm) {
            const delay = setTimeout(() => {
                dispatch(searchProduct({ searchTerm }))
            }, 1500);

            return () => clearTimeout(delay);
        }
    }, [dispatch, searchTerm]);

    return (
        <>
            <nav
                className={`sticky top-0 z-50 w-full transition-colors duration-300
                ${darkMode
                        ? 'bg-gray-900 border-b border-gray-800 shadow-lg'
                        : 'bg-white border-b border-gray-100 shadow-sm'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 py-4 relative overflow-hidden">
                    <div className="flex items-center justify-between gap-8">

                        {/* Logo */}
                        <div className="shrink-0">
                            <span
                                className="text-3xl font-black tracking-tight"
                                style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}
                            >
                                <span className="bg-linear-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                                    Bazaar
                                </span>
                            </span>
                        </div>

                        {/* Right Icons */}
                        <div className="flex items-center gap-4 relative">

                            {isAuthenticated && (
                                <>
                                    <button
                                        onClick={() => setShowSearch(true)}
                                        className={`p-2 transition-colors
                                                ${darkMode
                                                ? 'text-gray-300 hover:text-orange-500'
                                                : 'text-gray-700 hover:text-orange-600'
                                            }`}
                                        aria-label="Search"
                                    >
                                        <Search className="w-5 h-5" />
                                    </button>
                                    <button
                                        className={`p-2 transition-colors
                                        ${darkMode
                                                ? 'text-gray-300 hover:text-orange-500'
                                                : 'text-gray-700 hover:text-orange-600'
                                            }`}
                                        aria-label="Shopping Cart"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                    </button>

                                    <button
                                        className={`p-2 transition-colors
                                        ${darkMode
                                                ? 'text-gray-300 hover:text-orange-500'
                                                : 'text-gray-700 hover:text-orange-600'
                                            }`}
                                        aria-label="User Account"
                                        onClick={() => setOpenSidebar(true)}
                                    >
                                        <User className="w-5 h-5" />
                                    </button>
                                </>
                            )}

                            {/* Theme Toggle */}
                            <button
                                onClick={() => dispatch(toggleTheme())}
                                className={`p-2 transition-colors
                                ${darkMode
                                        ? 'text-yellow-400 hover:text-yellow-500'
                                        : 'text-gray-700 hover:text-orange-600'
                                    }`}
                                aria-label="Toggle Dark Mode"
                            >
                                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* 🔍 Sliding Search Bar */}
                    <div
                        className={`absolute top-0 right-0 h-full flex items-center px-6
                        transition-all duration-300 ease-in-out
                        ${showSearch
                                ? 'translate-x-0 opacity-100'
                                : 'translate-x-full opacity-0 pointer-events-none'
                            }
                        ${darkMode ? 'bg-gray-900' : 'bg-white'}
                        w-full md:w-1/2`}
                    >
                        <div className="flex items-center w-full gap-3">
                            <input
                                ref={searchRef}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search products..."
                                className={`w-full px-4 py-2 rounded-md outline-none border
                                ${darkMode
                                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                                        : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
                                    }`}
                            />

                            <button
                                onClick={() => setShowSearch(false)}
                                className={`p-2
                                ${darkMode
                                        ? 'text-gray-300 hover:text-red-400'
                                        : 'text-gray-700 hover:text-red-500'
                                    }`}
                                aria-label="Close Search"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                </div>
            </nav>

            <SidebarLayout isOpen={openSidebar} onClose={() => setOpenSidebar(false)} />
        </>
    );
};

export default Navbar;
