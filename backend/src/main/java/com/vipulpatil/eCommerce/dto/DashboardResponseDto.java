package com.vipulpatil.eCommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponseDto {
    private Long totalOrders;
    private Long totalUsers;
    private BigDecimal totalRevenue;
    private Long totalProducts;
}
