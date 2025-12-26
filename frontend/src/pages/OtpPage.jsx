import { useState, useRef } from 'react';
import { Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, sendOtp } from '../features/auth/authThunk';
import { clearSignupData } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function OtpPage() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const inputRefs = useRef([]);

    const { theme } = useSelector(state => state.theme);
    const { signupData, isLoading, error: authError } = useSelector(state => state.auth);

    const darkMode = theme === "dark";

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setError('');

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async () => {
        const otpString = otp.join('');

        if (otpString.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        const resultAction = await dispatch(verifyOtp({ email: signupData.username, otp: otpString }));
        if (verifyOtp.fulfilled.match(resultAction)) {
            dispatch(clearSignupData());
            navigate("/login");
        }
    };

    const handleResendOtp = async () => {
        setResendLoading(true);
        await dispatch(sendOtp({ email: signupData.username }));
        setResendLoading(false);
        setOtp(['', '', '', '', '', '']);
        setError('');
    };

    return (
        <div className={`min-h-[calc(100vh-68px)] overflow-hidden transition-colors duration-300 ${
            darkMode
                ? 'bg-gradient-to-br from-gray-900 to-gray-800'
                : 'bg-gradient-to-br from-orange-50 to-amber-100'
        }`}>

            <div className="flex items-center justify-center h-full p-6">
                <div className="w-full max-w-md">
                    <div className={`rounded-2xl shadow-2xl p-8 transition-colors duration-300 ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <h2 className={`text-3xl font-bold mb-2 text-center ${
                            darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                            Verify Your Identity
                        </h2>
                        <p className={`text-center mb-8 ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            Enter the 6-digit code sent to your registered email.
                        </p>

                        <div className="mb-8">
                            <label className={`block text-sm font-medium mb-6 text-center ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Enter OTP Code
                            </label>
                            <div className="flex gap-3 justify-center mb-4">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-base sm:text-lg md:text-2xl font-bold border-2 rounded-lg transition focus:outline-none ${
                                            digit
                                                ? darkMode
                                                    ? 'border-orange-400 bg-gray-700'
                                                    : 'border-orange-500 bg-orange-50'
                                                : darkMode
                                                    ? 'border-gray-600 bg-gray-700 hover:border-gray-500'
                                                    : 'border-gray-300 bg-white hover:border-gray-400'
                                        } ${error || authError ? 'border-red-500' : ''} ${
                                            darkMode ? 'text-white' : 'text-gray-900'
                                        }`}
                                        placeholder=""
                                    />
                                ))}
                            </div>
                            {(error || authError) && (
                                <p className="text-red-500 text-sm text-center">{error || authError}</p>
                            )}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-3 rounded-lg transition mb-4"
                        >
                            {isLoading ? 'Verifying...' : 'Verify OTP'}
                        </button>

                        <div className={`flex items-center justify-center text-sm mb-6 ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            <Clock className="w-4 h-4 mr-2" />
                            <span>Code expires in 5 minutes</span>
                        </div>

                        <div className={`pt-6 border-t text-center text-sm ${
                            darkMode
                                ? 'border-gray-700 text-gray-400'
                                : 'border-gray-200 text-gray-600'
                        }`}>
                            <p>Didn't receive the code?</p>
                            <button
                                onClick={handleResendOtp}
                                disabled={resendLoading}
                                className={`font-semibold mt-2 transition ${
                                    darkMode
                                        ? 'text-orange-400 hover:text-orange-300 disabled:text-orange-600'
                                        : 'text-orange-600 hover:text-orange-700 disabled:text-orange-400'
                                }`}
                            >
                                {resendLoading ? 'Resending...' : 'Resend OTP'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}