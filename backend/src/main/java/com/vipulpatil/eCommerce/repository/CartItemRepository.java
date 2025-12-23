package com.vipulpatil.eCommerce.repository;

import com.vipulpatil.eCommerce.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndProductId(Long id, Long id1);

    List<CartItem> findByCartId(Long id);

}