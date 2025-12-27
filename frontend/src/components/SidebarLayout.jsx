import { X, LogOut, Home, User, UserCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/auth/authThunk';
import { useNavigate, Link } from 'react-router-dom';

const SidebarLayout = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector(state => state.auth);
    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === 'dark';

    const isAdmin = user?.roles?.includes("ADMIN");

    const handleLogout = async () => {
        const result = await dispatch(logoutUser());
        if (logoutUser.fulfilled.match(result)) {
            navigate('/login');
            onClose();
        }
    };

    const menuItems = [
        { icon: Home, label: 'Home', to: '/products' },
        { icon: User, label: 'Profile', to: '/profile' },
    ];

    return (
        <div className="fixed inset-0 z-999 flex">
            <div
                className={`absolute inset-0 ${darkMode ? 'bg-black/50' : 'bg-black/40'}`}
                onClick={onClose}
            />

            <div
                className={`relative ml-auto w-64 h-full shadow-xl transform transition-transform duration-300
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <span className="text-3xl font-black tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}>
                        <span className="bg-linear-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                            Bazaar
                        </span>
                    </span>
                    <button onClick={onClose}>
                        <X size={22} />
                    </button>
                </div>

                {/* User Info */}
                {user && (
                    <div className="px-6 py-4 border-b border-gray-700 text-sm">
                        <span className='flex'>
                            <UserCircle size={18} className='mr-2' />
                            <p className="font-semibold">{user.name || 'Guest'}</p>
                        </span>
                        <p className="text-xs opacity-70">{user.email}</p>
                    </div>
                )}

                {isAdmin && (
                    <div className="px-6 py-4 border-b border-gray-700 flex justify-center">
                        <Link
                            to="/admin" 
                            onClick={onClose}
                            className="w-full text-center py-2 rounded-lg font-semibold bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition duration-150"
                        >
                            <span>Admin Dashboard</span>
                        </Link>
                    </div>
                )}
                {/* Menu */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <nav className="space-y-1">
                        {menuItems.map(item => (
                            <Link
                                key={item.label}
                                to={item.to}
                                onClick={onClose}
                                className="flex items-center px-4 py-3 rounded-lg hover:bg-blue-500/10"
                            >
                                <item.icon size={18} className="mr-3" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    >
                        <LogOut size={18} className="mr-2" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SidebarLayout;
