package com.vipulpatil.eCommerce.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartRequestDto {

    @NotNull
    private Long productId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "quantity must be at least 1")
    private Integer quantity;
}
