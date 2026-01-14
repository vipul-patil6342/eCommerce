package com.vipulpatil.eCommerce.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class OtpVerifyRequestDto {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "OTP is required")
    @Pattern(
            regexp = "^[0-9]{6}$",
            message = "OTP must be a 6-digit number"
    )
    private String otp;
}
