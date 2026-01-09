import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react'

const PaginationControls = ({
    handlePrevPage,
    handleNextPage,
    currentPage,
    totalPages,
    darkMode
}) => {
    return (
        <>
            <div className={`border-t px-6 py-2 flex items-center justify-between ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
                }`}>
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${currentPage === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-orange-600 hover:bg-orange-50"
                        }`}
                >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                </button>

                <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Page <span className="font-semibold">{currentPage + 1}</span> of{" "}
                    <span className="font-semibold">{totalPages}</span>
                </span>

                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${currentPage === totalPages - 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-orange-600 hover:bg-orange-50"
                        }`}
                >
                    Next
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </>

    )
}

export default PaginationControls;