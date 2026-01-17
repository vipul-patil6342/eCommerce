const CustomLoading = ({ darkMode }) => {
    return (
        <div className={`flex items-center justify-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <style>
                {`
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .spinner {
                animation: spin 1s linear infinite;
            }
        `}
            </style>

            <div
                className={`spinner w-16 h-16 rounded-full border-4 ${darkMode
                    ? 'border-gray-700 border-t-orange-500'
                    : 'border-gray-300 border-t-orange-600'
                    }`}
            />
        </div>
    );
};

const CustomLoginLoading = ({ darkMode }) => {
    return (
        <div className={`flex flex-col items-center justify-center h-screen p-4 transition-colors duration-500 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <style>
                {`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .spinner {
                    animation: spin 1s linear infinite;
                }
                `}
            </style>

            {/* Spinner */}
            <div
                className={`spinner w-16 h-16 rounded-full border-4 ${
                    darkMode
                        ? 'border-gray-700 border-t-orange-500'
                        : 'border-gray-300 border-t-orange-600'
                }`}
            />

            {/* Message Block */}
            <div className="mt-8 text-center max-w-sm">
                <h2 className={`text-xl font-bold mb-2 animate-pulse ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    Waking up the server...
                </h2>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    The server may take <span className="font-semibold text-orange-500">2 minutes</span> or more to start due to inactivity on the free hosting plan. 
                    <br />Thank you for your patience!
                </p>
            </div>
        </div>
    );
};


const LoadingSkeleton = ({ darkMode }) => {
    return (
        <div
            className={`rounded-lg overflow-hidden shadow-sm transition-shadow duration-300 flex flex-col h-80
            ${darkMode
                    ? 'bg-gray-800'
                    : 'bg-white'
                }`}
        >
            {/* Image Skeleton */}
            <div
                className={`h-36 shrink-0 animate-pulse
                ${darkMode
                        ? 'bg-gray-700'
                        : 'bg-gray-200'
                    }`}
            ></div>

            {/* Content Skeleton */}
            <div className="p-4 flex flex-col flex-1">
                {/* Title */}
                <div className="mb-3 space-y-2">
                    <div
                        className={`h-4 rounded animate-pulse
                        ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
                    ></div>
                    <div
                        className={`h-3 w-3/4 rounded animate-pulse
                        ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
                    ></div>
                </div>

                {/* Price */}
                <div className="mb-4">
                    <div
                        className={`h-5 w-1/3 rounded animate-pulse
                        ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
                    ></div>
                </div>

                {/* Button */}
                <div
                    className={`mt-auto w-full h-10 rounded animate-pulse
                    ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
                ></div>
            </div>
        </div>
    );
}

const CartSkeleton = ({ darkMode }) => {
    return (
        <div className={`min-h-screen overflow-y-scroll p-4 sm:p-6 transition-colors duration-300
            ${darkMode
                ? 'bg-linear-to-br from-gray-900 via-gray-950 to-black'
                : 'bg-linear-to-br from-slate-50 via-white to-blue-50'
            }`}
        >
            <div className="max-w-5xl mx-auto">
                {/* Header Skeleton */}
                <div className="flex items-center gap-3 mb-8">
                    <div className={`w-8 h-8 rounded-lg animate-pulse
                        ${darkMode ? 'bg-gray-800' : 'bg-slate-200'}`}
                    />
                    <div className={`h-8 w-32 rounded-lg animate-pulse
                        ${darkMode ? 'bg-gray-800' : 'bg-slate-200'}`}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cart Items Skeleton */}
                    <div className="lg:col-span-2 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 border transition
                                    ${darkMode
                                        ? 'bg-gray-900 border-gray-800'
                                        : 'bg-white border-slate-200'
                                    }`}
                            >
                                {/* Product Image Skeleton */}
                                <div className={`w-12 h-12 rounded-lg animate-pulse shrink-0
                                    ${darkMode ? 'bg-gray-800' : 'bg-slate-200'}`}
                                />

                                {/* Product Info Skeleton */}
                                <div className='flex-1 min-w-0 w-full sm:w-auto'>
                                    <div className={`h-4 w-32 rounded-lg animate-pulse mb-2
                                        ${darkMode ? 'bg-gray-800' : 'bg-slate-200'}`}
                                    />
                                    <div className={`h-4 w-20 rounded-lg animate-pulse
                                        ${darkMode ? 'bg-gray-800' : 'bg-slate-200'}`}
                                    />
                                </div>

                                {/* Quantity Skeleton */}
                                <div className={`w-28 h-10 rounded-lg animate-pulse shrink-0
                                    ${darkMode ? 'bg-gray-800' : 'bg-slate-200'}`}
                                />

                                {/* Price and Delete Skeleton */}
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className={`h-4 w-16 rounded-lg animate-pulse
                                        ${darkMode ? 'bg-gray-800' : 'bg-slate-200'}`}
                                    />
                                    <div className={`w-6 h-6 rounded-lg animate-pulse
                                        ${darkMode ? 'bg-gray-800' : 'bg-slate-200'}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary Skeleton */}
                    <div className="lg:col-span-1">
                        <div className={`rounded-xl p-6 sticky top-6 border shadow-md transition
                            ${darkMode
                                ? 'bg-gray-900 border-gray-800'
                                : 'bg-white border-slate-200'
                            }`}
                        >
                            {/* Summary Header */}
                            <div className={`h-6 w-32 rounded-lg animate-pulse mb-6
                                ${darkMode ? 'bg-gray-800' : 'bg-slate-200'}`}
                            />

                            {/* Summary Items */}
                            <div className="space-y-3 mb-6 border-b pb-6 border-gray-700">
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex justify-between">
                                        <div className={`h-3 w-16 rounded-lg animate-pulse
                                            ${darkMode ? 'bg-gray-800' : 'bg-slate-200'}`}
                                        />
                                        <div className={`h-3 w-20 rounded-lg animate-pulse
                                            ${darkMode ? 'bg-gray-800' : 'bg-slate-200'}`}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center mb-6">
                                <div className={`h-5 w-12 rounded-lg animate-pulse
                                    ${darkMode ? 'bg-gray-800' : 'bg-slate-200'}`}
                                />
                                <div className={`h-6 w-24 rounded-lg animate-pulse
                                    ${darkMode ? 'bg-gray-800' : 'bg-slate-200'}`}
                                />
                            </div>

                            {/* Buttons */}
                            <div className={`w-full h-10 rounded-lg animate-pulse mb-3
                                ${darkMode ? 'bg-gray-800' : 'bg-slate-200'}`}
                            />
                            <div className={`w-full h-10 rounded-lg animate-pulse
                                ${darkMode ? 'bg-gray-800' : 'bg-slate-200'}`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { LoadingSkeleton, CartSkeleton, CustomLoading, CustomLoginLoading };