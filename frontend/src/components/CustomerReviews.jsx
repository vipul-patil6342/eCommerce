import React, { useEffect, useState } from "react";
import { Star, Send, Trash2, Edit2, X, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getReviews, addReview, updateReview, deleteReview } from "../features/review/reviewThunk";

const CustomerReviews = ({ productId, currentUserId }) => {
    const dispatch = useDispatch();
    const { reviews = [], loading, error } = useSelector((state) => state.review);
    const { theme } = useSelector(state => state.theme);
    const darkMode = theme === "dark";

    const [reviewData, setReviewData] = useState({
        rating: 5,
        comment: "",
    });

    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ rating: 5, comment: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        dispatch(getReviews(productId));
    }, [dispatch, productId]);

    const avgRating =
        reviews.length > 0
            ? (
                reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            ).toFixed(1)
            : 0;



    const renderStars = (rating, interactive = false, onRatingChange = null) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    size={interactive ? 32 : 16}
                    onClick={() => interactive && onRatingChange?.(i)}
                    className={`${
                        interactive ? "cursor-pointer transition-all" : ""
                    } ${
                        i <= rating
                            ? "fill-orange-500 text-orange-500"
                            : interactive
                            ? "hover:text-orange-300 text-gray-300"
                            : darkMode
                            ? "text-gray-500"
                            : "text-gray-300"
                    }`}
                />
            ))}
        </div>
    );

    const handleSubmitReview = async () => {
        if (!reviewData.comment.trim()) return;

        setIsSubmitting(true);
        try {
            await dispatch(addReview({ productId, reviewData }));
            setReviewData({ rating: 5, comment: "" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStartEdit = (review) => {
        setEditingId(review.id);
        setEditData({ rating: review.rating, comment: review.comment });
    };

    const handleSaveEdit = async (reviewId) => {
        if (!editData.comment.trim()) return;

        setIsSubmitting(true);
        try {
            await dispatch(updateReview({ reviewId, reviewData: editData }));
            setEditingId(null);
            setEditData({ rating: 5, comment: "" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditData({ rating: 5, comment: "" });
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                await dispatch(deleteReview(reviewId));
            } catch (error) {
                console.error("Failed to delete review", error);
            }
        }
    };

    const isOwnReview = (review) => review.userId === currentUserId;

    return (
        <div className={`w-full py-12 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>

                {/* Summary */}
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    <div className={`p-6 rounded-lg shadow-sm text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                        <div className="text-5xl font-bold text-orange-500 mb-2">
                            {avgRating}
                        </div>
                        <div className="flex justify-center mb-3">
                            {renderStars(Math.round(avgRating))}
                        </div>
                        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>{reviews.length} reviews</p>
                    </div>

                    {/* Add Review */}
                    <div className={`md:col-span-2 p-6 rounded-lg shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                        <h3 className="text-xl font-bold mb-4">Write a Review</h3>

                        {error && (
                            <div className={`mb-4 p-3 border rounded-lg ${darkMode ? "bg-red-900/30 border-red-700" : "bg-red-50 border-red-200"}`}>
                                <p className={`text-sm ${darkMode ? "text-red-400" : "text-red-700"}`}>{error}</p>
                            </div>
                        )}

                        <div className="flex gap-2 mb-4">
                            {renderStars(
                                reviewData.rating,
                                true,
                                (rating) =>
                                    setReviewData({ ...reviewData, rating })
                            )}
                        </div>

                        <textarea
                            value={reviewData.comment}
                            onChange={(e) =>
                                setReviewData({ ...reviewData, comment: e.target.value })
                            }
                            placeholder="Share your experience..."
                            rows="3"
                            className={`w-full px-4 py-2 border rounded-lg mb-4 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
                        />

                        <button
                            onClick={handleSubmitReview}
                            disabled={
                                isSubmitting ||
                                !reviewData.comment.trim()
                            }
                            className={`text-white px-6 py-2 rounded-lg flex items-center gap-2 ${isSubmitting || !reviewData.comment.trim() ? (darkMode ? "bg-gray-600" : "bg-gray-400") : "bg-orange-500 hover:bg-orange-600"}`}
                        >
                            <Send size={16} />
                            Submit Review
                        </button>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {loading ? (
                        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Loading...</p>
                    ) : reviews.length === 0 ? (
                        <p className={`text-center py-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            No reviews yet. Be the first to review!
                        </p>
                    ) : (
                        reviews.map((review) => (
                            <div
                                key={review.id}
                                className={`p-6 rounded-lg shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}
                            >
                                {editingId === review.id ? (
                                    // Edit Mode
                                    <div>
                                        <div className="flex gap-2 mb-4">
                                            {renderStars(
                                                editData.rating,
                                                true,
                                                (rating) =>
                                                    setEditData({ ...editData, rating })
                                            )}
                                        </div>
                                        <textarea
                                            value={editData.comment}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    comment: e.target.value,
                                                })
                                            }
                                            rows="3"
                                            className={`w-full px-4 py-2 border rounded-lg mb-4 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    handleSaveEdit(review.id)
                                                }
                                                disabled={
                                                    isSubmitting ||
                                                    !editData.comment.trim()
                                                }
                                                className={`text-white px-4 py-2 rounded-lg flex items-center gap-2 ${isSubmitting || !editData.comment.trim() ? (darkMode ? "bg-gray-600" : "bg-gray-400") : "bg-green-500 hover:bg-green-600"}`}
                                            >
                                                <Check size={16} />
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className={`text-white px-4 py-2 rounded-lg flex items-center gap-2 ${darkMode ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-400 hover:bg-gray-500"}`}
                                            >
                                                <X size={16} />
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // View Mode
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <p className={`font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                                                            {review.username}
                                                        </p>
                                                        <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                                                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                                                        </p>
                                                    </div>
                                                </div>
                                                {renderStars(review.rating)}
                                                <p className={`mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                                    {review.comment}
                                                </p>
                                            </div>

                                            {isOwnReview(review) && (
                                                <div className="flex gap-2 ml-4">
                                                    <button
                                                        onClick={() =>
                                                            handleStartEdit(review)
                                                        }
                                                        className={`p-2 ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-500 hover:text-blue-700"}`}
                                                        title="Edit review"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteReview(review.id)
                                                        }
                                                        className={`p-2 ${darkMode ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-700"}`}
                                                        title="Delete review"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerReviews;