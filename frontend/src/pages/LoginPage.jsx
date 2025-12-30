import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthState, loginUser } from '../features/auth/authThunk';
import OAuth2Buttons from '../components/OAuth2Buttons';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { CustomLoading } from '../components/LoadingSkeleton';

export default function LoginPage() {
    const { isAuthenticated, isLoading, error: authError } = useSelector(state => state.auth);
    const theme = useSelector(state => state.theme.theme);
    const darkMode = theme === "dark";

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if(isAuthenticated){
            navigate("/products");
        }
    }, [isAuthenticated, navigate]);

    if (isLoading) {
        return (
            <CustomLoading darkMode={darkMode} />
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear local error when user starts typing
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.email.trim()) {
            setError('Email address is required');
            return;
        }

        if (!formData.password) {
            setError('Password is required');
            return;
        }

        const userData = {
            username: formData.email,
            password: formData.password
        };

        const resultAction = await dispatch(loginUser(userData));
        if (loginUser.fulfilled.match(resultAction)) {
            dispatch(getAuthState());
            navigate("/products");
        }
    };

    return (
        <div
            className={`flex-1 transition-colors duration-300 ${
                darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            }`}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
                {/* LEFT SECTION */}
                <div
                    className={`flex items-center justify-center p-4 sm:p-6 ${
                        darkMode ? 'bg-gray-800' : 'bg-gray-50'
                    }`}
                >
                    <div className="w-full max-w-md">
                        <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                        <p
                            className={`text-sm mb-8 ${
                                darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}
                        >
                            Log in to continue
                        </p>

                        {/* FORM */}
                        <div className="space-y-4">

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium mb-1"
                                >
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter Your Email"
                                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 ${
                                        darkMode
                                            ? 'bg-gray-700 border-gray-600 focus:border-orange-500 placeholder-gray-400'
                                            : 'bg-white border-gray-300 focus:border-orange-500 placeholder-gray-500'
                                    } focus:outline-none`}
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium mb-1"
                                >
                                    Password
                                </label>
                                <div className='relative'>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter Your Password"
                                        className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 ${
                                            darkMode
                                                ? 'bg-gray-700 border-gray-600 focus:border-orange-500 placeholder-gray-400'
                                                : 'bg-white border-gray-300 focus:border-orange-500 placeholder-gray-500'
                                        } focus:outline-none`}
                                    />
                                    <button 
                                        type='button' 
                                        onClick={togglePasswordVisibility} 
                                        className='absolute right-3 top-1/2 transform -translate-y-1/2'
                                    >
                                        {showPassword ? (
                                            <Eye className='w-5 h-5 cursor-pointer' />
                                        ) : (
                                            <EyeOff className='w-5 h-5 cursor-pointer' />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {(error || authError) && (
                                <div className="p-3 text-center">
                                    <p className="text-red-500 text-sm font-medium">{error || authError}</p>
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center bg-orange-400 hover:bg-orange-500 disabled:bg-orange-300 text-white font-semibold py-2 rounded-lg transition-all duration-200 transform focus:outline-none cursor-pointer"
                            >
                                Login Now
                            </button>
                        </div>

                        <OAuth2Buttons />

                        <p
                            className={`text-center text-sm mt-6 ${
                                darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}
                        >
                            Don't have an account?{' '}
                            <span
                                onClick={() => navigate("/signup")}
                                className="text-orange-400 hover:text-orange-500 font-medium cursor-pointer"
                            >
                                Sign up
                            </span>
                        </p>
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div
                    className={`hidden md:flex items-center justify-center p-8 ${
                        darkMode
                            ? 'bg-gray-900'
                            : 'bg-linear-to-br from-orange-500 to-amber-500'
                    }`}
                >
                    <div className="text-center text-white max-w-md">
                        <h2 className="text-5xl font-bold mb-6">Welcome Back!</h2>
                        <p className="text-xl leading-relaxed mb-8">
                            Let's pick up where you left off.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}