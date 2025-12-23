package com.vipulpatil.eCommerce.service;

import com.vipulpatil.eCommerce.dto.WishlistDto;
import com.vipulpatil.eCommerce.entity.User;
import com.vipulpatil.eCommerce.entity.Wishlist;
import com.vipulpatil.eCommerce.repository.ProductRepository;
import com.vipulpatil.eCommerce.repository.UserRepository;
import com.vipulpatil.eCommerce.repository.WishlistRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public List<WishlistDto> getUserWishlist(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return wishlistRepository.findAllByUserId(userId)
                .stream()
                .map(w -> new WishlistDto(
                        w.getProduct().getId(),
                        w.getProduct().getName(),
                        w.getProduct().getImageUrl(),
                        w.getProduct().getPrice(),
                        w.getProduct().getStock()
                )).toList();
    }

    public boolean toggleWishlist(Long userId, Long productId){
        log.info("Incoming userId = {}", userId);
        log.info("Incoming productId = {}", productId);
        Optional<Wishlist> existing = wishlistRepository.findByUserIdAndProductId(userId,productId);
        log.info("product :{}" , existing);

        if(existing.isPresent()){
            wishlistRepository.delete(existing.get());
            log.info("product deleted");
            return false;
        }

        Wishlist wishlist = Wishlist.builder()
                .user(userRepository.getReferenceById(userId))
                .product(productRepository.getReferenceById(productId))
                .build();

        wishlistRepository.save(wishlist);
        return true;
    }
}
