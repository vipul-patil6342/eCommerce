package com.vipulpatil.eCommerce.controller;

import com.vipulpatil.eCommerce.dto.AddToCartRequestDto;
import com.vipulpatil.eCommerce.dto.CartDto;
import com.vipulpatil.eCommerce.entity.User;
import com.vipulpatil.eCommerce.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/cart")
@PreAuthorize("hasAnyRole('USER','ADMIN')")
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<CartDto> addToCart(
            @Valid  @RequestBody AddToCartRequestDto request,
            @AuthenticationPrincipal User user
    ) {
        CartDto cartDto = cartService.addToCart(user, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(cartDto);
    }

    @GetMapping
    public ResponseEntity<CartDto> getCart(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(cartService.getCart(user));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(
            @AuthenticationPrincipal User user
    ) {
        cartService.clearCart(user.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/update/{productId}")
    public ResponseEntity<CartDto> updateQuantity(
            @PathVariable Long productId,
            @RequestParam Integer quantity,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                cartService.updateQuantity(user, productId, quantity)
        );
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<CartDto> removeFromCart(
            @PathVariable Long productId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                cartService.removeFromCart(user, productId)
        );
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> getItemsCount(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                cartService.getCartItemsCount(user)
        );
    }
}
