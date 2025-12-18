const LoadingSkeleton = ({darkMode}) => {
    return (
        <div
            className={`rounded-lg overflow-hidden shadow-sm transition-shadow duration-300 flex flex-col h-80 animate-pulse
            ${darkMode
                    ? 'bg-gray-800'
                    : 'bg-white'
                }`}
        >
            {/* Image Skeleton */}
            <div
                className={`h-36 shrink-0
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
                        className={`h-4 rounded
                        ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
                    ></div>
                    <div
                        className={`h-3 w-3/4 rounded
                        ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
                    ></div>
                </div>

                {/* Price */}
                <div className="mb-4">
                    <div
                        className={`h-5 w-1/3 rounded
                        ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
                    ></div>
                </div>

                {/* Button */}
                <div
                    className={`mt-auto w-full h-10 rounded
                    ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
                ></div>
            </div>
        </div>
    );
}

export default LoadingSkeleton;