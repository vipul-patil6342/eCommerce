package com.vipulpatil.eCommerce.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequestDto {
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private Integer stock;
}
