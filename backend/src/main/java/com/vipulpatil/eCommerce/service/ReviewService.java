package com.vipulpatil.eCommerce.service;

import com.vipulpatil.eCommerce.dto.ReviewRequestDto;
import com.vipulpatil.eCommerce.dto.ReviewResponseDto;
import com.vipulpatil.eCommerce.entity.Product;
import com.vipulpatil.eCommerce.entity.Review;
import com.vipulpatil.eCommerce.entity.User;
import com.vipulpatil.eCommerce.entity.type.RoleType;
import com.vipulpatil.eCommerce.repository.ProductRepository;
import com.vipulpatil.eCommerce.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public ReviewResponseDto addReview(Long productId, User user, ReviewRequestDto request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));


        Optional<Review> existingReview = reviewRepository.findByUserIdAndProductId(user.getId(), productId);
        if (existingReview.isPresent()) {
            throw new RuntimeException("You have already reviewed this product");
        }

        Review review = Review.builder()
                .user(user)
                .rating(request.getRating())
                .comment(request.getComment())
                .product(product)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Review savedReview = reviewRepository.save(review);
        updateProductRating(productId);

        return toDto(savedReview);
    }

    public List<ReviewResponseDto> getReviews(Long productId) {
        return reviewRepository.findByProductId(productId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public void deleteReview(Long reviewId, User currentUser) {
        Review review;
        if (currentUser.getRoles().contains(RoleType.ADMIN)) {
            review = reviewRepository.findById(reviewId)
                    .orElseThrow(() -> new RuntimeException("Review not found"));
        } else {
            review = reviewRepository.findByIdAndUserId(reviewId,currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("Unauthorized or review not found"));
        }

        Long productId = review.getProduct().getId();
        reviewRepository.delete(review);
        updateProductRating(productId);
    }

    public ReviewResponseDto updateReview(Long reviewId , User currentUser, ReviewRequestDto request){
        Review review = reviewRepository.findByIdAndUserId(reviewId, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Unauthorized or review not found"));

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setUpdatedAt(LocalDateTime.now());

        Review savedReview = reviewRepository.save(review);
        updateProductRating(review.getProduct().getId());

        return toDto(savedReview);
    }

    private void updateProductRating(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Double averageRating = reviewRepository.getAverageRatingByProductId(productId);
        Long reviewCount = reviewRepository.countByProductId(productId);

        product.setAverageRating(averageRating != null ? averageRating : 0.0);
        product.setReviewCount(reviewCount.intValue());

        productRepository.save(product);
    }

    private ReviewResponseDto toDto(Review review) {
        ReviewResponseDto responseDto = new ReviewResponseDto();

        responseDto.setId(review.getId());
        responseDto.setRating(review.getRating());
        responseDto.setComment(review.getComment());
        responseDto.setCreatedAt(review.getCreatedAt());
        responseDto.setUserId(review.getUser().getId());
        responseDto.setUsername(review.getUser().getUsername());

        return responseDto;
    }
}
