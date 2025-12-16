import { useState } from 'react';
import { Search, User, ShoppingBag, Moon, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../features/theme/themeSlice';
import SidebarLayout from './SidebarLayout';
import { useEffect } from 'react';

const Navbar = () => {

    const { isAuthenticated } = useSelector(state => state.auth);
    const theme = useSelector(state => state.theme.theme);
    const [openSidebar, setOpenSidebar] = useState(false);

    const darkMode = theme === "dark";
    const dispatch = useDispatch();

    return (
        <>
            <nav className={`sticky top-0 z-50 w-full transition-colors duration-300 ${darkMode
                ? 'bg-gray-900 border-b border-gray-800 shadow-lg'
                : 'bg-white border-b border-gray-100 shadow-sm'
                }`}>
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between gap-8">
                        {/* Logo */}
                        <div className="shrink-0">
                            <span className="text-3xl font-black tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}>
                                <span className="bg-linear-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                                    Bazaar
                                </span>
                            </span>
                        </div>


                        <div className="flex items-center gap-6">
                            {isAuthenticated ?
                                <>
                                    <button
                                        className={`relative p-2 transition-colors duration-200 ${darkMode
                                            ? 'text-gray-300 hover:text-orange-500'
                                            : 'text-gray-700 hover:text-orange-600'
                                            }`}
                                        aria-label="Shopping Cart"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                    </button>

                                    <button
                                        className={`relative p-2 transition-colors duration-200 ${darkMode
                                            ? 'text-gray-300 hover:text-orange-500'
                                            : 'text-gray-700 hover:text-orange-600'
                                            }`}
                                        aria-label="User Account"
                                        onClick={() => setOpenSidebar(true)}
                                    >
                                        <User className="w-5 h-5" />
                                    </button>
                                </> :  " "
                        }

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={() => dispatch(toggleTheme())}
                                className={`relative p-2 transition-colors duration-200 ${darkMode
                                    ? 'text-yellow-400 hover:text-yellow-500'
                                    : 'text-gray-700 hover:text-orange-600'
                                    }`}
                                aria-label="Toggle Dark Mode"
                            >
                                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                </div>
            </nav>
            <SidebarLayout isOpen={openSidebar} onClose={() => setOpenSidebar(false)} />
        </>
    );
}

export default Navbar;