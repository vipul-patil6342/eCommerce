package com.vipulpatil.eCommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long tokenId;

    @Column(unique = true)
    private String refreshToken;

    private Instant expiry;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;
}
