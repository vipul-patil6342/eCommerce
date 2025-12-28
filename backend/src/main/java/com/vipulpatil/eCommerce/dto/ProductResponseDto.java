package com.vipulpatil.eCommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponseDto {
    private Long id;
    private String name;
    private String description;
    private String category;
    private BigDecimal price;
    private String imageUrl;
    private Integer stock;
    private String brand;
    private double averageRating;
    private int reviewCount;
}
