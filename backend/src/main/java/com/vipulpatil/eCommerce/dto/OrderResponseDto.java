package com.vipulpatil.eCommerce.dto;

import com.vipulpatil.eCommerce.entity.type.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponseDto {
    private Long id;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private String paymentId;
    private List<OrderItemDto> items;
}
