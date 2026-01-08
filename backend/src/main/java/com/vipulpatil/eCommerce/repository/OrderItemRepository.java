package com.vipulpatil.eCommerce.repository;

import com.vipulpatil.eCommerce.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}