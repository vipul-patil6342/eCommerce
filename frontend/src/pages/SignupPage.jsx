import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, signupUser } from '../features/auth/authThunk';
import { setSignupData, clearSignupData } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { CustomLoading } from '../components/LoadingSkeleton';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error: authError } = useSelector(state => state.auth);
    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";

    if (isLoading) {
        return (
            <CustomLoading darkMode={darkMode} />
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error when user starts typing
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidPassword = (password) => {
        return password.length >= 6;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate all fields are not empty
        if (!formData.name.trim()) {
            setError('Full name is required');
            return;
        }

        if (!formData.username.trim()) {
            setError('Email address is required');
            return;
        }

        // Validate email format
        if (!isValidEmail(formData.username)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!formData.password) {
            setError('Password is required');
            return;
        }

        // Validate password strength
        if (!isValidPassword(formData.password)) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (!formData.confirmPassword) {
            setError('Please confirm your password');
            return;
        }

        // Check passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // If all validations pass
        const userData = {
            name: formData.name,
            username: formData.username,
            password: formData.password
        };

        dispatch(setSignupData(userData));

        const resultAction = await dispatch(signupUser(userData));
        if (signupUser.fulfilled.match(resultAction)) {
            dispatch(sendOtp({ email: userData.username }));
            console.log("send otp called")
            navigate("/otp");
        } else {
            dispatch(clearSignupData());
        }
    };

    return (
        <div className={`flex-1 transition-colors duration-300 ${darkMode
            ? 'bg-gray-900 text-white'
            : 'bg-white text-gray-900'
            }`}>

            <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
                <div className={`flex items-center justify-center p-4 sm:p-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className="w-full max-w-md">
                        <h1 className="text-2xl font-bold mb-1">Join Us</h1>
                        <p className={`text-sm mb-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Create your account to get started
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 ${darkMode
                                        ? 'bg-gray-700 border-gray-600 focus:border-orange-500 placeholder-gray-400'
                                        : 'bg-white border-gray-300 focus:border-orange-500 placeholder-gray-500'
                                        } focus:outline-none`}
                                />
                            </div>

                            <div>
                                <label htmlFor="username" className="block text-sm font-medium mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 ${darkMode
                                        ? 'bg-gray-700 border-gray-600 focus:border-orange-500 placeholder-gray-400'
                                        : 'bg-white border-gray-300 focus:border-orange-500 placeholder-gray-500'
                                        } focus:outline-none`}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-1">
                                    Password
                                </label>
                                <div className='relative'>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="At Least 6 Characters"
                                        className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 ${darkMode
                                            ? 'bg-gray-700 border-gray-600 focus:border-orange-500 placeholder-gray-400'
                                            : 'bg-white border-gray-300 focus:border-orange-500 placeholder-gray-500'
                                            } focus:outline-none`}
                                    />
                                    <button
                                        type='button'
                                        onClick={togglePasswordVisibility}
                                        className='absolute right-3 top-1/2 transform -translate-y-1/2'
                                    >
                                        {showPassword ? <Eye className='w-5 h-5 cursor-pointer' /> : <EyeOff className='w-5 h-5 cursor-pointer' />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                                    Confirm Password
                                </label>
                                <div className='relative'>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Re-Enter Your Password"
                                        className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 ${darkMode
                                            ? 'bg-gray-700 border-gray-600 focus:border-orange-500 placeholder-gray-400'
                                            : 'bg-white border-gray-300 focus:border-orange-500 placeholder-gray-500'
                                            } focus:outline-none`}
                                    />
                                    <button
                                        type='button'
                                        onClick={toggleConfirmPasswordVisibility}
                                        className='absolute right-3 top-1/2 transform -translate-y-1/2'
                                    >
                                        {showConfirmPassword ? <Eye className='w-5 h-5 cursor-pointer' /> : <EyeOff className='w-5 h-5 cursor-pointer' />}
                                    </button>
                                </div>
                            </div>

                            {(error || authError) && (
                                <div className="p-3 text-center">
                                    <p className="text-red-500 text-sm font-medium">{error || authError}</p>
                                </div>
                            )}

                            <button
                                type='submit'
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center bg-orange-400 hover:bg-orange-500 disabled:bg-orange-300 text-white font-semibold py-2 rounded-lg transition-all duration-200 transform focus:outline-none cursor-pointer"
                            >
                                Create Account
                            </button>
                        </form>

                        <p className={`text-center text-sm mt-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Already have an account?{' '}
                            <span className="text-orange-400 hover:text-orange-500 font-medium cursor-pointer" onClick={() => navigate("/login")}>
                                Sign in
                            </span>
                        </p>
                    </div>
                </div>

                <div
                    className={`hidden md:flex items-center justify-center p-8 ${darkMode
                        ? 'bg-gray-900'
                        : 'bg-linear-to-br from-orange-500 to-amber-500'
                        }`}
                >
                    <div className="text-center text-white max-w-md">
                        <h2 className="text-5xl font-bold mb-6">Welcome!</h2>
                        <p className="text-xl leading-relaxed mb-8">
                            Join thousands of users who are already transforming their lives with our platform.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}