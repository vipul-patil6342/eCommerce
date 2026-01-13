package com.vipulpatil.eCommerce.service;

import com.vipulpatil.eCommerce.dto.DashboardOverviewResponseDto;
import com.vipulpatil.eCommerce.dto.DashboardResponseDto;
import com.vipulpatil.eCommerce.dto.ProductCategoryCountResponseDto;
import com.vipulpatil.eCommerce.entity.type.DashboardRange;
import com.vipulpatil.eCommerce.repository.OrderRepository;
import com.vipulpatil.eCommerce.repository.ProductRepository;
import com.vipulpatil.eCommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public DashboardOverviewResponseDto getDashboardData(DashboardRange range) {

        LocalDateTime startDate = range.getStartDate();

        DashboardResponseDto totals = DashboardResponseDto.builder()
                .totalOrders(orderRepository.countPaidOrdersFromDate(null))
                .totalUsers(userRepository.countFromDate(null))
                .totalProducts(productRepository.countByCreatedAtFromDate(null))
                .totalRevenue(orderRepository.sumPaidOrderRevenueFromDate(null))
                .build();


        DashboardResponseDto filtered =  DashboardResponseDto.builder()
                .totalOrders(orderRepository.countPaidOrdersFromDate(startDate))
                .totalUsers(userRepository.countFromDate(startDate))
                .totalProducts(productRepository.countByCreatedAtFromDate(startDate))
                .totalRevenue(orderRepository.sumPaidOrderRevenueFromDate(startDate))
                .build();

        return DashboardOverviewResponseDto.builder()
                .totals(totals)
                .filtered(filtered)
                .build();
    }

    public List<ProductCategoryCountResponseDto> getProductCountByCategory() {
        return productRepository.getProductCountByCategory();
    }
}
