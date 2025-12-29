package com.vipulpatil.eCommerce.repository;

import com.vipulpatil.eCommerce.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional <Review> findByUserIdAndProductId(Long id, Long productId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double getAverageRatingByProductId(@Param("productId") Long productId);

    Long countByProductId(Long productId);

    @Query(value = "SELECT * FROM reviews WHERE product_id = :productId ORDER BY created_at DESC LIMIT 5", nativeQuery = true)
    List<Review> findByProductId(@Param("productId") Long productId);

    Optional<Review> findByIdAndUserId(Long reviewId, Long userId);
}