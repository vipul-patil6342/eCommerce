package com.vipulpatil.eCommerce.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderAddress {

    @Column(name = "ship_phone", nullable = false)
    private String phone;

    @Column(name = "ship_pincode", nullable = false)
    private String pincode;

    @Column(name = "ship_country", nullable = false)
    private String country;

    @Column(name = "ship_state", nullable = false)
    private String state;

    @Column(name = "ship_city", nullable = false)
    private String city;

    @Column(name = "ship_street", nullable = false)
    private String street;

    @Column(name = "ship_house", nullable = false)
    private String house;

}
