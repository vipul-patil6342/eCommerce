package com.vipulpatil.eCommerce.repository;

import com.vipulpatil.eCommerce.entity.Order;
import com.vipulpatil.eCommerce.entity.type.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserIdAndStatusOrderByCreatedAtDesc(Long id, OrderStatus orderStatus, Pageable pageable);

    @Query("""
            SELECT COUNT(o)
            FROM Order o
            WHERE o.status = 'PAID'
            AND (:startDate IS NULL OR o.createdAt >= :startDate )
            """)
    Long countPaidOrdersFromDate(LocalDateTime startDate);

    @Query("""
            SELECT SUM(o.totalAmount)
            FROM Order o
            WHERE o.status = 'PAID'
            AND (:startDate IS NULL OR o.createdAt >= :startDate)
            """)
    BigDecimal sumPaidOrderRevenueFromDate(LocalDateTime startDate);
}