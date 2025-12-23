const ConfirmModal = ({
    isOpen,
    title = "Confirm Action",
    message = "Are you sure?",
    onConfirm,
    onCancel,
    darkMode
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                className={`rounded-xl shadow-lg w-[90%] max-w-sm p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
                <h2
                    className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                    {title}
                </h2>

                <p
                    className={`mt-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                    {message}
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className={`px-4 py-2 text-sm rounded-lg border
                            ${darkMode
                                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                                : "border-gray-300 text-gray-700 hover:bg-gray-100"
                            }
            `}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
