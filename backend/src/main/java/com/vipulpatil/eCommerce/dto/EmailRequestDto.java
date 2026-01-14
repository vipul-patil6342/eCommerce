package com.vipulpatil.eCommerce.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmailRequestDto {

    @NotBlank
    private String email;
}
