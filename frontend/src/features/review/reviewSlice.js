import { createSlice } from "@reduxjs/toolkit"
import { addReview, deleteReview, getReviews, updateReview } from "./reviewThunk";

const initialState = {
    loading: false,
    reviews: [],
    error: null,
}

export const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        const pending = (state) => {
            state.loading = true;
            state.error = null;
        }

        const rejected = (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }

        builder
            //Add Review
            .addCase(addReview.pending, pending)
            .addCase(addReview.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews.push(action.payload);
                state.error = null;
            })
            .addCase(addReview.rejected, rejected)

            //Get Reviews
            .addCase(getReviews.pending, pending)
            .addCase(getReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
                state.error = null;
            })
            .addCase(getReviews.rejected, rejected)

            //Update Review
            .addCase(updateReview.pending, pending)
            .addCase(updateReview.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.reviews.findIndex(review => review.id === action.payload.id);
                if (index !== -1) {
                    state.reviews[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateReview.rejected, rejected)

            //Delete Review
            .addCase(deleteReview.pending, pending)
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = state.reviews.filter(review => review.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteReview.rejected, rejected)
    }
})

export const {} = reviewSlice.actions;
export default reviewSlice.reducer;