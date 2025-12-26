package com.vipulpatil.eCommerce.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class AddressRequestDto {
    private String phone;
    private String pincode;
    private String country;
    private String state;
    private String city;
    private String house;
    private String street;
    private boolean defaultAddress;
}
