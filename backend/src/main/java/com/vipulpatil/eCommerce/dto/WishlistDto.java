package com.vipulpatil.eCommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WishlistDto {
    private Long productId;
    private String productName;
    private String imageUrl;
    private BigDecimal price;
    private Integer stock;
}
