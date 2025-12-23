package com.vipulpatil.eCommerce.controller;

import com.vipulpatil.eCommerce.dto.AddToCartRequestDto;
import com.vipulpatil.eCommerce.dto.CartDto;
import com.vipulpatil.eCommerce.entity.User;
import com.vipulpatil.eCommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    private User getAuthenticatedUser(Authentication authentication){
        if(authentication == null || !authentication.isAuthenticated()){
            throw new RuntimeException("User is not authenticated");
        }

        return (User) authentication.getPrincipal();
    }

    @PostMapping("/add")
    public ResponseEntity<CartDto> addToCart(@RequestBody AddToCartRequestDto request , Authentication authentication){
        User user = getAuthenticatedUser(authentication);
        CartDto cartDto = cartService.addToCart(user,request);
        return ResponseEntity.status(HttpStatus.CREATED).body(cartDto);
    }

    @GetMapping
    public ResponseEntity<CartDto> getCart(Authentication authentication){
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(cartService.getCart(user));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Authentication authentication){
        User user = getAuthenticatedUser(authentication);
        cartService.clearCart(user.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/update/{productId}")
    public ResponseEntity<CartDto> updateQuantity(@PathVariable Long productId, @RequestParam Integer quantity, Authentication authentication){
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(cartService.updateQuantity(user,productId,quantity));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<CartDto> removeFromCart(@PathVariable Long productId, Authentication authentication){
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(cartService.removeFromCart(user,productId));
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> getItemsCount(Authentication authentication){
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(cartService.getCartItemsCount(user));
    }
}
