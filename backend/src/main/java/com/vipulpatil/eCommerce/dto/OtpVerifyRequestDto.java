package com.vipulpatil.eCommerce.dto;

import lombok.Data;

@Data
public class OtpVerifyRequestDto {
    private String email;
    private String otp;
}
