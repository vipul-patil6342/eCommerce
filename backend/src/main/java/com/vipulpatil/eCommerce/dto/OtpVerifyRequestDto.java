package com.vipulpatil.eCommerce.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OtpVerifyRequestDto {

    @NotBlank
    private String email;

    @NotBlank
    private String otp;
}
