import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CustomLoginLoading } from './LoadingSkeleton';

const HeroSection = () => {

    const { isAuthenticated, isLoading } = useSelector(state => state.auth);
    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";

    const navigate = useNavigate();

    if (isLoading) {
        return <CustomLoginLoading darkMode={darkMode} />;
    }

    if (isAuthenticated) {
        navigate("/products");
    }

    const navigateToLogin = () => {
        navigate("/login");
    }



    return (
        <div className={`w-full transition-colors duration-500 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
            <section className="min-h-[calc(100vh-10vh)] flex flex-col md:grid md:grid-cols-2 p-6 gap-6">
                <div className="w-full flex items-center justify-center p-2">
                    <img
                        src="/main.png"
                        alt="Hero"
                        className={`max-h-[80vh] w-auto object-contain rounded-sm shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-500 ${darkMode ? 'brightness-75' : ''}`}
                    />
                </div>

                <div className={`flex items-center justify-center md:justify-start text-center md:text-left px-6 lg:px-12 py-12 transition-colors duration-500 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                    <div className="max-w-xl animate-fadeIn">

                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
                            <span className="bg-linear-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                                Bazaar
                            </span>
                        </h1>

                        <p className={`mt-4 text-lg md:text-xl font-medium transition-colors duration-500 
                            ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                        >
                            Fill Your Cart, Lift Your Mood.
                        </p>

                        <p className={`mt-2 text-sm md:text-base transition-colors duration-500 
                            ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                            Discover deals, trends, and quality products made for you.
                        </p>

                        <button
                            onClick={navigateToLogin}
                            className={`mt-8 px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer bg-linear-to-r from-orange-500 to-orange-600 text-white`}
                        >
                            Explore Now
                        </button>
                    </div>
                </div>
            </section>

            <section
                className={`w-full py-20 px-6 transition-colors duration-500
                    ${darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}
            >
                <div className="max-w-4xl mx-auto text-center md:text-left">
                    <h2 className={`text-3xl font-bold mb-4 transition-colors duration-500 
                        ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                        About Us
                    </h2>

                    <p className="text-lg leading-relaxed mb-4">
                        Bazaar is a curated marketplace connecting you with exceptional products
                        from trusted brands and emerging creators. We bring quality, convenience,
                        and great deals to your fingertips.
                    </p>

                    <h3 className="text-2xl font-semibold mb-4">Why Choose Us?</h3>

                    <ul className="space-y-3 text-lg">
                        <li className="flex items-start gap-2">✔ Premium Quality Products</li>
                        <li className="flex items-start gap-2">✔ Fast & Reliable Delivery</li>
                        <li className="flex items-start gap-2">✔ Secure Payments & Easy Returns</li>
                        <li className="flex items-start gap-2">✔ 24/7 Customer Support</li>
                    </ul>
                </div>
            </section>

            <footer
                className={`w-full py-6 text-center transition-colors duration-500 
                ${darkMode ? "bg-gray-900 text-gray-400" : "bg-gray-100 text-gray-600"}`}
            >
                <h2 className="text-xl font-semibold mb-2">
                    <span className="bg-linear-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
                        Bazaar
                    </span>
                </h2>

                <p className="text-sm">
                    © {new Date().getFullYear()} Bazaar. All Rights Reserved.
                </p>
            </footer>

        </div>
    );
};

export default HeroSection;
