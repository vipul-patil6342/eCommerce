package com.vipulpatil.eCommerce.repository;

import com.vipulpatil.eCommerce.dto.ProductResponseDto;
import com.vipulpatil.eCommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("""
            SELECT new com.vipulpatil.eCommerce.dto.ProductResponseDto(
            p.id,p.name,p.description,p.category,p.price,p.imageUrl,p.stock,p.brand,p.averageRating,p.reviewCount
            )
            FROM Product p
            WHERE LOWER(p.name) LIKE %:q%
            OR LOWER(p.category) LIKE %:q%
            OR LOWER(p.description) LIKE %:q%
            OR LOWER(p.brand) LIKE %:q%
            """)
    Page<ProductResponseDto> search(@Param("q") String q, Pageable pageable);

    @Query("SELECT new com.vipulpatil.eCommerce.dto.ProductResponseDto(" +
            "p.id, p.name, p.description, p.category, p.price, p.imageUrl, " +
            "p.stock, p.brand, p.averageRating, p.reviewCount) " +
            "FROM Product p " +
            "WHERE LOWER(p.category) = LOWER(:category)")
    Page<ProductResponseDto> findByCategory(@Param("category") String category, Pageable pageable);

    @Query("SELECT new com.vipulpatil.eCommerce.dto.ProductResponseDto(" +
            "p.id, p.name, p.description, p.category, p.price, p.imageUrl, " +
            "p.stock, p.brand, p.averageRating, p.reviewCount) " +
            "FROM Product p WHERE p.stock < :threshold")
    Page<ProductResponseDto> findByLowStock(@Param("threshold") int threshold, Pageable pageable);
}