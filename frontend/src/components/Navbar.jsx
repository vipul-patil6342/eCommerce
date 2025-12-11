import { Search, User, ShoppingBag, Moon, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../features/theme/themeSlice';

const Navbar = () => {
    const { isAuthenticated } = useSelector(state => state.auth);
    const theme = useSelector(state => state.theme.theme);

    const darkMode = theme === "dark";
    const dispatch = useDispatch();

    return (
        <nav className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
            darkMode
                ? 'bg-gray-900 border-b border-gray-800 shadow-lg'
                : 'bg-white border-b border-gray-100 shadow-sm'
        }`}>
            <div className="max-w-7xl mx-auto px-6 py-4">
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

                    {/* Search Bar (Desktop) */}
                    {isAuthenticated && (
                        <div className="hidden lg:flex flex-1 max-w-md">
                            <div className="w-full relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className={`w-full px-4 py-2.5 pl-10 rounded-lg text-sm transition-all outline-none border-0 focus:ring-0 focus:ring-offset-0 ${
                                        darkMode
                                            ? 'bg-gray-800 text-white placeholder-gray-400 focus:bg-gray-700'
                                            : 'bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-gray-50'
                                    }`}
                                />
                                <Search
                                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                                        darkMode ? 'text-gray-500' : 'text-gray-400'
                                    }`}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-6">
                        {/* Icons only if authenticated */}
                        {isAuthenticated && (
                            <>
                                <button
                                    className={`relative p-2 transition-colors duration-200 ${
                                        darkMode
                                            ? 'text-gray-300 hover:text-orange-500'
                                            : 'text-gray-700 hover:text-orange-600'
                                    }`}
                                    aria-label="Shopping Cart"
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                </button>

                                <button
                                    className={`relative p-2 transition-colors duration-200 ${
                                        darkMode
                                            ? 'text-gray-300 hover:text-orange-500'
                                            : 'text-gray-700 hover:text-orange-600'
                                    }`}
                                    aria-label="User Account"
                                >
                                    <User className="w-5 h-5" />
                                </button>
                            </>
                        )}

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            className={`relative p-2 transition-colors duration-200 ${
                                darkMode
                                    ? 'text-yellow-400 hover:text-yellow-500'
                                    : 'text-gray-700 hover:text-orange-600'
                            }`}
                            aria-label="Toggle Dark Mode"
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {isAuthenticated && (
                    <div className="lg:hidden mt-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className={`w-full px-4 py-2.5 pl-10 rounded-lg text-sm transition-all outline-none border-0 focus:ring-0 focus:ring-offset-0 ${
                                    darkMode
                                        ? 'bg-gray-800 text-white placeholder-gray-400 focus:bg-gray-700'
                                        : 'bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-gray-50'
                                }`}
                            />
                            <Search
                                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                                    darkMode ? 'text-gray-500' : 'text-gray-400'
                                }`}
                            />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
