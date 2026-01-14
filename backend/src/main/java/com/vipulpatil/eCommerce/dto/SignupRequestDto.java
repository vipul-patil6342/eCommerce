package com.vipulpatil.eCommerce.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignupRequestDto {

    @NotBlank
    @Max(50)
    private String name;

    @NotBlank
    @Max(50)
    private String username;

    @NotBlank
    @Min(8)
    @Max(64)
    private String password;
}
