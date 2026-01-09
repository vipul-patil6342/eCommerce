import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, getProductsByCategory } from "../features/product/productThunk";
import ProductCard from "./ProductCard";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { setCurrentPage, setDirection, setSortBy } from "../features/product/productSlice";
import { getWishlist } from "../features/wishlist/wishlistThunk";
import PaginationControls from "./PaginationControls";

function ProductList() {

    const [selected, setSelected] = useState('All');

    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";

    const dispatch = useDispatch();
    const { items, loading, error, totalPages, currentPage, sortBy, direction } = useSelector(state => state.products);

    const options = ['All', 'Electronics', 'Accessories', 'Clothing', 'Food & Beverage', 'Books', 'Home & Garden', 'Sports', 'Toys'];

    useEffect(() => {
        if (selected === "All") {
            dispatch(getProducts({
                pageNumber: currentPage,
                sortBy,
                direction
            }));
        } else {
            dispatch(getProductsByCategory({
                category: selected,
                pageNumber: currentPage,
                sortBy,
                direction
            }));
        }
    }, [dispatch, selected, currentPage, sortBy, direction]);

    useEffect(() => {
        dispatch(getWishlist());
    },[dispatch])


    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            dispatch(setCurrentPage(currentPage + 1));
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 0) {
            dispatch(setCurrentPage(currentPage - 1));
        }
    }

    const handleSortChange = (e) => {
        dispatch(setSortBy(e.target.value));
    }

    const handleDirectionChange = (e) => {
        dispatch(setDirection(e.target.value));
    }

    const handleCategoryChange = (category) => {
        setSelected(category);
        dispatch(setCurrentPage(0));
    }

    if (error) {
        return (
            <p className={`${darkMode ? "text-red-400" : "text-red-600"} p-4`}>
                {error}
            </p>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className={`sticky top-0 z-20 border-b ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-3">

                    {/* Categories */}
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                        {options.map(option => (
                            <button
                                key={option}
                                onClick={() => handleCategoryChange(option)}
                                className={`px-4 py-2 text-sm whitespace-nowrap transition-all cursor-pointer  ${selected === option
                                    ? "text-orange-500 border-b border-orange-500"
                                    : darkMode
                                        ? " text-gray-300 hover:text-gray-200"
                                        : " text-gray-700 hover:text-gray-600"
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    {/* Sorting */}
                    <div className="flex gap-3">
                        <select
                            value={sortBy}
                            onChange={handleSortChange}
                            className={`px-2 py-1 rounded-md border text-sm focus:outline-none ${darkMode
                                ? "bg-gray-800 border-gray-700 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                                }`}
                        >
                            <option value="id">Sort by ID</option>
                            <option value="price">Sort by Price</option>
                            <option value="name">Sort by Name</option>
                        </select>

                        <select
                            value={direction}
                            onChange={handleDirectionChange}
                            className={`px-2 py-1 rounded-md border text-sm focus:outline-none ${darkMode
                                ? "bg-gray-800 border-gray-700 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                                }`}
                        >
                            <option value="ASC">Ascending</option>
                            <option value="DESC">Descending</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className={`flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"
                }`}>
                {loading
                    ? Array.from({ length: 12 }).map((_, i) => (
                        <LoadingSkeleton key={i} darkMode={darkMode} />
                    ))
                    : items.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                }
            </div>
            
            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                darkMode={darkMode}
            />
        </div>
    );
}

export default ProductList;
