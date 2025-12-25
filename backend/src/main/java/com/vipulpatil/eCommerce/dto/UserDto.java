package com.vipulpatil.eCommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {
    boolean authenticated;
    private Long userId;
    private String name;
    private String email;
    private List<String> roles;
}
