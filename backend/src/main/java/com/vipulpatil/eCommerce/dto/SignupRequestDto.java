package com.vipulpatil.eCommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignupRequestDto {
    private String name;
    private String username;
    private String password;
}
