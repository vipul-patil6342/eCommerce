package com.vipulpatil.eCommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCategoryCountResponseDto {
    private String categoryName;
    private Long totalProducts;
}
