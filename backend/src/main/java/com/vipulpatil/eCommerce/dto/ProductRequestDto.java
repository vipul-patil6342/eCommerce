package com.vipulpatil.eCommerce.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequestDto {

    @NotBlank
    @Max(100)
    private String name;

    @NotBlank
    @Max(1000)
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01" , message = "Price must be greate than zero")
    private BigDecimal price;

    @NotBlank
    private String category;

    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock is required")
    private Integer stock;

    @NotBlank
    @Max(50)
    private String brand;
}
