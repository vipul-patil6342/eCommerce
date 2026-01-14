package com.vipulpatil.eCommerce.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AddressRequestDto {

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[6-9][0-9]{9}$",
            message = "Phone number must be a valid 10-digit Indian number"
    )
    private String phone;

    @NotBlank(message = "Pincode is required")
    @Pattern(
            regexp = "^[1-9][0-9]{5}$",
            message = "Pincode must be a valid 6-digit Indian pincode"
    )
    private String pincode;

    @NotBlank(message = "Country is required")
    @Size(max = 50, message = "Country must be at most 50 characters")
    private String country;

    @NotBlank(message = "State is required")
    @Size(max = 50, message = "State must be at most 50 characters")
    private String state;

    @NotBlank(message = "City is required")
    @Size(max = 50, message = "City must be at most 50 characters")
    private String city;

    @NotBlank(message = "House/Flat information is required")
    @Size(max = 100, message = "House/Flat must be at most 100 characters")
    private String house;

    @NotBlank(message = "Street is required")
    @Size(max = 100, message = "Street must be at most 100 characters")
    private String street;

    private boolean defaultAddress;
}
