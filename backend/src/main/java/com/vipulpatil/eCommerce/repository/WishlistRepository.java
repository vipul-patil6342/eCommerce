package com.vipulpatil.eCommerce.repository;

import com.vipulpatil.eCommerce.entity.User;
import com.vipulpatil.eCommerce.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findAllByUserId(Long userId);

    Optional<Wishlist> findByUserIdAndProductId(Long UserId, Long productId);
}