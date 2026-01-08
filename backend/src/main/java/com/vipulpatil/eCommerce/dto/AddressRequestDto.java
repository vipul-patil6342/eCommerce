package com.vipulpatil.eCommerce.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class AddressRequestDto {

    @NotBlank
    private String phone;

    @NotBlank
    private String pincode;

    @NotBlank
    private String country;

    @NotBlank
    private String state;

    @NotBlank
    private String city;

    @NotBlank
    private String house;

    @NotBlank
    private String street;

    private boolean defaultAddress;
}
