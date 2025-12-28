package com.vipulpatil.eCommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String brand;

    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private String category;

    private String imageUrl;

    private String publicId;

    @Column(nullable = false)
    private int stock;

    @OneToMany(mappedBy = "product" , cascade = CascadeType.ALL , orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    private double averageRating;

    private int reviewCount;

}
