package com.vipulpatil.eCommerce.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequestDto {

    @NotBlank
    private String name;

    @NotBlank
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
    private String brand;
}
