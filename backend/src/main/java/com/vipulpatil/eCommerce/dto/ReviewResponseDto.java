package com.vipulpatil.eCommerce.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewResponseDto {
    private Long id;
    private int rating;
    private String comment;
    private Long userId;
    private String username;

    private LocalDateTime createdAt;
}
