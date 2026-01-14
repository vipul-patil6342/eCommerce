import { useEffect, useState } from "react";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../features/auth/authThunk";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "../utils/toast";

const PasswordResetPage = () => {
    
    const { loading, successMessage, error, email } = useSelector(state => state.auth);
    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formError, setFormError] = useState("");

    const validateForm = () => {
        if (otp.length !== 6) {
            setFormError("OTP must be 6 digits");
            return false;
        }
        if (password.length < 8) {
            setFormError("Password must be at least 8 characters");
            return false;
        }
        if (password !== confirmPassword) {
            setFormError("Passwords do not match");
            return false;
        }
        setFormError("");
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const resultAction = await dispatch(resetPassword({
            email,
            otp,
            newPassword: password
        }));
        if (resetPassword.fulfilled.match(resultAction)) {
            showSuccess(successMessage);
            navigate("/login");
        }
    };

    useEffect(() => {
        if (successMessage) {
            setOtp("");
            setPassword("");
            setConfirmPassword("");
        }
    }, [successMessage]);

    return (
        <div className={`flex flex-1 items-center justify-center px-4 
            ${darkMode ? "bg-gray-900" : "bg-linear-to-br from-orange-50 to-blue-100"}`}>

            <div className={`w-full max-w-md rounded-2xl shadow-xl p-6
                ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>

                <h1 className="text-3xl font-bold mb-2 text-center">
                    Reset Password
                </h1>
                <p className="text-center text-sm text-gray-500 mb-6">
                    Enter the OTP sent to your email and set a new password
                </p>

                {/* BACKEND ERROR */}
                {error && (
                    <div className="mb-5 flex gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                        <AlertCircle className="text-red-600" />
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* FORM ERROR */}
                {formError && (
                    <div className="mb-5 flex gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                        <AlertCircle className="text-red-600" />
                        <p className="text-red-700 font-medium">{formError}</p>
                    </div>
                )}

                <div className="space-y-4">
                    {/* OTP */}
                    <div>
                        <label className="text-sm font-medium">OTP</label>
                        <input
                            value={otp}
                            onChange={e =>
                                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                            }
                            placeholder="6-digit OTP"
                            className="mt-1 w-full rounded-lg border px-4 py-2 text-center tracking-widest outline-none"
                        />
                        <p className="text-xs text-gray-400 mt-1">{otp.length}/6 digits</p>
                    </div>

                    {/* NEW PASSWORD */}
                    <div>
                        <label className="text-sm font-medium">New Password</label>
                        <div className="relative mt-1">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Minimum 8 characters"
                                className="w-full rounded-lg border px-4 py-2 pr-10 outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-500"
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div>
                        <label className="text-sm font-medium">Confirm Password</label>
                        <div className="relative mt-1">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter password"
                                className="w-full rounded-lg border px-4 py-2 pr-10 outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-2.5 text-gray-500"
                            >
                                {showConfirmPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                    </div>

                    {/* SUBMIT */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full flex justify-center items-center gap-2 rounded-lg py-2.5 font-semibold transition
                            ${loading
                                ? "bg-orange-400 cursor-not-allowed"
                                : "bg-orange-600 hover:bg-orange-700 text-white"
                            }`}
                    >
                        {loading && <Loader2 className="animate-spin" size={18} />}
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </div>

                <p className="mt-4 text-center text-sm text-gray-500">
                    Didn't receive OTP?{" "}
                    <span className="text-gray-600">
                        Please go back and request a new OTP.
                    </span>
                </p>

            </div>
        </div>
    );
};

export default PasswordResetPage;