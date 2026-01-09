package com.vipulpatil.eCommerce.repository;

import com.vipulpatil.eCommerce.entity.Order;
import com.vipulpatil.eCommerce.entity.type.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserIdAndStatusOrderByCreatedAtDesc(Long id, OrderStatus orderStatus, Pageable pageable);
}