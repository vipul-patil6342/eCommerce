package com.vipulpatil.eCommerce.controller;

import com.vipulpatil.eCommerce.dto.WishlistDto;
import com.vipulpatil.eCommerce.entity.User;
import com.vipulpatil.eCommerce.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER','ADMIN')")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<WishlistDto>> getWishlist(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                wishlistService.getUserWishlist(user.getId())
        );
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Boolean> toggleWishlist(
            @PathVariable Long productId,
            @AuthenticationPrincipal User user
    ) {
        boolean added = wishlistService.toggleWishlist(user.getId(), productId);
        return ResponseEntity.ok(added);
    }
}
