package com.vipulpatil.eCommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "reviews",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id","product_id"})
)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int rating;

    @Column(length = 1000)
    private String comment;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id",nullable = false)
    private Product product;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
