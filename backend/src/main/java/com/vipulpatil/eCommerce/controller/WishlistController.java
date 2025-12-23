package com.vipulpatil.eCommerce.controller;

import com.vipulpatil.eCommerce.dto.WishlistDto;
import com.vipulpatil.eCommerce.entity.User;
import com.vipulpatil.eCommerce.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<WishlistDto>> getWishlist(Authentication authentication){
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(wishlistService.getUserWishlist(user.getId()));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Boolean> toggleWishlist(@PathVariable Long productId, Authentication authentication){
        User user = (User) authentication.getPrincipal();
        boolean added = wishlistService.toggleWishlist(user.getId(), productId);
        return  ResponseEntity.ok(added);
    }
}
