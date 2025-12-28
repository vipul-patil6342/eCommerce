package com.vipulpatil.eCommerce.controller;

import com.vipulpatil.eCommerce.dto.ReviewRequestDto;
import com.vipulpatil.eCommerce.dto.ReviewResponseDto;
import com.vipulpatil.eCommerce.entity.User;
import com.vipulpatil.eCommerce.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reviews")
@Validated
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/{productId}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ReviewResponseDto> addReview(
            @PathVariable Long productId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ReviewRequestDto request
    ) {
        return ResponseEntity.ok(reviewService.addReview(productId, user, request));
    }

    @GetMapping("/product/{productId}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<Page<ReviewResponseDto>> getReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return ResponseEntity.ok(reviewService.getReviews(productId, page, size));
    }

    @PutMapping("/{reviewId}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ReviewResponseDto> updateReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ReviewRequestDto request
    ){
        return ResponseEntity.ok(reviewService.updateReview(reviewId, user, request));
    }

    @DeleteMapping("/{reviewId}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<String> deleteReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal User user
    ){
        reviewService.deleteReview(reviewId, user);
        return ResponseEntity.ok("Review deleted successfully");
    }
}
