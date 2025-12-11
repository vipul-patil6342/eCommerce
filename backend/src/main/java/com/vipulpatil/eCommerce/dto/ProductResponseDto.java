package com.vipulpatil.eCommerce.dto;

import lombok.Data;

@Data
public class ProductResponseDto {
    private Long id;
    private String name;
    private String description;
    private String category;
    private Double price;
    private String imageUrl;
    private Integer stock;
}
